module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  var code_files = [ 'index.js' ];
  var mocha_files = [ 'test/**/*.js' ];

  grunt.initConfig({
    exec: {
      clear: 'clear',
      flow: './node_modules/.bin/flow --color always',
      mocha: './node_modules/.bin/mocha -c -R progress 2>&1',
      build: './node_modules/.bin/babel src --out-dir dist',
    },
    watch: {
      flow: {
        files: code_files.concat(mocha_files),
        tasks: [ 'exec:clear', 'exec:flow' ],
        options: {
          spawn: false,
          atBegin: true,
        }
      },
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

  grunt.registerTask('test', [ 'exec:flow', 'exec:mocha' ]);
  grunt.registerTask('build', [ 'exec:build' ]);
  grunt.registerTask('default', [ 'test' ]);

};
