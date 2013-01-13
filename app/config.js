require.config({
  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    bootstrap: '../vendor/js/libs/bootstrap/js/bootstrap',

    libs: "../vendor/js/libs",
    plugins: "../vendor/js/plugins"
  },

  shim: {
    bootstrap: {
      deps: ["jquery"]
    },
    "plugins/jquery.color": ["jquery"],
    "plugins/jquery.isotope": ["jquery"],
    "plugins/jquery.masonry": ["jquery"],
    "plugins/jquery-ui": ["jquery"],
    "libs/shadowbox/shadowbox": ["jquery"],
    "plugins/backbone.subroute": ["backbone", "lodash"]
  }

});