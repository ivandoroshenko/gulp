var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	browserSync 	= require('browser-sync'),
	concat			= require('gulp-concat'),
	uglify			= require('gulp-uglifyjs'),
	rename			= require('gulp-rename'),
	del				= require('del'),
	imagemin		= require('gulp-imagemin'),
	pngquant		= require('imagemin-pngquant'),
	cache			= require('gulp-cache'),
	autoprefixer 	= require('gulp-autoprefixer'),
	csso 			= require('gulp-csso'),
	plumber 		= require('gulp-plumber');
	
gulp.task('sass', function(){
return gulp.src('src/sass/**/*.+(scss|sass)')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7', 'ie 10'], {cascade: true}))
	.pipe(plumber())
	.pipe(csso())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('css-libs', ['sass'], function(){
	return gulp.src('src/sass/libs.sass')
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
});
gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('img', function(){
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
});

