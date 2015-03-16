var bower = require('gulp-bower'),
	concat = require('gulp-concat'),
	csso = require('gulp-csso'),
	gulp = require('gulp'),
	filter = require('gulp-filter'),
	folders = require('gulp-folders'),
	http = require('http'),
	imagemin = require('gulp-imagemin'),
	livereload = require('gulp-livereload'),
	mainBowerFiles = require('main-bower-files'),
	bowerNormalizer = require('gulp-bower-normalize'),
	myth = require('gulp-myth'),
	order = require('gulp-order'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	rubysass = require('gulp-ruby-sass'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	st = require('st'),
	uglify = require('gulp-uglify');
	// concatCSS = require('gulp-concat-css'),
	// connect = require('connect'),
	// serveStatic = require('serve-static'),
	// server = lr();
// lr = require('tiny-lr'),

var config = {
	srcDir: {
		fonts: './assets/fonts',
		html: './assets/templates',
		img: './assets/img',
		js: './assets/js',
		sass : './assets/sass',
	},
	bowerDir: './bower_components',
	basePath: './build',
	buildDir: {
		html: './build',
		css: './build/css',
		fonts: './build/fonts',
		img: './build/img',
		js: './build/js',
	}
}

// tasks

// gulp.task('bower', function() {
// 	return bower()
// 		.pipe(gulp.dest(config.bowerDir))
// 	console.log(bower);
// });

// gulp.task('css', function() {
// 		return gulp.src(config.sassPath + '/style.scss')
// 				 .pipe(sass({
// 						loadPath: [
// 								 './resources/sass',
// 								 config.bowerDir + '/bootstrap-sass-official/assets/stylesheets'
// 						]
// 				})
// 				.pipe(gulp.dest('./public/css'));
// });

gulp.task('sass:bower', function() {
	return gulp.src(config.bowerDir + '/bootstrap-sass-official/assets/stylesheets/bootstrap.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(concat('vendors-style.css'))
	.pipe(plumber())
	.pipe(myth())
	.pipe(sourcemaps.write('./vendors-maps'))
	.pipe(gulp.dest(config.buildDir.css))
	.pipe(livereload());
});

gulp.task('sass', function() {
	return gulp.src(config.srcDir.sass + '/layout.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	/*.pipe(rubysass(config.srcDir.sass + '/layout.scss', {
		loadPath: [ config.srcDir.sass, config.bowerDir + '/bootstrap-sass-oficial/assets/stylesheets'],
		// container: 'gulp-ruby-sass-app',
		trace: true
		sourcemap: true
	}))*/
	.pipe(concat('main-style.css'))
	.pipe(plumber())
	.pipe(myth())
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest(config.buildDir.css))
	.pipe(livereload());
});

gulp.task('scripts:vendors', function() {
	var vendors = mainBowerFiles();
	// return console.log(gulp.src(vendors).pipe(filter('**.js')).pipe(order(vendors)));
	return gulp.src(vendors)
	.pipe(filter('**.js'))
	.pipe(order(['*jquery*','*bootstrap*']))
	.pipe(concat('vendor-scripts.js'))
	.pipe(gulp.dest(config.buildDir.js))
	// .pipe(livereload());
});

gulp.task('scripts:custom', function() {
	return gulp.src(config.srcDir.js + '/**/*.js')
	.pipe(concat('custom-scripts.js'))
	.pipe(gulp.dest(config.buildDir.js))
	.pipe(livereload());
});

gulp.task('images', function() {
	gulp.src(config.srcDir.img + '/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest(config.buildDir.img));
});

gulp.task('html', function() {
	gulp.src(config.srcDir.html + '/*.html')
	.on('error', console.log)
	.pipe(gulp.dest(config.buildDir.html))
	.pipe(livereload());
});

gulp.task('watch', ['server'], function() {

	livereload.listen({ basePath: config.basePath })
	gulp.watch( config.srcDir.sass + '/*.scss', ['sass']);
	gulp.watch( config.bowerDir + '/**/*.scss', ['sass:bower']);
	gulp.watch( config.srcDir.img + '/**/*', ['images']);
	gulp.watch( config.srcDir.html + '/*.html', ['html']);
	gulp.watch([ config.srcDir.js + '/*.js'], ['scripts:custom']);
});

gulp.task('server', function(done) {
	http.createServer(
		st({ path: './build', index: 'index.html', cache: false })
	).listen(9000, done);
	console.log('Server listening on http://localhost:9000');
});
module.exports = gulp;
gulp.task('default', ['sass', 'html', 'scripts:custom','watch']);