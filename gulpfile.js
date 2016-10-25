var fs = require('fs')
  gulp = require("gulp"),
  del = require('del'),
  babel = require('gulp-babel'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  source = require('vinyl-source-stream'),
  path = require('path'),
  less = require('gulp-less'),
  wrap  = require('gulp-wrap');    


gulp.task('clean', function() {
  del.sync(['build/*']);    
  return del.sync(['index.js']);
});


gulp.task('babel',['clean'],function(){
  return  gulp.src('src/**/*.js')
  .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-runtime']
  }))
  .pipe(gulp.dest('./build'));

})


gulp.task('build',['babel'],function(cb){
  gulp.src("./build/split-cmd.js")
        .pipe(rename("index.js"))
        .pipe(gulp.dest("./")); 
  return cb()
})


gulp.task('watch',function(){
  gulp.watch('src/**/*.js',['build']);
});

gulp.task('default',['build']);

