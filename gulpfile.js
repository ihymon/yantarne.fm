import gulp from 'gulp';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp';

gulp.task('convertToWebP', () => {
  return gulp.src('img/**/*.+(jpg|jpeg|png)')
    .pipe(webp())
    .pipe(gulp.dest('img'));
});

gulp.task('compressWebP', () => {
  return gulp.src('img/**/*.webp')
    .pipe(imagemin([
      imageminWebp({ quality: 10 })
    ]))
    .pipe(gulp.dest('img'));
});

gulp.task('watchImages', () => {
  gulp.watch('img/**/*.+(jpg|jpeg|png)', gulp.series('convertToWebP', 'compressWebP'));
});

gulp.task('default', gulp.series('convertToWebP', 'compressWebP', 'watchImages'));
