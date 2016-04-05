'use strict';
const fs = require('fs');
const crypto = require('crypto');
module.exports = function (gameServer, args) {
  switch (args[1]) {
    case 'hashFiles':
      gameServer.updater.hashFiles();
      console.log("[Console] Running hashfiles")
      break;
    case 'devMode':
      if ( gameServer.config.dev == 1) {
              gameServer.config.dev = 0;
              console.log("[Console] Turned off devmode");
        
      } else {
      gameServer.config.dev = 1;
      console.log("[Console] Turned on devmode");
      }
      break;
     case 'compileFilesJson':
       console.log("[Console] Compiling files.json...");
       
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};
walk('.',function(err, results) {
  if (err) throw err;
  console.log("[Console] Scanned src...");
  console.log(results);
  var j = 0;
  var jso = [];
  for (var i in results) {
      var r = results[i]
      let ind = r.lastIndexOf("/");
      let myString = r;
      if( myString.charAt( 0 ) === '.' ) myString = myString.slice( 1 );
     
      var current_date = (new Date()).valueOf().toString();
var random = Math.random().toString();
var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
      var pj = {
      hash: hash,
      src: 'src' + myString,
      dst: r,
      name: r.slice(ind),
  };
      jso.push(pj);
      
  }
  console.log(jso);
  var dat = JSON.stringify(jso, null, 2)
  console.log(dat);
  fs.writeFileSync('devfiles.json', dat);
});

       
       break;
    default:
      console.log('Unknown command, do hashFiles, devMode, or compileFilesJson');
  }
};