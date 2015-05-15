module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        '*.js',
        'server/**/*.js',
        'client/app/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          '**/*.min.js'
        ]
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'client/app/factories/**/*.js',
          'client/app/contacts/**/*.js',
          'client/app/messages/**/*.js',
          'client/app/schedule/**/*.js',
          'client/app/auth/**/*.js',
          'client/app/filters/*',
          'client/app/app.js'
        ],
        dest: 'client/build/app.concat.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'client/app/app.min.js': ['client/build/app.concat.js']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'client/app/**/*.js',
          '!**/*.min.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['concat', 'uglify']);

  grunt.registerTask('default', ['jshint', 'build']);

};
