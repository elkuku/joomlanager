var pjson = require('./../package.json'),
    fs = require('fs'),
    ejs = require('ejs'),
    Conf = require('conf'),
    config = new Conf()

module.exports = {
    init: function (header, content, console) {
        var headerText = header ? header :  pjson.productName + ' <code>' + pjson.version + '</code>',
            contentText = content ? content : '',
            consoleText = console ? console : ''

        $('#header').html('<h2><img src="img/logo.png" height="70px"/> ' + headerText + '</h2>');
        $('#content').html(contentText)
        $('#console').html(consoleText)
        $('footer .product').html('<img src="img/logo.png" height="24px"/> ' + pjson.productName + ' ' + pjson.version + ' - ')
    },

    fillProjectList: function () {
        var projects = config.get('joomlanager.projects'),
            navigation = $('#navigation'),
            caller = this

        if (projects) {
            navigation.empty()
            projects.forEach(function(project) {
                navigation.append('<li>' + project.name + '</li>')
            })
            navigation.find('li').on('click', function () {
                caller.showProject($(this).text())
                navigation.find('li').removeClass('selected')
                $(this).addClass('selected')
            })
        }
    },

    showProject: function (name) {
        var projects = config.get('joomlanager.projects'),
            project = null

        projects.forEach(function (p) {
            if (p.name == name) {
                project = p
            }
        })

        if (!project) {
            alert('invalid project')

            return
        }

        this.init('Edit Project', this.tpl('projectEdit', {project: project, config: config}))
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