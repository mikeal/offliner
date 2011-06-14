var path = require('path')

var command = 'couchapp sync '+path.join(__dirname, '..', 'lib', 'app.js')+' '+process.argv[process.argv.length - 1]
console.log(command)
var s = require('child_process').spawn(command)
s.stdout.pipe(process.stdout)
s.stderr.pipe(process.stderr)
process.on('exit', function () {s.close()})