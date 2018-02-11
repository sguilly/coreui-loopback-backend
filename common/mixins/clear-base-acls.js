// var appRoot = require('app-root-path');

// module.exports = function(Model, options) {

//     var configFile = options.config;
//     if (!configFile) {
//         // Works for 99% of cases. For others, set explicit path via options.
//         console.log('path of config file')
//         configFile = '/common/models/' + slugify(Model.modelName) + '.json';
//     }

//     var config = appRoot.require(configFile);
//     if (!config || !config.acls) {
//         console.error('ClearBaseAcls: Failed to load model config from', configFile);
//         return;
//     }

//     Model.settings.acls.length = 0;
//     config.acls.forEach(function(r) {

//         console.log('add acl', r)
//         Model.settings.acls.push(r);
//     });
// };

// function slugify(name) {
//     name = name.replace(/^[A-Z]+/, function(s) { return s.toLowerCase(); });
//     return name.replace(/[A-Z]/g, function(s) { return '-' + s.toLowerCase(); });
// }