var pjson = require('./../package.json')
    , {shell} = require('electron')
    , fs = require('fs')
    , fse = require('fs-extra')
    , ejs = require('ejs')
    , Conf = require('conf')
    , config = new Conf()
    , joomla = require('./joomla')

module.exports = {
    init: function (header, content, console) {
        var headerText = header ? header : pjson.productName + ' <code>' + pjson.version + '</code>'
            , contentText = content ? content : ''
            , consoleText = console ? console : ''

        $('#header').html('<h2><img src="img/logo.png" height="70px"/> ' + headerText + '</h2>')
        $('#content').html(contentText)
        $('#console').html(consoleText)
        $('footer .product').html('<img src="img/logo.png" height="24px"/> ' + pjson.productName + ' ' + pjson.version + ' - ')
    },

    fillProjectList: function () {
        var projects = config.get('joomlanager.projects')
            , navigation = $('#navigation')
            , caller = this

        if (projects) {
            projects.sort(function (a, b) {
                if (a.name < b.name)
                    return -1
                if (a.name > b.name)
                    return 1
                return 0
            })
            navigation.empty()
            projects.forEach(function (project) {
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
        var projects = config.get('joomlanager.projects')
            , project = null
            , caller = this

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

        $('#btnDeleteProject').on('click', function () {
            var name = $('#name').val()
            for (var key in projects) {
                if (projects[key].name == name) {
                    projects.splice(key, 1)
                }
            }

            config.set('joomlanager.projects', projects)

            caller.fillProjectList()
        })

        $('#btnDeleteProjectFiles').on('click', function () {
            $(this).text('Deleting...')
            var name = $('#name').val()
            for (var key in projects) {
                if (projects[key].name == name) {
                    console.log(projects[key])
                    fse.removeSync(projects[key].serverPath)
                    projects.splice(key, 1)
                }
            }

            config.set('joomlanager.projects', projects)

            caller.init()
            caller.fillProjectList()
        })

        $('#localURL').on('input', function () {
            caller.updateEditForm()
        })

        this.updateProjectStatus()
        this.updateEditForm()
    },

    updateProjectStatus: function () {
        var serverPath = $('#serverPath').val()
            , list = $('#projectStatus')
            , ok = '<span class="alert-success glyphicon glyphicon-ok"></span>'
            , error = '<span class="alert-danger glyphicon glyphicon-remove"></span>'

        if (joomla.isJoomla(serverPath)) {
            list.append('<li>Is Joomla! ' + ok + '</li>')
            if (joomla.hasConfig(serverPath)) {
                list.append('<li>Config found</li>')

            } else {
                list.append('<li>Config NOT found! ' + error + '</li>')

            }
        } else {
            list.append('<li>Is NOT Joomla!</li>')
        }
    },

    updateEditForm: function () {
        var linkLocal = $('span.localURL').find('a')
            , inputUrl = $('#localURL')

        linkLocal.text(inputUrl.val())
        linkLocal.on('click', function () {
            shell.openExternal($(this).text())
            return false
        })
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
        var path = __dirname + '/../partials/' + name + '.ejs'
            , tpl = fs.readFileSync(path)

        // Required for sub template includes only
        object.filename = path

        return ejs.render(tpl.toString(), object)
    },

    /**
     * Load a modal from template.
     *
     * @param {Object} properties must contain "id"
     */
    loadModal: function (properties) {
        $('#modal').html(this.tpl(properties.id, properties))
    }
}
