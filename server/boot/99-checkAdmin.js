'use strict';

module.exports = function(server) {

    var log = server.log.child({
        child: 'boot.checkAdmin'
    });

    var userToCreate = {
        customerId: '0',
        password: 'admin',
        email: 'admin@youremaildomain.com',
        role: 'admin'
    }

    var Customer = server.models.customer;
    var User = server.models.user;
    var Role = server.models.Role;
    var RoleMapping = server.models.RoleMapping;

    var debug = console.log;

    var addRole = function(name, user) {

        Role.findOrCreate({
            where: {
                name: name
            }
        }, {
            name: name
        }, function(err, role) {
            if (err) {
                log.error('err', err)
                return (err);
            }

            debug(role);

            debug('RoleMapping.USER=', RoleMapping.USER);
            debug('principalId =', user.id);
            debug('roleId=', role.id);

            RoleMapping.findOrCreate({
                where: {
                    and: [{
                        principalType: RoleMapping.USER
                    }, {
                        principalId: user.id.toString()
                    }, {
                        roleId: role.id
                    }]
                }
            }, {
                principalType: RoleMapping.USER,
                principalId: user.id,
                roleId: role.id,
                roleName: role.name
            }, function(err, principal) {
                if (err) log.error('err', err);
                debug(principal);
            });
        });
    }

    User.find({
        where: {
            email: userToCreate.email
        }
    }, function(err, users) {

        if (err) {
            log.error(err)
        } else {
            if (users.length == 0) {
                User.create(userToCreate).then(function(user) {
                        debug('create user=', user)
                        addRole(userToCreate.roleName, user)
                    })
                    .catch(function(err) {
                        log.error('err', err)
                    })
            } else {
                addRole(userToCreate.roleName, users[0])
            }
        }


    });
};