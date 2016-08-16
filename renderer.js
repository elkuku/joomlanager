$(function () {
    const
        Conf = require('conf')
        , config = new Conf()
        , configuration = require('./modules/configuration')
        , content = require('./modules/content')
        , joomla = require('./modules/joomla')
        , project = require('./modules/project')
        , repository = require('./modules/repository')

    // Check if "Wheit" (Light) theme is selected
    if ('Bläk' == config.get('joomlanager.theme')) {
        $('head link#styleSheet').attr('href', 'css/joomlanager_dark.css')
    }

    $('.header.row.navi').html(content.tpl('cmdBox', {}))

    var cmdBox = $('.cmdBoxNavi')

    content.init()

    // Setup buttons

    cmdBox.find('[data-toggle=new]').on('click', function () {
        project.new()

        return false
    })

    cmdBox.find('[data-toggle=config]').on('click', function () {
        configuration.show()

        return false
    })

    cmdBox.find('[data-toggle=reload]').on('click', function () {
        content.init('', content.tpl('alert', {type: 'info', message: 'Reloading...'}))
        joomla.getReleases()

        return false
    })

    cmdBox.find('[data-toggle=theme]').on('click', function () {
        var e = $('head link#styleSheet')

        if (e.attr('href').indexOf('dark') > 0) {
            e.attr('href', 'css/joomlanager.css')
        } else {
            e.attr('href', 'css/joomlanager_dark.css')
        }

        return false
    })

    content.fillProjectList()
})
