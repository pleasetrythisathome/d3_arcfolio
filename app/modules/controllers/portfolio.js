// Portfolio module
define([
  // Application.
  "app",

  "modules/helpers/post",
  "modules/helpers/category"
],

// Map dependencies from above array.
function(app, Post, Category) {

  // Create a new module.
  var Portfolio = app.module();

  //======= COLLECTIONS =======

  Portfolio.Posts = new Post.Collection();
  Portfolio.Categories = new Category.Collection();

  //======= VIEWS =======


  //======= D3 CONTROLLER =======

  Portfolio.d3 = {
  }

  //======= LAYOUT =======

  Portfolio.Views.Layout = Backbone.Layout.extend({
    template: "layouts/portfolio",
    tagName: "div",
    className: "portfolio",
    firstRender: true,

    initialize: function() {
      _.bindAll(this, 'afterRender', 'd3_init', 'd3_update');
    },

    afterRender: function() {
      if (this.firstRender) {
        this.firstRender = false;
        this.d3_init();
        Portfolio.Categories.bind("all", this.d3_update);
        Portfolio.Posts.bind("all", this.d3_update);
      }
    },

    categories: [],
    posts: [],
    width: window.innerWidth,
    height: window.innerHeight,
    startRadius: Math.min(window.innerWidth, window.innerHeight) / 6,
    arcWeight: 1,
    arcSpacing: 15,
    postRadius: 100,
    startTheta: Math.PI * 2/3,
    endTheta: Math.PI * 2,
    color: ["#888", "#7AA9DD"],

    d3_init: function() {
      var cmp = this;
      this.svg = d3.select(".d3_wrapper").append("svg")
          .attr("width", cmp.width)
          .attr("height", cmp.height)
        .append("g")
          .attr("transform", "translate(" + cmp.width / 2 + "," + cmp.height / 2 + ")");

      this.catArc = d3.svg.arc()
          .startAngle(cmp.startTheta)
          .endAngle(function (d) {
            return cmp.endTheta * d.value;
          })
          .innerRadius(function(d) {
            return cmp.startRadius + d.index * cmp.arcSpacing;
          })
          .outerRadius(function(d) {
            return cmp.startRadius + d.index * cmp.arcSpacing + cmp.arcWeight;
          });

      this.postPie = d3.layout.pie()
          .startAngle(cmp.startTheta)
          .endAngle(cmp.endTheta)
          .sort(null),

      this.postArc = d3.svg.arc()
          .startAngle(cmp.startTheta)
          .endAngle(function (d) {
            return cmp.endTheta * d.value;
          })
          .innerRadius(function(d) {
            return cmp.startRadius + Portfolio.Categories.length * (cmp.arcSpacing + cmp.arcWeight);
          })
          .outerRadius(function(d) {
            return cmp.startRadius + Portfolio.Categories.length * (cmp.arcSpacing + cmp.arcWeight) + cmp.postRadius;
          });
    },

    d3_update: function(event, obj) {
      /*
console.log(event);
      console.log(obj);
*/
      if (event == "add") {
        if (obj.get('type') == 'category') {
          this.categories.push({value: 0.25, model: obj, index: Portfolio.Categories.indexOf(obj)});
        } else if (obj.get('type') == 'post') {
          this.posts.push({value: 1, model: obj, index: Portfolio.Posts.indexOf(obj)});
        }
      }
      var cmp = this;
      if (this.svg) {
        this.catArcs = cmp.svg.selectAll(".categoryArc")
            .data(cmp.categories)
          .enter().append("path")
            .attr("class", "categoryArc")
            .attr("fill", function(d, i) {
              if (i % 2 == 0) {
                return cmp.color[0];
              } else {
                return cmp.color[1];
              }
            })
            .attr("d", cmp.catArc)
            /*
.on("mouseover", function(d) {
                d3.select(this).transition()
                   .duration(1000)
                   .attrTween("d", tweenArc({value: .75}) );
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                   .duration(1000)
                   .attrTween("d", tweenArc({value: 1}) );
            })
*/
            .transition()
              .duration(1500)
              .delay(function(d) {
                return d.index * 100;
              })
              .ease("back-in-out")
              .attrTween("d", tweenCatArc({value: 1}) );

        console.log(cmp.postPie(cmp.posts));
        this.postArcs = cmp.svg.selectAll(".postArc")
            .data(cmp.posts)
          .enter().append("path")
            .attr("class", "postArc")
            .attr("fill", function(d, i) {
              if (i % 2 == 0) {
                return cmp.color[0];
              } else {
                return cmp.color[1];
              }
            })
            .attr("d", cmp.postArc);
      }

      //comment line for git

      function tweenCatArc(b) {
        return function (a) {
          var i = d3.interpolate(a, b);
          for (var key in b) a[key] = b[key]; // update data
          return function(t) {
            return cmp.catArc(i(t));
          };
        };
      };
    }

  });

  app.layouts.portfolio = new Portfolio.Views.Layout({});

  //======= ROUTER =======

  Portfolio.Router = Backbone.SubRoute.extend({
    initialize: function() {
      console.log("Portfolio.Router initialized");

      this.bind('all', Portfolio.render);
    },

    routes: {
      "": "index",
      '*action': 'defaultAction'
    },

    index: function() {
      console.log("ROUTE:  index  ROUTER: app");
      Portfolio.getPosts(function() {
      });
    },

    defaultAction: function(action) {
      console.log("ROUTE:  defaultaction = " + action + "  ROUTER: portfolio");
      this.navigate("portfolio/", {trigger: true});
    }
  });

  Portfolio.getPosts = function(callback) {
    if (Portfolio.Posts.length === 0) {
      var options = {
        json: 'get_recent_posts',
      	count: 100
      };
      $.post(apiDir + "?" + $.param(options), function(data) {
        var categories = [];
        _(data.posts).each(function(post) {
          _(post.categories).each(function(category) {
            categories.push(category.title);
          });
        });
	    	categories = _.union(_.flatten(categories));
	    	categories.push("All");
	    	categories = _(categories).sortBy();
	    	_.forEach(categories, function(category) {
		    	Portfolio.Categories.add({ route: 'portfolio', name: category, slug: category.toLowerCase().replace(" ", "-"), numPosts: 1 });
	    	});
        _(data.posts).each(function(post) {
          Portfolio.Posts.add({wp_object: post});
        });
        callback();
      });
    } else {
      callback();
    }
  };

  Portfolio.render = function() {
    app.currentSection = "portfolio";
    if (!app.layouts.main.getView(function(view) {return view === app.layouts.portfolio;})) {
      app.layouts.main.setView(".content", app.layouts.portfolio).render();
    }
  };

  //======= FUNCTIONS =======


  // Return the module for AMD compliance.
  return Portfolio;

});
