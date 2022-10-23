const { series, watch, parallel } = require("gulp");

const gulp = require("gulp"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass")(require("sass")),
  connect = require("gulp-connect"),
  prefix = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  notify = require("gulp-notify"),
  zip = require("gulp-zip"),
  uglify = require("gulp-uglify"),
  // imagemin = require("gulp-imagemin"),
  babel = require("gulp-babel"),
  deploy = require("gulp-gh-pages");

// Live server task : creates live server at: localhost:8765 and allow reload
const live = () => {
  connect.server({
    root: "./dist/",
    livereload: true,
    port: 3000,
  });

  console.log("live is done");
};

// HTML task : copy HTML files from Working to Dist and bind files to live server
const html = () => {
  // all html files
  return (
    gulp
      .src("working/*.html")
      .pipe(gulp.dest("dist/"))
      // .pipe(notify('HTML is completed'))
      .pipe(connect.reload())
  );
};

// // CSS task :
// // create source maps files
// // compiles sass files and export COMPRESSED version
// // add prefixes
// // concat all files in one file: style.css
// // add style.css in dist/css folder
// // bind files to live server
const css = () => {
  // select all files with .scss or .sass extension
  return (
    gulp
      .src("working/css/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(prefix("last 4 versions"))
      .pipe(concat("css/style.css"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"))
      // .pipe(notify('CSS is completed'))
      .pipe(connect.reload())
  );
};

// // img task :
// // optimize images
// // add th optimized images in dist/img folder
// // bind files to live server
const img = () => {
  return (
    gulp
      .src("working/media/*.*")
      // .pipe(imagemin())
      .pipe(gulp.dest("dist/media"))
      .pipe(connect.reload())
  );
};

// zip task: creates compressed version of dist folder to be delivered
// compress dist folder in dist-compressed.zip file
// add dist-compressed.zip file in the source folder
const zipTask = () => {
  return (
    gulp
      .src("dist/**/*.*")
      .pipe(zip("dist-compressed.zip"))
      // .pipe(notify("zip "))
      .pipe(gulp.dest("."))
  );
};

const watchTask = () => {
  watch(["working/*.html"], html);
  watch(["working/css/**/*.scss"], css);
  watch(["working/media/*.*"], img);
  watch(["dist/**/*.*"], zipTask);
};

exports.default = parallel(watchTask, live);
// // deploy task to github
// gulp.task("deploy", function () {
//   return gulp.src("./dist/**/*").pipe(deploy());
// });

// gulp.task("live", async () => {
// });

// // Js task:
// // compile Js code with babel to compile ES6 code to work on older browser
// // concat all JS code in one file : js.js
// // uglify JS code
// // add script.js file in dist/js folder
// gulp.task("js", async () => {
//   return (
//     gulp
//       .src(["working/js/*.js"])
//       .pipe(
//         babel({
//           presets: ["@babel/env"],
//         })
//       )
//       .pipe(concat("js/script.js"))
//       .pipe(uglify())
//       .pipe(gulp.dest("dist"))
//       // .pipe(notify('JS is completed'))
//       .pipe(connect.reload())
//   );
// });

// watch task:
// gulp.task("watch", () => {
//   gulp.watch("working/*.html", gulp.series("html"));
//   gulp.watch("working/css/**/*.scss", gulp.series("sass"));
//   gulp.watch("working/js/*.js", gulp.series("js"));
//   gulp.watch("working/media/*.*", gulp.series("img"));
//   gulp.watch("dist/**/*.*", gulp.series("zip"));
// });

// set the default task to be watch task
// gulp.task("default", gulp.series("live", "watch"));
