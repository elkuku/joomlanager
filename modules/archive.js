var fs = require('fs')

module.exports = {
    extract: function (path, destination) {
        if (path_is_a_tar_gz = true) {
            this.extractTarGz(path, destination)
        } else {
            extract_something_else = true
        }
    },
    extractTarGz: function (path, destination) {
        var targz = require('tar.gz')

        $('#modalConsoleExtract').html('Extracting the package&hellip;')

        var read = fs.createReadStream(path)
        var write = targz().createWriteStream(destination);

        write.on('entry', function(entry){
            $('#modalConsoleExtract').text('Extracting: ' + entry.path)
        })

        write.on('end', function(){
            $('#modalConsoleExtract').append('Finished extracting.')
            $('#modalStatus').modal('hide')
        })

        write.on('error', function (err) {
            console.log('Something is wrong ', err.stack);
            $('#modalConsoleError').html('Something is wrong ', err.stack)
            $('#modalStatus').find('.close').show()
        })

        read.pipe(write)
    }
}