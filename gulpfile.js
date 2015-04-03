var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    reactify = require('reactify'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    del = require('del'),
    cp = require('child_process');

var path = {
  SCSS: './src/scss/*',
  JS: './src/js/**/*',
  ENTRY_POINT: './src/js/main.js',
  DEST_CSS: './static/css/',
  DEST_JS: './static/js/',
  PUBLIC: 'public',
  STATIC: 'static/**/*'
};

gulp.task('clean', function() {
  cleanDirs = [path.PUBLIC, path.STATIC];
  del(cleanDirs, { force: true });
});

gulp.task('scss', function() {
  gulp.src(path.SCSS)
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(concat('site.css'))
    .pipe(gulp.dest(path.DEST_CSS));
});

gulp.task('build', function() {
  return browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.DEST_JS));
});

gulp.task('watch', ['scss', 'build'], function(done) {
  gulp.watch([path.SCSS], ['scss']);
  gulp.watch([path.JS], ['build']);
  var hugoArgs = [
    'server',
    '-w',
    '--buildDrafts'
  ];
  return cp
    .spawn('hugo', hugoArgs, { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('default', [ 'watch' ]);
