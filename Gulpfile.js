var gulp = require('gulp');
var RevAll = require('gulp-rev-all');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var csso = require('gulp-csso');
var useref = require('gulp-useref');
var less = require('gulp-less');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var watch = require('gulp-watch');
var minimist = require('minimist');
var batch = require('gulp-batch');
var gulpUtil = require('gulp-util');
var babel = require('gulp-babel');
gulpif = require('gulp-if');

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});


gulp.task('pack', function () {
    var jsFilter = filter("**/*.js", {restore: true});
    var lessFilter = filter("**/*.less", {restore: true});
    var htmlFilter = filter('**/*.html', {restore: true});
    //if (!options.t || typeof options.t !== 'number') throw new Error('发布版本目录不能为空,e.g:--t 1');

    var revAll = new RevAll({

        //不重命名文件
        dontRenameFile: ['.html', '.vm', '.md'],
        //不去跟新html的引用
        dontUpdateReference: ['.html', '.vm', '.md'],

        //无需关联处理文件
        dontGlobal: [/^\/favicon.ico$/, '.bat', '.txt', '.json'],

        //该项配置只影响绝对路径的资源
        //prefix: 'http://localhost:1111/'
    });


    return gulp.src(['src/**'])
        //压缩css
        .pipe(lessFilter)
        .pipe(less())
        .pipe(csso())
        .pipe(lessFilter.restore)


        //合并html里面的js/css
        .pipe(htmlFilter)
        .pipe(useref())
        .pipe(gulpif('*.js', babel()))
        .pipe(gulpif('*.js', uglify())).on('error', gulpUtil.log)
        .pipe(htmlFilter.restore)

        //加MD5后缀
        .pipe(revAll.revision())
        //输出
        .pipe(gulp.dest('build'))

        //生成映射json文件
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
    watch(['src/**'], batch(function (events, done) {
        gulp.start(['clean', 'pack'], done);
    }));
});

gulp.task('default', gulpSequence('clean', 'pack', 'watch'));