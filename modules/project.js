var fs = require('fs'),
    Conf = require('conf'),
    config = new Conf(),
    {dialog} = require('electron').remote
    , {shell} = require('electron'),
    packages = require('../modules/packages'),
    content = require('../modules/content'),
    joomla = require('../modules/joomla'),
    joomlaGitHub = config.get('joomlaGitHub') ? config.get('joomlaGitHub') : {}

module.exports = {
    new: function () {
        content.init('New Project', content.tpl('project', {releases:joomlaGitHub.releases, config:config}))

        this.updateInfo()

        var inputName = $('#name'),
            inputLocalURL = $('#localURL')
            , serverPath = $('#serverPath'),
            selectRelease = $('#release'),
            chkStableOnly = $('#chkStableOnly'),
            chkIsSubDir = $('#chkIsSubDir'),
            chkURL = $('#chkURL'),
            projectStatus = $('#projectStatus'),
            parent = this

        inputName.on('input', function () {
            parent.updateInfo()
        })

        inputLocalURL.on('input', function () {
            parent.updateInfo()
        })

        serverPath.on('input', function () {
            parent.updateInfo()
        })

        selectRelease.on('change', function () {
            parent.updateInfo()
        })

        chkURL.change(function() {
            parent.updateInfo()
        })

        chkStableOnly.change(function() {
            if($(this).is(':checked')) {
                selectRelease.find('option').each(function (i, option) {
                    if (/Candidate|Beta|Alpha/.test($(option).text())) {
                        $(option).hide()
                    }
                })
            } else {
                selectRelease.find('option').each(function (i, option) {
                    $(option).show()
                })
            }
        });

        chkIsSubDir.change(function() {
            parent.updateInfo()
        })

        chkStableOnly.prop('checked', true).change()
        chkIsSubDir.prop('checked', true).change()
        chkURL.prop('checked', true).change()

        $('#btnSaveProject').on('click', function () {
            var selected = selectRelease.find(':selected'),
                release = joomlaGitHub.releases[selected.data('release')],
                projectName = inputName.val(),
                selectedAsset = joomla.findDownloadPackage(release),
                projectPath = $('#serverPath').val()
                , modalStatus = $('#modalStatus')

            if (chkIsSubDir.is(':checked')) {
                projectPath += '/' + projectName
            }

            if (!projectName) {
                dialog.showErrorBox('Please check the following:', 'Enter a valid project name')
                $('#name').focus()
                return false
            }

            // @todo check project name unique

            if (null == selectedAsset) {
                dialog.showErrorBox('Joomla! maintainer error', 'No valid package found for release: ' + $('#release').val())
                return false
            }

            content.loadModal({id: 'modalStatus', header: 'Creating your project&hellip;'})
            //$('#modal').html(content.tpl('modalStatus', {id: 'modalStatus', header: 'Creating your project&hellip;'}))

            modalStatus.find('.close').hide()

            // Something fishy here - can't use var object - modal wont open ;(
            $('#modalStatus').modal({
                backdrop: 'static',
                keyboard: false
            })

            packages.download(selectedAsset, projectPath, parent.saveForm)

            return false
        })
    },
    updateInfo: function () {
        var inputName = $('#name'),
            inputServerPath = $('#serverPath'),
            inputLocalURL = $('#localURL'),
            selectRelease = $('#release'),
            release = joomlaGitHub.releases[selectRelease.find(':selected').data('release')],

            projectStatus = $('#projectStatus'),
            statusProjectName = projectStatus.find('.projectName'),
            statusProjectPath = projectStatus.find('.projectPath'),
            statusRelease = projectStatus.find('.release'),
            statusReleaseStatus = projectStatus.find('.releaseStatus'),
            statusPathStatus = projectStatus.find('.pathStatus'),
            statusURL = projectStatus.find('.localURL a'),
            chkIsSubDir = $('#chkIsSubDir')
            , chkURL = $('#chkURL')


        var assetObject = joomla.findDownloadPackage(release),
            assetStatus, projectName, projectPath, pathStatus, localURL

        projectPath = inputServerPath.val()

        if (chkIsSubDir.is(':checked')) {
            projectPath += '/' + inputName.val()
        }

        if (chkURL.is(':checked')) {
            localURL = 'http://localhost/' + inputName.val()
            inputLocalURL.val(localURL)
        } else {
            localURL = inputLocalURL.val()
        }
        
        pathStatus = fs.existsSync(projectPath)
            ? '<span class="alert-warning">Exists</span>'
            : '<span class="alert-success">Empty</span>'

        projectName = inputName.val() ? inputName.val() : '<name>'

        assetStatus =
            assetObject ?
                packages.exists(assetObject) ?
                    '<span class="alert-info">Cached</span>' :
                    '<span class="alert-warning">Download Pending</span>' :
                '<span class="alert-danger">Invalid!</span>'

        statusURL.text(localURL)
        statusURL.on('click', function () {
            shell.openExternal(localURL)
            return false
        })

        statusProjectName.text(projectName)
        statusProjectPath.text(projectPath)
        statusRelease.text(selectRelease.val())
        statusReleaseStatus.html(assetStatus)
        statusPathStatus.html(pathStatus)
    },
    saveForm: function () {
        var inputName = $('#name')
            , inputLocalURL = $('#url')
            , inputServerPath = $('#serverPath')
            , projectPath = inputServerPath.val()
            , chkIsSubDir = $('#chkIsSubDir')
            , selectRelease = $('#release')
            , chkURL = $('#chkURL')
            , localURL

        if (chkIsSubDir.is(':checked')) {
            projectPath += '/' + inputName.val()
        }

        if (chkURL.is(':checked')) {
            localURL = 'http://localhost/' + inputName.val()
        } else {
            localURL = inputLocalURL.val()
        }

        var project = {
            name: inputName.val(),
            serverPath: projectPath,
            localURL: localURL,
            installedVersion: selectRelease.val()
            // @todo more here
        }

        var projects = config.get('joomlanager.projects')

        if (projects) {
            projects.push(project)
            config.set('joomlanager.projects', projects)

        } else {
            config.set('joomlanager.projects', [project])
        }

        content.fillProjectList()
        content.showProject(project.name)
    }
}
