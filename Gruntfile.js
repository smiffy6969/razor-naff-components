module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Vulcanize all components into single file
    vulcanize: {
      // standard
      full: {
        options: {
          // Task-specific options go here.
          csp: false,
        },
        files: {
          // Target-specific file lists and/or options go here. dest: source
          'build/naff.vulc.html': 'src/naff.html'
        }
      },

      // csp (builds external script file too)
      "full-csp": {
        options: {
          // Task-specific options go here.
          csp: true,
        },
        files: {
          // Target-specific file lists and/or options go here. dest: source
          'build/naff.vulc.csp.html': 'src/naff.html'
        }
      },

      // Vulcanize each group off components into their own files
      base: {
        options: {
          // Task-specific options go here.
          csp: false,
          excludes: {
            imports: [
              "naff-base.html",
              "naff-extended.html"
            ]
          },
          "strip-excludes": false
        },
        files: {
          // Target-specific file lists and/or options go here. dest: source
          'build/naff-base.vulc.html': 'src/naff-base.html',
          'build/naff-extended.vulc.html': 'src/naff-extended.html'
        }
      },    

      // Vulcanize each group csp (builds external script file too)
      "base-csp": {
        options: {
          // Task-specific options go here.
          csp: true,
          excludes: {
            imports: [
              "naff-base.html",
              "naff-extended.html"
            ]
          },
          "strip-excludes": false
        },
        files: {
          // Target-specific file lists and/or options go here. dest: source
          'build/naff-base.vulc.csp.html': 'src/naff-base.html',
          'build/naff-extended.vulc.csp.html': 'src/naff-extended.html'
        }
      }
    },

    // replace imports in vulc files with with vulc imports for when using group vulc files
    replace: {
      default: {
        src: ['build/*.html'],
        overwrite: true,                 // overwrite matched source files
        replacements: [
          {from: "src/naff-base.html", to: "build/naff-base.vulc.html"},
          {from: "src/naff-extended.html", to: "build/naff-extended.vulc.html"}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-vulcanize');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('deploy', ['vulcanize', 'replace']);
};