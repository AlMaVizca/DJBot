var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');


var scriptsPath = 'static/scripts/src';
var buildPath = 'static/scripts/build';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('default', function() {
    
    return gulp.src(path.join(scriptsPath, '/*.jsx'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(buildPath));
        // minify
        // .pipe(uglify())    
        // // rename to folder.min.js
        // .pipe(rename('main.min.js'))
        // // write to output again
        // .pipe(gulp.dest(buildPath));
});
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(path.join(scriptsPath, '/*.jsx'), ['default']);
});
