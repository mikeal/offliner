#!/usr/bin/env node

var optimist = require('optimist')
  , fs = require('fs')
  , path = require('path')
  , child_process = require('child_process')
  ;
  
optimist.usage('Offline web application builder.\nUsage: $0')

optimist
  .alias('h', 'help')
  .describe('help' , 'Show usage.')
  
optimist
  .alias('c', 'create')
  .describe('create' , 'Create a new offline application.')

optimist
  .alias('p', 'push')
  .describe('push', 'Deploy application to CouchDB.')

optimist
  .alias('t', 'test')
  .describe('test', 'Run application tests.')


if (process.argv.length < 3 || optimist.argv.help || optimist.argv._[0] === 'help') {
  optimist.showHelp()
  process.exit()
}

if (optimist.argv.create) {
  if (typeof optimist.argv.create === 'boolean') {
    var appdir = process.env.PWD
  } else {
    var appdir = path.join(process.env.PWD, optimist.argv.create)
    fs.mkdirSync(appdir, 0777)
  }
  fs.mkdirSync(path.join(appdir, 'tmp'), 0777)
  fs.mkdirSync(path.join(appdir, 'lib'), 0777)
  fs.mkdirSync(path.join(appdir, 'www'), 0777)
  fs.mkdirSync(path.join(appdir, 'bin'), 0777)
  
  // Setup couchapp
  copytree(path.join(__dirname, 'www'), path.join(appdir, 'www'))
  fs.writeFileSync(path.join(appdir, 'lib', 'app.js'), fs.readFileSync(path.join(__dirname, 'lib', 'app.js')))
  
  copytree(path.join(__dirname, 'bins'), path.join(appdir, 'bin'))
  // var c = child_process.exec('npm install offliner', {cwd:appdir}, function () {
  //   
  // })
  // c.stdout.pipe(process.stdout)
  // c.stderr.pipe(process.stderr)
  // c.on('exit', function () {
  //   if (process.env.PATH.indexOf('./node_modules/bin') === -1 ) {
  //     console.error('Your PATH does not have ./node_modules/bin, this will make your life easier.')
  //   }
  // })
}

function copytree (source, dest) {
  var s = fs.statSync(source);
  // TODO: convert to synchronous IO.
  if (!s.isDirectory()) throw new Error("Cannot copy tree of a non-directory.")
  var files = fs.readdirSync(source)
  for (var i=0;i<files.length;i++) {
    s = fs.statSync(path.join(source, files[i]));
    if (s.isDirectory()) {
      fs.mkdirSync(path.join(dest, files[i]), 0777)
      copytree(path.join(source, files[i]), path.join(dest, files[i]))
    } else {
      fs.writeFileSync(path.join(dest, files[i]), fs.readFileSync(path.join(source, files[i])))
    }
  }
}



