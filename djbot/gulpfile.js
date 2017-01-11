var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var livereload = require('livereload');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');


var scriptsPath = 'static/scripts/src';
var buildPath = 'static/scripts/build';



// Default
// =====================================

gulp.task('default', ['watch'], function() {});

// Clean
// =====================================

gulp.task('clean', function() {
  gulp.src('dist', {read: false})
    .pipe(clean());
});

// Build
// =====================================

gulp.task('build', ['copy', 'webpack:build'], function() {});

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('webpack:build', function(callback) {
  // Modify some webpack config options
  var myConfig = Object.create(webpackConfig);

  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );

  // Run webpack
  webpack(myConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));

    callback();
  });
});



function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}


gulp.task('default', ['webpack-dev-server'], function() {
  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: 'src/index.html',
    publicPath: '/' + webpackConfig.output.publicPath
  }).listen(8080, 'localhost', function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    
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
