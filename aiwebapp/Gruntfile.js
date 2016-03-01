module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    serve: {
      connect: {
        options: {
          port: 9000,
          hostname: 'localhost'
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-serve');
};