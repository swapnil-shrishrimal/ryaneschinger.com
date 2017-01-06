var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    del = require('del'),
    cp = require('child_process'),
    server = require('gulp-server-livereload');

var path = {
  SCSS: './src/scss/*',
  JS: './src/js/**/*',
  IMAGES: './src/images/**/*',
  ICONS: './src/*',
  ENTRY_POINT: './src/js/main.js',
  DEST_CSS: './static/css/',
  DEST_JS: './static/js/',
  DEST_IMAGES: './static/images/',
  DEST_ICONS: './static/',
  PUBLIC: 'public',
  STATIC: 'static/**/*',
  CONTENT: 'content/**/*'
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
    transform: [babelify]
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.DEST_JS));
});

gulp.task('images', function() {
  gulp.src(path.IMAGES)
    .pipe(gulp.dest(path.DEST_IMAGES));
});

gulp.task('icons', function() {
  gulp.src(path.ICONS, { dot: true })
    .pipe(gulp.dest(path.DEST_ICONS));
});

gulp.task('server', function() {
  gulp.src('./public')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', ['scss', 'build', 'images', 'icons', 'server'], function(done) {
  var hugoArgs = [
    '--buildDrafts'
  ];
  gulp.watch([path.SCSS], ['scss']);
  gulp.watch([path.JS], ['build']);
  gulp.watch([path.IMAGES], ['images']);
  gulp.watch([path.ICONS], ['icons']);
  gulp.watch([path.CONTENT], function() {
    cp.spawn('hugo', hugoArgs, { stdio: 'inherit' });
  });
});

gulp.task('prod', ['scss', 'build', 'images', 'icons'], function(done) {
  var hugoArgs = [
  ];
  return cp
    .spawn('hugo', hugoArgs, { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('default', [ 'watch' ]);
