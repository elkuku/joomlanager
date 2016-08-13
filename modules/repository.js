var fs = require('fs')

module.exports = {
    repoDir: '../repository',
    exists: function () {
        return fs.existsSync(this.repoDir)
    },
    clone: function () {
        if (fs.existsSync(this.repoDir)) {
            return
        }

        require('simple-git')()
            .outputHandler(function (command, stdout, stderr) {
                stdout.pipe(process.stdout);
                stderr.pipe(process.stderr);
            })
            .then(function() {
                console.log('Starting clone...');
                $('#console').text('Start cloning...')
            })
            //.clone('https://github.com/joomla/joomla-cms.git', this.repoDir)
            .clone('https://github.com/elkuku/lilhelpers.git', this.repoDir)
            .then(function() {
                console.log('clone done.');
                $('#console').text('clone done')
            });

        //@todo ui response
    },
    fetch: function () {

    }
}