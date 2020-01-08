const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const templateCache = require('gulp-angular-templatecache');
const path = require('path');
const less = require('gulp-less');
const connect = require('gulp-connect');

let fp = {
    resources: [
      'favicon.ico',
      './img/*'
    ],
    lib: [
        './node_modules/tunajs/tuna-min.js',
        './node_modules/angular/angular.min.js',
        './node_modules/ng-storage/ngStorage.min.js'
    ],
    samples: [
        './node_modules/tunajs/impulses/*.wav'
    ],
    main_js: [
        './app/**/*.js'
    ],
    main_templates: [
        './app/**/*.html'
    ],
    main_less: [
        './app/app.less'
    ],
};

//////////////////////////////////////////////////////////////////////////////

function main_js(){
    return gulp
        .src(fp.main_js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist'));
}
function main_templates(){
    return gulp
        .src(fp.main_templates, {base: path.join(__dirname, './app/')})
        .pipe(templateCache('partials.js',{
            module: 'discSynth',
            root: 'CACHE/'
        }))
        .pipe(gulp.dest('dist'));
}
function main_less(){
	return gulp
		.src(fp.main_less)
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(gulp.dest('dist'));
}

///////////////////////////////////////////////////////////////////////////////

function clean(){
    return del('./dist/**/*');
}
function samples(){
    return gulp
        .src(fp.samples)
        .pipe(gulp.dest('./impulses'));
}
function libs(){
    return gulp
        .src(fp.lib)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./dist'));
}
function resources(){
    return gulp
        .src(fp.resources)
        .pipe(gulp.dest('./dist/img'));
}
function watch_all(){
    gulp.watch(fp.main_js, gulp.parallel('main_js'));
    gulp.watch(fp.main_templates, gulp.parallel('main_templates'));
    gulp.watch(fp.main_less, gulp.parallel('main_less'));
}

//////////////////////////////////////////////////////////////////////////////
function runConnectServer(){
	connect.server();
}
//////////////////////////////////////////////////////////////////////////////

const main = gulp.series(main_js, main_templates, main_less);
const build = gulp.series(clean, samples, libs, resources, main);

exports.main_js = main_js;
exports.main_less = main_less;
exports.main_templates = main_templates;

exports.clean = clean;
exports.main = main;
exports.build = build;
exports.default = build;

exports.watch = gulp.series(build, watch_all);
exports.serve = runConnectServer;