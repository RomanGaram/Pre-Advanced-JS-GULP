const gulp = require('gulp');
const {series, parallel} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');


const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('build'))
}

const fontStyles = () => {
    return gulp.src('src/styles/fonts.css')
        .pipe(autoprefixer())
        .pipe(rename( { suffix: '.min'}))
        .pipe(gulp.dest('build/css'))
}

const styles = () => {
    return gulp.src('src/styles/*.css')
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename( { suffix: '.min'}))
        .pipe(gulp.dest('build/css'))
}


const scripts = () => {
    return gulp.src('src/scripts/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('build/js'))
}

const images = () =>{
    return gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}


const webFonts = () =>{
    return gulp.src('src/styles/fonts/**/*')
      .pipe(gulp.dest('build/fonts'))
  };

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb()})
}


const watch = () => {
    gulp.watch('src/pug/**/*.pug', html)
    gulp.watch('src/styles/**/*.css', styles)
    gulp.watch('src/scripts/**/*.js', scripts)
    gulp.watch('src/images/*.*', images)
}

exports.default = series(
    deleteBuild,
    parallel(html, fontStyles, styles, webFonts, scripts, images),
    parallel(watch, server)
)