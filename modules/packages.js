var fs = require('fs')
    , archive = require('./archive')

module.exports = {
    assetDir: './packages',
    exists: function (asset) {
        return fs.existsSync(this.assetDir + '/' + asset.name)
    },
    download: function (asset, destination, cb) {
        var http = require('request')
            , assetDir = this.assetDir
            , modalConsole = $('#modalConsole')

        if (false == fs.existsSync(assetDir)) {
            fs.mkdirSync(assetDir)
        }

        if (fs.existsSync(assetDir + '/' + asset.name)) {
            // Asset already downloaded
            modalConsole.text('Found in cache: ' + asset.name)

            if (destination) {
                archive.extract(assetDir + '/' + asset.name, destination, cb)
            }

            return
        }

        modalConsole.html('Requesting download&hellip;')

        http
            .get(asset.browser_download_url)
            .on('error', function (err) {
                console.log(err)
                $('#modalConsoleError').text(err)
            })
            .on('response', function (response) {
                //console.log(response.statusCode)
                if (200 != response.statusCode) {
                    console.log('file not found')
                    $('#modalConsoleError').text('File not found!')
                }
                //console.log(response.headers['content-type'])
                var totalBytes = 0
                    , mb

                response.on('data', function (data) {
                    totalBytes += data.length
                    mb = totalBytes / 1024 / 1024
                    modalConsole.text('Downloading ' + asset.name + ' - ' + mb.toFixed(2) + ' MB')
                })

                response.on('end', function () {
                    console.log('finished')
                    modalConsole.append(' Finished')
                    if (destination) {
                        archive.extract(assetDir + '/' + asset.name, destination, cb)
                    }
                })
            })
            .pipe(fs.createWriteStream(assetDir + '/' + asset.name))
    }
}
