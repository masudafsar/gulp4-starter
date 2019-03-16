'use strict';

const {series, parallel, src, dest} = require('gulp');
const log = require('fancy-log');
const clean = require('gulp-clean');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const srcmap = require('gulp-sourcemaps');
const connect = require('gulp-connect');

sass.compiler = require('node-sass');

function clean_builds() {
    return src(['./dist/*', './.publish/*'], {read: false, dot: true})
        .pipe(clean({force: true}));
}

function build_html() {
    return src('./src/page/*.ejs')
        .pipe(ejs({}, {}, {ext: '.htm'}).on('error', log))
        .pipe(dest('./dist'))
}

function build_styles() {
    return src('./src/scss/*.scss')
        .pipe(srcmap.init())
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(srcmap.write('.'))
        .pipe(dest('./dist/css'));
}

function build_scripts() {
    return src('./src/scripts/**/*').pipe(dest('./dist/scripts/'));
}

function build_statics() {
    return src('./src/static/**/*', {dot: true}).pipe(dest('./dist/'));
}

function run_server() {
    return connect.server({
        port: 8081,
        root: './dist/',
        livereload: true,
    })
}

const build = parallel(
    build_html,
    build_styles,
    build_scripts,
    build_statics
);

const server = series(
    clean,
    build,
    run_server
);

exports.default = server;
exports.clean = clean_builds;
exports.html = build_html;
exports.style = build_styles;
exports.script = build_scripts;
exports.static = build_statics;
exports.build = build;
exports.server = server;
