var path = require('path')

var command = 'couchapp push '+path.join(__dirname, '..', 'lib', 'app.js')+' '+process.argv[process.argv.length - 1]
console.log(command)
require('child_process').exec(command, function (error, stdout, stderr) {
  console.error(stdout)
  console.error(stderr)
})