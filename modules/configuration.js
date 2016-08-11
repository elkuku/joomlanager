var Conf = require('conf'),
    config = new Conf(),
    content = require('../modules/content'),
    fs = require('fs'),
    {dialog} = require('electron').remote

module.exports = {
    show: function () {
        $('#header').html('<h3><img src="img/logo.png" height="70px"/> Configuration</h3>');
        $('#content').html(content.tpl('config', {config:config}));
        $('#console').html('');

        $('#cfgTheme').on('change', function () {
            var e = $('head link#styleSheet');

            if ('Bläk' == $(this).val()) {
                e.attr('href', 'css/joomlanager_dark.css');
            } else {
                e.attr('href', 'css/joomlanager.css');
            }
        });

        $('#btnSaveConfig').on('click', function () {
            var localhost = $('#cfgLocalhost').val(),
                theme = $('#cfgTheme').val(),
                debug = $('#cfgDebug').is(':checked') ? true : false;

            if (localhost && false == fs.existsSync(localhost)) {
                dialog.showErrorBox('Invalid Path', 'The localhost directory path is invalid');
                return;
            }

            config.set('localhost', localhost);
            config.set('debug', debug);
            config.set('theme', theme);

            content.init(content.tpl('alert', {type:'info', message:'Config saved.'}));
        });
    }
}