define([
  // Application.
  "app",

  "modules/controllers/portfolio"
],

function(app, Portfolio) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    initialize: function() {
      console.log("app.Router initialized");
      app.layouts.main = new Backbone.Layout({
        template: "layouts/main",
        el: "#main"
      });
      app.layouts.main.render();

      this.bind('all', this._trackPageview);
    },

    _trackPageview: function() {
      var url = Backbone.history.getFragment();
      if (typeof _gap && url[url.length - 1] !== "/") {
        return _gaq.push(['_trackPageview', "/" + url]);
      }
    },

    subRoutes: {},

    routes: {
      'portfolio/*subroute': 'portfolio',
      "": "index",
      "*action": "defaultAction"
    },

    portfolio: function(subroute) {
      console.log("ROUTE:  portfolio  ROUTER: app");
      if (!this.subRoutes.portfolio) {
        this.subRoutes.portfolio = new Portfolio.Router("portfolio");
      }
    },

    index: function() {
      console.log("ROUTE:  index  ROUTER: app");
      this.navigate("portfolio/", {trigger: true});
    },

    defaultAction: function(action) {
      console.log("ROUTE:  defaultaction = " + action + "  ROUTER: app");
      this.navigate("", {trigger: true});
    }
  });

  return Router;

});
