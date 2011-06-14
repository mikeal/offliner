var path = require('path')

var command = ['sync', path.join(__dirname, '..', 'lib', 'app.js'), process.argv[process.argv.length - 1]]
var s = require('child_process').spawn('couchapp', command)
s.stdout.pipe(process.stdout)
s.stderr.pipe(process.stderr)
// setInterval(function () {}, 100000)
process.on('exit', function () {s.end()})