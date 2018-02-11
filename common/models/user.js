var app = require('../../server/server');

var log = app.log.child({
    child: 'user'
});

var debug = true

module.exports = function(User) {
    var PersistedModel = User;

    var nativeHasPassword = User.prototype.hasPassword

    User.prototype.hasPassword = function() {

        console.log('hasPassword', this)

        if (this.actif == (false)) {

            console.log('1- USER NOT ACTIF !!!!!')
            console.log('1- USER NOT ACTIF !!!!!')
            console.log('1- USER NOT ACTIF !!!!!')

            arguments[1](null, false)
        } else {
            nativeHasPassword.apply(this, arguments);
        }


    }

    PersistedModel.beforeRemote('login', function(ctx, login, next) {

        if (debug) console.log('try to login', login);

        var user = ctx.options.user

        console.log('user=', user)



        next();


    });


    PersistedModel.observe('after save', function filterProperties(ctx, next) {
        console.log('AFTER SAVE USER ctx i=', ctx.instance);

        if (ctx.instance) {
            if (ctx.instance.role) {
                app.models.Role.findOrCreate({ where: { name: ctx.instance.role } }, {
                    name: ctx.instance.role
                }, function(err, role) {
                    if (err) return (err);
                    if (debug) console.log(role);

                    if (debug) console.log('RoleMapping.USER=', app.models.RoleMapping.USER);
                    if (debug) console.log('principalId =', ctx.instance.id);
                    if (debug) console.log('roleId=', role.id);


                    app.models.RoleMapping.findOrCreate({
                        where: {
                            and: [{ principalType: app.models.RoleMapping.USER },
                                { principalId: ctx.instance.id.toString() },
                                { roleId: role.id }
                            ]
                        }
                    }, {
                        principalType: app.models.RoleMapping.USER,
                        principalId: ctx.instance.id,
                        roleId: role.id,
                        roleName: role.name
                    }, function(err, principal) {
                        if (err) return console.log(err);
                        if (debug) console.log(principal);
                    });
                });


            }
        }


        next();
    });


    PersistedModel.remoteMethod(
        'checkPhone', {
            returns: {
                arg: 'val',
                type: 'object'
            }
        }
    );

    PersistedModel.checkPhone = function(options, cb) {

        var userId = options.accessToken.userId;

        app.models.user.find({ where: {} }, function(err, users) {

            if (err) {
                cb('db err');
            } else {
                cb(null, currentUser);
            }

        })

    };


    PersistedModel.changePassword = function(password, options, cb) {

        log.trace('Change password for user=', options.user);

        app.models.user.findById(options.accessToken.userId, function(err, currentUser) {
            if (err) {
                cb('user not found');
            } else {
                log.trace('Change password for user=', currentUser);
                currentUser.password = password;
                currentUser.passwordChanged = true;
                currentUser.save();
                cb(null, currentUser);
            }
        })
    };

    PersistedModel.remoteMethod(
        'changePassword', {
            accepts: {
                arg: 'password',
                type: 'string'
            },
            returns: {
                arg: 'val',
                type: 'object'
            }
        }
    );

    PersistedModel.checkIfEmailExist = function(email, options, cb) {

        log.trace('check email=', email);

        try {

            PersistedModel.find({
                where: {
                    email: email
                }
            }, function(err, values) {

                if (err) {
                    cb(err)
                } else {

                    log.trace('find email=', values.length)

                    if (values.length > 0) {
                        cb(null, 1);
                    } else {
                        cb(null, 0);
                    }
                }

            });

        } catch (err) {
            log.trace('ERRRRR !!!=', err);
            cb('error', null);
        }

    };

    PersistedModel.remoteMethod(
        'checkIfEmailExist', {
            accepts: {
                arg: 'email',
                type: 'string'
            },
            returns: {
                arg: 'val',
                type: 'object'
            }
        }
    );

    User.on('resetPasswordRequest', function(info) {

        if (debug) console.log('try to reset', info);

        var app = require('../../server/server');

        var html = require('./user.passwordResetRequestMail.js')(app, info);

        var mail = {
            from: 'no-reply@youremaildomain.com',
            to: info.user.email,
            subject: 'Réinitialisation MDP',
            html: html
        };

        log.trace(`send mail Reset Password ${info.user.email}`);

        try {
            app.sendMail(mail)
                .then(function() {

                    log.trace('mail sent : Reset password')
                })
                .catch(function(err) {
                    log.error(err)
                })
        } catch (error) {
            log.error('Error : send mail for reset password:', error)
        }
    });

    User.beforeRemote('create', function(ctx, inst, next) {
        if (!ctx.req.body.password) {
            //In user creation, when password is not defined in form values
            //we generate a random password
            ctx.req.body.password = Math.random().toString(36).slice(-8);
        }
        ctx.req.body.passwordChanged = false;
        //Keep plain password in context for usage in account creation confirmation mail
        ctx.userCreationPlainPassword = ctx.req.body.password;
        next();
    });

    User.afterRemote('create', function(context, user, next) {
        var app = require('../../server/server');

        log.trace(`send mail Welcome ${user.email}`);

        //context.userCreationPlainPassword is defined in User.beforeRemote::create hook
        var html = `
        Identifiant : <strong>${user.email}</strong><br>
        Mot de passe&nbsp;: <strong>${context.userCreationPlainPassword}</strong>

        `


        var mail = {
            from: 'no-reply@youremaildomain.com',
            to: user.email,
            subject: 'Bienvenue',
            html: html
        };

        try {
            app.sendMail(mail)
                .then(function() {
                    log.trace('mail sent : Welcome')
                })
                .catch(function(err) {
                    log.error(err)
                })
        } catch (error) {
            log.error('Error : send mail Welcome:', error)
        }
        next();
    });

    app.register(PersistedModel, require('./user.whoami').remote)
}