'use strict';

module.exports = function(server) {

    var log = server.log.child({
        child: 'boot.checkRole'
    });

    var Role = server.models.Role;

    Role.findOrCreate({ where: { name: 'admin' } }, {
        name: 'admin',
        description: 'Administrateur'
    }, function(err, role) {

        if (err) {
            log.error('err', err)
            return (err);
        }

        console.log('admin ok', role)
    })


    Role.findOrCreate({ where: { name: 'user' } }, {
        name: 'user',
        description: 'Utilisateur'
    }, function(err, role) {

        if (err) {
            log.error('err', err)
            return (err);
        }

        console.log('user ok', role)
    })

    Role.findOrCreate({ where: { name: 'customer-admin' } }, {
        name: 'customer-admin',
        description: 'Administrateur'
    }, function(err, role) {

        if (err) {
            log.error('err', err)
            return (err);
        }

        console.log('customer-admin ok', role)
    })

    Role.findOrCreate({ where: { name: 'customer-user' } }, {
        name: 'customer-user',
        description: 'Utilisateur'
    }, function(err, role) {

        if (err) {
            log.error('err', err)
            return (err);
        }
        console.log('customer-user ok', role)
    })

    Role.findOrCreate({ where: { name: 'customer-endUser' } }, {
        name: 'customer-endUser',
        description: 'Client final'
    }, function(err, role) {

        if (err) {
            log.error('err', err)
            return (err);
        }
        console.log('customer-endUser ok', role)
    })
};