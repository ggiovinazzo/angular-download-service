var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del'),
    pkg = require('./package.json'),
    rename = require("gulp-rename");

gulp.task('build', function () {
    return gulp.src('./src/*.js')
        .pipe(concat(pkg.name + '.js'))
        .pipe(gulp.dest('./build'))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});