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
              "naff-control.html",
              "naff-overlay.html",
              "naff-resource.html",
              "naff-structure.html"
            ]
          },
          "strip-excludes": false
        },
        files: {
          // Target-specific file lists and/or options go here. dest: source
          'build/naff-base.vulc.html': 'src/naff-base.html',
          'build/naff-control.vulc.html': 'src/naff-control.html',
          'build/naff-overlay.vulc.html': 'src/naff-overlay.html',
          'build/naff-resource.vulc.html': 'src/naff-resource.html',
          'build/naff-structure.vulc.html': 'src/naff-structure.html'
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
              "naff-control.html",
              "naff-overlay.html",
              "naff-resource.html",
              "naff-structure.html"
            ]
          },
          "strip-excludes": false
        },
        files: {
          // Target-specific file lists and/or options go here. dest: source
          'build/naff-base.vulc.csp.html': 'src/naff-base.html',
          'build/naff-control.vulc.csp.html': 'src/naff-control.html',
          'build/naff-overlay.vulc.csp.html': 'src/naff-overlay.html',
          'build/naff-resource.vulc.csp.html': 'src/naff-resource.html',
          'build/naff-structure.vulc.csp.html': 'src/naff-structure.html'
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
          {from: "src/naff-control.html", to: "build/naff-control.vulc.html"},
          {from: "src/naff-overlay.html", to: "build/naff-overlay.vulc.html"},
          {from: "src/naff-resource.html", to: "build/naff-resource.vulc.html"},
          {from: "src/naff-structure.html", to: "build/naff-structure.vulc.html"}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-vulcanize');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('deploy', ['vulcanize', 'replace']);
};
