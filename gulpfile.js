const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const gzip = require('gulp-gzip');
const babel = require('gulp-babel');

gulp.task('build-browser',['clean-dist', 'webpack-project', 'zip-project']);
gulp.task('build-node', ['clean-lib', 'babel-project']);

gulp.task('clean-dist', del.bind(
  null, ['dist/*'], {dot: true}
));

gulp.task('webpack-project', function() {
  var compiler = webpack(require('./webpack.config'));
  compiler.run(function(err, stats) {
    if(err)
      throw new Error(err);
    if(stats.hasErrors())
      throw new Error(stats.toString());
  });
});

gulp.task('zip-project', function() {
  gulp.src('dist/*.js')
    .pipe(gzip({ append: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('clean-lib', del.bind(
  null, ['lib/*'], {dot: true}
));

gulp.task('babel-project', function() {
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});
