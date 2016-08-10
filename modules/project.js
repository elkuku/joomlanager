var Project = function () {
    var name
    var location
    var config
}

Project.prototype.setConfig = function (config) {
    this.config = config
}

Project.prototype.getcreds = function () {
    console.log(this.config)
    return this.config.user + '/' + this.config.password + ' name:' + this.name
}

module.exports = Project
