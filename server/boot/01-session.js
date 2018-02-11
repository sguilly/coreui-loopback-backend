'use strict';

var debug = true

module.exports = function(app) {


    app.remotes().phases
        .addBefore('invoke', 'options-from-request')
        .use(function(ctx, next) {
            if (ctx.args.options && ctx.args.options.accessToken) {
                const User = app.models.User;
                User.findById(ctx.args.options.accessToken.userId, function(err, user) {
                    if (err) return next(err);
                    ctx.args.options.currentUser = user;
                    next();
                });
            } else {
                next();
            }

        });


    var log = app.log.child({
        child: 'session'
    });

    // function inject(ctx, next) {

    //     console.log('inject', ctx.args.options)
    //     var options = hasOptions(ctx.method.accepts) && (ctx.args.options || {});
    //     if (options && ctx.req.accessToken) {
    //         options.accessToken = ctx.req.accessToken;

    //         if (debug) console.log('inject token :', options.accessToken)

    //         app.models.user.findById(ctx.req.accessToken.userId, function(err, user) {

    //             if (debug) console.log('err=', err)
    //             if (debug) console.log('user=', user)

    //             if (err) {
    //                 log.error('err', err)
    //             } else {
    //                 options.user = { customerId: user.customerId, role: user.role, agencyId: user.agencyId, email: user.email }
    //                 ctx.args.options = options;
    //                 next();
    //             }


    //         })
    //     } else {
    //         next();
    //     }

    // }

    // function hasOptions(accepts) {
    //     for (var i = 0; i < accepts.length; i++) {
    //         var argDesc = accepts[i];
    //         if (argDesc.arg === 'options' && argDesc.injectCtx) {
    //             return true;
    //         }
    //     }
    // }

    // // if (!process.env.GENERATING_SDK) {
    // app.remotes().before('*.*', inject);

    // app.remotes().before('*.prototype.*', function(ctx, instance, next) {
    //     if (typeof instance === 'function') {
    //         next = instance;
    //     }
    //     inject(ctx, next);
    // });

    // var blacklist = ['login', 'logout', 'confirm', 'resetPassword'];

    // // // unfortunately this requires us to add the options object
    // // // to the remote method definition
    // app.remotes().methods().forEach(function(method) {
    //     if (!hasOptions(method.accepts) && blacklist.indexOf(method.name) === -1) {

    //         // console.log('method', method.accepts)
    //         // method.accepts.push({
    //         //     arg: 'options',
    //         //     description: '**Do not implement in clients**',
    //         //     type: 'object',
    //         //     injectCtx: true
    //         // });
    //     }
    // });
    // // }
};