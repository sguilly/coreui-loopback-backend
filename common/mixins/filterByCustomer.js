var debug = true

module.exports = function(Model, options) {

    Model.observe('before save', function filterProperties(ctx, next) {

        //if call from the server code
        if (Object.keys(ctx.options).length === 0) {
            next()
        } else {
            next()
        }
    })

    Model.observe('access', function(ctx, next) {

        if (debug) {
            console.log('access ' + Model.modelName + ' by ', ctx.options)
        }

        if (ctx.options.accessToken) {
            next()
        } else {
            next()
        }

    })

}