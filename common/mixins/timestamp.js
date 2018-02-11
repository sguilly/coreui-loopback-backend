var shortid = require('shortid');

module.exports = function(Model, options) {

    // Model is the model class
    // options is an object containing the config properties from model definition

    Model.defineProperty('shortId', {
        type: String,
        default: shortid.generate()
    });
    Model.defineProperty('creationDate', {
        type: Date,
        default: '$now'
    });
    Model.defineProperty('lastModificationDate', {
        type: Date,
        default: '$now'
    });

    Model.observe('before save', function event(ctx, next) { //Observe any insert/update event on Model

        if (ctx.instance) {
            ctx.instance['lastModificationDate'] = new Date();

            if (!ctx.instance.shortId) {
                ctx.instance.shortId = shortid.generate()
            }


        } else {

            ctx.data['lastModificationDate'] = new Date();

            if (!ctx.data.shortId) {
                ctx.data.shortId = shortid.generate()
            }
        }
        next();
    });

};