var app = require('../../server/server');

var log = app.log.child({
    child: 'user.whoami'
});

var remote = {

    path: 'whoami',

    options: {
        accepts: [

            { "arg": "options", "type": "object", "http": "optionsFromRequest" }
        ],
        returns: {
            root: true,
            type: 'object'
        }
    },

    method: function(options, cb) {

        console.log('options=', options)

        if (options.currentUser) {
            cb(null, options.currentUser)
        } else {
            cb('user not found')
        }

    }

}

module.exports = { remote }