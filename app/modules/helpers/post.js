// Category module
define([
  // Application.
  "app",

  //Views
  "modules/helpers/category"
],

// Map dependencies from above array.
function(app, Category) {

  // Create a new module.
  var Post = app.module();

  //======= MODEL =======

  Post.Model = Backbone.Model.extend({
    defaults: {
      type: 'post',
      id: 0,
      title: "",
      date: "",
      excerpt: "",
      content: "",
      categories: "",
      thumbnail: "",
      images: ""
    },

    initialize: function() {
      var wp_object = this.get('wp_object');
/*       console.log(wp_object); */

      //set array of categories
      var categoryCollection = [];
      _.forEach(wp_object.categories, function(category) {
        categoryCollection.push(category.slug);
      });
      categoryCollection.push("all");

      //create date object
      var dateArray = wp_object.date.split(/[\s:\-]+/);
      var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], 0);

      //preload thumbnail
      var thumbnail = new Image();
      thumbnail.src = wp_object.thumbnail;
      var featuredUrl = wp_object.thumbnail.replace("-150x150", "");

      this.set({ id: wp_object.id, title: wp_object.title, date: date, excerpt: wp_object.excerpt, content: wp_object.content, categories: categoryCollection, thumbnail: thumbnail, images: wp_object.attachments, featuredSrc: featuredUrl});
/*       console.log(this); */
/*      console.log("Post.Model initialized"); */
    },

    destroy: function() {
      this.trigger("destroy");
    }
  });

  //======= COLLECTION =======

  Post.Collection = Backbone.Collection.extend({
    model: Post.Model,

    initialize: function() {
/*      console.log("Post.List initialized"); */
      this.bind("add", this.modelAdd);

      this.comparator = function(post) {
        return -post.get('date').getTime();
      };
    },

    modelAdd: function( model ){
/*       console.log(model); */
/*       console.log("Post.List:  added model:  " + model.get("id")); */
    }
  });

  //======= VIEWS =======

  var Views = {};


  //======= EXCERPT VIEW ========

  Views.PostExcerpt = Backbone.View.extend({
    template: "post_excerpt",
    tagName: "li",

    initialize: function() {
/*      console.log("Post.Views.Item created:  "); */
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.destroy, this);
    },

    afterRender: function() {
      var obj = this;
      obj.wrapper = obj.$(".post");
      setTimeout(function() {
        obj.wrapper.animate({opacity: 1}, 300);
      }, obj.id*100);

      obj.wrapper.hover(function() {
        obj.wrapper.animate({backgroundColor: "#222"}, 300);
      }, function() {
        obj.wrapper.animate({backgroundColor: "#141414"}, 300);
      });

      obj.links = obj.$(".link");
      obj.links.hover(function() {
        obj.overLink = true;
      }, function() {
        obj.overLink = false;
      });
    },

    destroy: function() {
      var obj = this;
      obj.wrapper.animate({opacity: 0}, 300, function() {
        obj.remove();
      });
    },

    events: {
      "click .post": "openFull"
    },

    serialize: function() {
      return this.model.toJSON();
    },

    openFull: function() {
      if (!this.overLink) app.router.navigate("blog/id/" + this.model.get("id"), {trigger: true});
    }
  });

  //======= FULL VIEW ========

  Views.PostFull = Backbone.View.extend({
    template: "post_full",

    initialize: function() {
/*      console.log("Post.Views.Item created:  "); */
      app.loadFB();
    },

    afterRender: function() {
      var obj = this;

      Shadowbox.clearCache();
      Shadowbox.setup("a.shadowbox", {
        gallery: "Photos/" + obj.model.get('id')
      });

      obj.wrapper = obj.$(".post");
      obj.wrapper.animate({opacity: 1}, 300);

      obj.buttons = obj.$(".button");
      obj.buttons.hover(function() {
        $(this).animate({opacity: 0.5}, 300);
      }, function () {
        $(this).animate({opacity: 1}, 300);
      });

      var initTwitter = function(d,s,id) {
        var js,fjs=d.getElementsByTagName(s)[0];
        if (!d.getElementById(id)) {
          js=d.createElement(s);
          js.id=id;
          js.src="https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js,fjs);
        }
      };
      initTwitter(document,"script","twitter-wjs");

      twttr.widgets.load();
    },

    events: {
      "click .post_title": "goBack"
      //"click .post_title": "openShadowbox"
    },

    serialize: function() {
      var json = this.model.toJSON();
      json.facebook_button = app.Images.facebook_button.src;
      json.mail_button = app.Images.mail_button.src;
      return json;
    },

    openShadowbox: function() {
       Shadowbox.open({
        content:    '<div id="welcome-msg">Welcome to my website!</div>',
        player:     "html",
        title:      "Welcome",
        height:     350,
        width:      350
      });
    },

    goBack: function() {
       //app.router.navigate("blog", {trigger: true});
       window.history.back();
    }
  });

  //======= LIST MANAGER ========

  Views.List = Backbone.View.extend({
    tagName: "ul",
    //this.collection pased by constructor

    beforeRender: function() {
      var obj = this;
      var count = 0;
      obj.collection.each(function(item) {
        obj.insertView(new Views.PostExcerpt({
          model: item,
          id: count
        }));
        count++;
      }, obj);
    },

    //whenever a model is added to this view's collection, insert an item view in the correct location
    initialize: function() {
      var obj = this;

      /*
obj.collection.on("add", function(item) {
        var viewIds = new Array();
        obj.getView(function(view) {
          viewIds.unshift(view.model.id);
          return view.model.id == item.id;
        });
        var index = _.sortedIndex(viewIds, item.id);

        if (index == 0) {
          obj.insertView(new Views.PostExcerpt({
            model: item,
            id: obj.collection.length - 1
          })).render();
        } else {
          var viewAfter = obj.getView(function(view) {
            return view.model.id = viewIds[index - 1];
          });

          //console.log("trying to insert  " + item.get('title') + "  before  " + viewAfter.model.get('title'));

          obj.insertView(new Views.PostExcerpt({
            model: item,
            id: obj.collection.length - 1,
            append: function(root, child) {
              viewAfter.$el.prepend(child);
            }
          })).render();
        }
      }, obj);
*/
    }
  });

  Post.Views = Views;

  // Return the module for AMD compliance.
  return Post;

});
