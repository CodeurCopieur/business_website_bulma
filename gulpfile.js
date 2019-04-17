const gulp = require('gulp');
      sass = require('gulp-sass');
      concat = require('gulp-concat');
      del = require('del');
      browserSync = require('browser-sync');
      googleWebFonts = require('gulp-google-webfonts');

const paths = {
    fonts: {
        src: ['node_modules/font-awesome/fonts/fontawesome-webfont.*'],
        dest: 'build/fonts-awesome'
    },
    googleWebFonts: {
        src: ['src/fonts/fonts.list'],
        dest: 'build/assets/fonts'
    },
    css : {
        src : ['node_modules/bulma/bulma.sass', 'src/scss/index.scss'],
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

function fonts(){
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
    gulp.watch(paths.googleWebFonts.src, fonts);
    gulp.watch(paths.html.dest).on('change', browserSync.reload);

}

const build = gulp.series(clean, gulp.parallel(css, watch));

exports.clean = clean;
exports.css = css;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;

//Nous assignons également cette nouvelle tâche build comme étant notre tâche par défaut :
gulp.task('default', build);