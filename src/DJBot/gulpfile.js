var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');


var scriptsPath = 'static/scripts/src';
var buildPath = 'static/scripts/build';



// Default
// =====================================

gulp.task('default', ['clean', 'webpack:build' ], function() {});

// Clean
// =====================================

gulp.task('clean', function() {
  gulp.src(buildPath, {read: false})
    .pipe(clean());
});

// Build
// =====================================

gulp.task('build', ['webpack:build'], function() {});

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


gulp.task('watch', ['default'], function() {
    livereload.listen();
    gulp.watch(path.join(scriptsPath, '/*/*.js'), ['default']);
});
