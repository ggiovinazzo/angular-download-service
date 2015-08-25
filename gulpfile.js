var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  del = require('del'),
  pkg = require('./package.json'),
  rename = require("gulp-rename"),
  minimist = require('minimist'),
  shell = require('gulp-shell');

var argOptions = {
  string: ['apikey', 'build']
};

var options = minimist(process.argv.slice(2), argOptions);
var config = {
  buildFolder: './build',
  deploy: [
    './build/*.js',
    'bower.json'
  ],
  git: 'https://ggiovinazzo:' + options.apikey + '@' + pkg.config.deploy
};

gulp.task('build', function () {
  return gulp.src('./src/*.js')
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest(config.buildFolder))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.buildFolder));
});

gulp.task('clean-deploy', function (cb) {
  del([pkg.config.deployFolder], cb);
});

gulp.task('clone-deploy', ['clean-deploy'], function () {
  return gulp.src('')
    .pipe(
      shell(['git clone https://' + pkg.config.deploy])
    );
});

gulp.task('copy-deploy', ['clone-deploy'], function () {
  return gulp.src(config.deploy)
    .pipe(
      gulp.dest(pkg.config.deployFolder)
    );
});

gulp.task('git-deploy', ['copy-deploy'], function () {
  process.chdir(pkg.config.deployFolder)
});

gulp.task('deploy', ['git-deploy'], function () {
  return gulp.src('')
    .pipe(
      shell([
        'git config --global user.email "builds@travis-ci.com"',
        'git config --global user.name "Travis CI"',
        'git remote rm origin',
        'git remote add origin ' + config.git,
        'git add . --verbose',
        'git commit --verbose -m "Build version: ' + pkg.version + '.' + options.build + '"',
        'git tag -f -a ' + pkg.version + ' -m "Travis CI build: ' + options.build + '"',
        'git push origin --tags',
        'git push origin master'
      ])
    );

});
