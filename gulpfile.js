const gulp = require('gulp');
      sass = require('gulp-sass');
      concat = require('gulp-concat');
      del = require('del');
      browserSync = require('browser-sync');
      googleWebFonts = require('gulp-google-webfonts');
      uglify = require('gulp-uglify');
      minify = require('gulp-clean-css');


const paths = {
    scripts: {
        src: ['src/js/**/*.js'],
        dest: 'build/assets/js' 
    },
    fonts: {
        src: ['node_modules/@fortawesome/fontawesome-free/css/all.min.css'],
        dest: 'build/assets/fonts'
    },
    googleWebFonts: {
        src: ['src/fonts/fonts.list'],
        dest: 'build/assets/fonts'
    },
    css : {
        src : ['node_modules/bulma/bulma.sass', 'src/scss/**/*.scss'],
        dest : 'build/assets/css'
    },
    html : {
        dest : 'build/index.html'
    }
}

const options = {
    fontsDir: 'googlefonts/',
    cssDir: 'googlecss/',
    cssFilename: 'myGoogleFonts.css',
    relativePaths: true
};

// supprimer le dossier assets
const clean = () => del([paths.css.dest]);

function css(){
    //où est mon fichier scss
    return gulp.src(paths.css.src)
    //passer ce fichier par le compilateur sass
    .pipe(sass())
    //permet de concaténer tout notre code source dans un seul fichier
    .pipe(concat('index.css'))
    //Où puis-je sauvegarder le scss compilé ?
    .pipe(gulp.dest(paths.css.dest))
    //transférer les modifications sur tous les navigateurs
    .pipe(browserSync.stream())
}

const minifier = () =>
    //où est mon fichier scss
     gulp.src(paths.css.src)
    //passer ce fichier par le compilateur sass
    .pipe(sass())
    //va nous permettre de compresser nos styles CSS
    .pipe(minify())
    //permet de concaténer tout notre code source dans un seul fichier
    .pipe(concat('index.min.css'))
    //Où puis-je sauvegarder le scss compilé ?
    .pipe(gulp.dest(paths.css.dest))
    //transférer les modifications sur tous les navigateurs
    .pipe(browserSync.stream())


function scripts(){
    //où est mon fichier js
    return gulp.src(paths.scripts.src)
    //va nous permettre de compresser notre code Javascript
    .pipe(uglify())
    //Où puis-je sauvegarder le js compilé ?
    .pipe(gulp.dest(paths.scripts.dest))
    //transférer les modifications sur tous les navigateurs
    .pipe(browserSync.stream())
}

function fonts(){
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}

function googlefonts(){
    return gulp.src(paths.googleWebFonts.src)
    .pipe(googleWebFonts(options))
    .pipe(gulp.dest(paths.googleWebFonts.dest))

}

function watch(){
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: true,
        port: 8001
    });
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.googleWebFonts.src, googlefonts);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.html.dest).on('change', browserSync.reload);

}

const build = gulp.series(clean, gulp.parallel(css, minifier, scripts, fonts, googlefonts, watch));

exports.clean = clean;
exports.css = css;
exports.minifier = minifier;
exports.googlefonts = googlefonts;
exports.fonts = fonts;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;

//Nous assignons également cette nouvelle tâche build comme étant notre tâche par défaut :
gulp.task('default', build);
