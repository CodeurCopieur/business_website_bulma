const gulp = require('gulp');
      sass = require('gulp-sass');
      concat = require('gulp-concat');
      del = require('del');
      minify = require('gulp-clean-css')
      browserSync = require('browser-sync');

const paths = {
    css : {
        src : ['node_modules/bulma/bulma.sass'],
        dest : 'build/assets/css'
    },
    html : {
        dest : 'build/index.html'
    }
}

// supprimer le dossier assets
const clean = () => del([paths.css.dest]);

function css(){
    //où est mon fichier scss
    return gulp.src(paths.css.src)
    //passer ce fichier par le compilateur sass
    .pipe(sass())
    //va nous permettre de compresser nos styles CSS
    .pipe(minify())
    //permet de concaténer tout notre code source dans un seul fichier
    .pipe(concat('index.css'))
    //Où puis-je sauvegarder le scss compilé ?
    .pipe(gulp.dest(paths.css.dest))
    //transférer les modifications sur tous les navigateurs
    .pipe(browserSync.stream())
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
    gulp.watch(paths.html.dest).on('change', browserSync.reload);

}

const build = gulp.series(clean, gulp.parallel(css, watch));

exports.clean = clean;
exports.css = css;
exports.build = build;
exports.watch = watch;

//Nous assignons également cette nouvelle tâche build comme étant notre tâche par défaut :
gulp.task('default', build);