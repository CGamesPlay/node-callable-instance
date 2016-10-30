module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  var code_files = [ 'index.js' ];
  var mocha_files = [ 'test/**/*.js' ];

  grunt.initConfig({
    exec: {
      clear: 'clear',
      mocha: './node_modules/.bin/mocha -c -R progress 2>&1',
    },
    watch: {
      mocha: {
        files: code_files.concat(mocha_files),
        tasks: [ 'exec:clear', 'exec:mocha' ],
        options: {
          spawn: false,
          atBegin: true,
        }
      },
    }
  });

  grunt.registerTask('test', [ 'exec:mocha' ]);
  grunt.registerTask('build', [ 'exec:build' ]);
  grunt.registerTask('default', [ 'test' ]);

};
