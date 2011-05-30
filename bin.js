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
  fs.mkdirSync(path.join(appdir, 'build'), 0777)
  fs.mkdirSync(path.join(appdir, 'static'), 0777)
  
  // Setup couchapp
  var couchapp = require('couchapp');
  copytree(path.join(couchapp.bin.boilerDirectory, 'attachments'), path.join(appdir, 'static'))
  fs.writeFileSync(path.join(appdir, 'build', 'app.js'), fs.readFileSync(path.join(__dirname, 'attachments', 'app.js')))
  
  var c = child_process.spawn('npm', ['install', 'offliner'], {cwd:appdir})
  c.stdout.pipe(process.stdout)
  c.stderr.pipe(process.stderr)
  c.on('exit', function () {
    if (process.env.PATH.indexOf('./node_modules/bin') === -1 ) {
      console.error('Your PATH does not have ./node_modules/bin, this will make your life easier.')
    }
  })
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



