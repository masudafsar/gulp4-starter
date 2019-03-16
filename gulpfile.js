'use strict';

const {series, parallel, src, dest} = require('gulp');
const clean = require('gulp-clean');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const srcmap = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

function clean_builds() {
    return src(['./dist/*', './.publish/*'], {read: false, dot: true})
        .pipe(clean({force: true}));
}

function build_html() {
    return src('./src/**/*.ejs')
        .pipe(dest('./dist'))
}

function build_styles() {
    return src('./src/scss/*.scss')
        .pipe(srcmap.init())
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(srcmap.write('.'))
        .pipe(dest('./dist/css'));
}

function build_scripts(cb) {
    cb();
}

function build_statics() {
    return src('./src/static/**/*', {dot: true}).pipe(dest('./dist/'));
}

exports.default = series(
    clean,
    parallel(
        build_html,
        build_styles,
        build_scripts,
        build_statics
    )
);
exports.clean = clean_builds;
exports.build = parallel(
    build_html,
    build_styles,
    build_scripts,
    build_statics
);
exports.html = build_html;
exports.style = build_styles;
exports.script = build_scripts;
exports.static = build_statics;

