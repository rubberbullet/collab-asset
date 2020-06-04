var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('css', function() {
    return gulp.src('./src/assets/scss/screen.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 major version', 'ie >=9'],
        cascade: false
    }))
    .pipe(gulp.dest('./src/assets/css/'))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./src/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('concat-js', function() {
    return gulp.src([
        './src/assets/js/jquery-3.3.1.min.js',
        './src/assets/js/slick.min.js',
        './src/assets/js/index.js'
    ], { allowEmpty: true })
    .pipe(concat('app.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./src/assets/js'));
});

gulp.task('watch', gulp.series('css', 'concat-js', function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
    gulp.watch('./src/assets/scss/**/*.scss', { allowEmpty: true }).on('change', gulp.series('css'));
    gulp.watch(['./src/assets/js/**/*.js', '!./src/assets/js/app.bundle.min.js'], { allowEmpty: true }).on('change', gulp.series('concat-js'));
    gulp.watch('./src/*.html', { allowEmpty: true }).on('change', browserSync.reload);
}));

gulp.task('default', gulp.parallel('watch'));