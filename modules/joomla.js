var fs = require('fs'),
    http = require('request')

module.exports = {
    GitHubURL: 'https://github.com/joomla/joomla-cms',
    /**
     * Check if a path contains a Joomla! installation.
     * @param {String} path
     * @returns {boolean}
     */
    isJoomla: function (path) {
        if (false == fs.existsSync(path + '/administrator')) {
            return false
        } else if (false == fs.existsSync(path + '/components')) {
            return false
        }

        return true
    },
    /**
     * Check for configuration.php
     * @param {String} path
     * @returns {boolean}
     */
    hasConfig: function (path) {
        return fs.existsSync(path + '/configuration.php')
    },
    /**
     * Read a Joomla! config file
     * @param {String} path
     * @returns {{}}
     */
    readConfig: function (path) {
        var cfgFile = fs.readFileSync(path).toString().split("\n"),
            config = {},
            result, line

        for(line in cfgFile) {
            result = cfgFile[line].match(/public \$(.*) = '(.*)';/)
            if (result) {
                config[result[1]] = result[2]
            }
        }

        return config
    },

    getReleases: function () {
        var GitHub = require('octonode')

        var client = GitHub.client()

        var response = client.get('/repos/joomla/joomla-cms/releases', function (err, status, body) {
            console.log(body); //json object

            return body
        });

        return response;

        var repo = client.repo;

        console.log(repo)

        return repo.releases()
    }
}