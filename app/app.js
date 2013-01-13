define([
  "backbone.layoutmanager",
  "plugins/backbone.subroute",
  "plugins/jquery-ui",
  "bootstrap",
  "plugins/d3"
], function() {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: appRoot,
    layouts: {}
  };

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    prefix: themeDirectory.replace(window.location.origin, "").replace(app.root, "") + "app/templates/",

    fetch: function(path) {
      // Concatenate the file extension.
      path = path + ".html";

      cachedPath = path.replace(themeDirectory.replace(window.location.origin, "").replace(app.root, ""), "");
      // If cached, use the compiled template.
      if (JST[cachedPath]) {
        return JST[cachedPath];
      }

      // Put fetch into `async-mode`.
      var done = this.async();

      // Seek out the template asynchronously.
      $.get(app.root + path, function(contents) {
        done(JST[path] = _.template(contents));
      });
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(options) {
      // Create a new Layout with options.
      var layout = new Backbone.Layout(_.extend({
        el: "body"
      }, options));

      // Cache the refererence.
      return this.layout = layout;
    }
  }, Backbone.Events);

});
