var pjson = require('./../package.json'),
    fs = require('fs'),
    ejs = require('ejs')


module.exports = {
    init: function (message) {
        $('#header').html('<h2><img src="img/logo.png" height="70px"/> ' + pjson.productName + ' <code>' + pjson.version + '</code></h2>');
        $('#content').html('')
        $('#console').html('')
        $('footer').prepend('<img src="img/logo.png" height="24px"/> ' + pjson.productName + ' ' + pjson.version + ' - ')

        if (message) {
            $('#console').html(message);
        }
    },
    /**
     * Load a ejs template.
     *
     * @param name
     * @param object
     *
     * @returns {String}
     */
    tpl: function (name, object) {
        var path = __dirname + '/../partials/' + name + '.ejs',
            tpl = fs.readFileSync(path)

        // Required for sub template includes only
        object.filename = path

        return ejs.render(tpl.toString(), object)
    }
}