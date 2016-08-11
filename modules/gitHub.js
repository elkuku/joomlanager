var client = require('octonode').client()

module.exports = {
    getReleases: function (owner, repo) {
        client.get('/repos/joomla/joomla-cms/releases', function (err, status, body) {

            if (err) {
                console.log(err)
                $('#console').text(err)
            } else {
                joomlaGitHub.releases = body

                config.set('joomlaGitHub', joomlaGitHub)

                updateInfo()
            }
        });

    }
}