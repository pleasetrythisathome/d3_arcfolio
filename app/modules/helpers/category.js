// Category module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Category = app.module();

  //======= MODEL =======

  Category.Model = Backbone.Model.extend({
    defaults: {
      type: 'category',
      name: "",
      slug: "",
      numPosts: 0,
      route: "",
      selected: false,
      value: 1
    },

    initialize: function() {
/*      console.log("Category.Model initialized:  " + this.get("name") ); */
    }
  });

  //======= COLLECTION =======

  Category.Collection = Backbone.Collection.extend({
    model: Category.Model,

    initialize: function() {
      //console.log("Category.List initialized");
    },

    updateSelected: function(selectedCategory) {
      this.each(function(category) {
        if (selectedCategory == category.get('slug')) {
          category.set({selected: true});
        } else {
          category.set({selected: false});
        }
      });
    },

    getCategoriesByParent: function(collection, iparent) {
      //get categories for passed in parent
      $.post(themeDirectory + 'assets/php/databaseFunctions.php', {action: "getCategories", parent: iparent}, function(data) {
/*        console.log(data); */
        _.forEach(data, function(category) {
/*          console.log(category); */
          collection.add({ name: category.name, slug: category.slug, numPosts: category.count });
        });
      },
      "json");
    },

    getCategoriesByTaxonomy: function(collection, itaxonomy) {
      //get categories for passed in parent
        console.log(itaxonomy);
      $.post(themeDirectory + 'assets/php/databaseFunctions.php', {action: "getTerms", taxonomy: itaxonomy}, function(data) {
/*        console.log(data); */
        _.forEach(data, function(category) {
/*          console.log(category); */
          collection.add({ name: category.name, slug: category.slug, numPosts: category.count });
        });
      },
      "json");
    }
  });

  //======= VIEWS =======

  var Views = {};

  //Item View
  Views.Item = Backbone.View.extend({
    template: "category",
    tagName: "li",

    initialize: function() {
      //console.log("Category.Views.Item created:  ");
      this.model.on('change', this.update, this);
    },

    afterRender: function() {
      var obj = this;
      this.box = this.$(".category");
      this.title = this.$(".category_title a");


      this.title.hover(function() {
        if (!obj.selected) {
          obj.box.animate({backgroundColor: "rgba(0, 0, 0, 0)"}, 200, function() {});
          obj.title.animate({color: "#666"}, 200, function() {});
        }
      }, function(){
        if (!obj.selected) {
          obj.box.animate({backgroundColor: "#111"}, 200, function() {});
          obj.title.animate({color: "#FFF"}, 200, function() {});
        }
      });


      setTimeout(function() {
        obj.box.css({backgroundColor: "rgba(0, 0, 0, 0)"});
        obj.box.animate({opacity: 1}, 200, function() {
          obj.update();
          if (!obj.selected) obj.box.animate({backgroundColor: "#111"}, 300, function() {});
        });
      }, obj.id*100);
    },

    update: function() {
      this.selected = this.model.get('selected');
      var obj = this;
      obj.box = this.$(".category");
      if (this.selected) {
        obj.box.css({backgroundColor: "rgba(0, 0, 0, 0)"});
      } else {
        obj.box.css({backgroundColor: "#111"});
        obj.title.css({color: "#FFF"});
      }
    },

    serialize: function() {
      return this.model.toJSON();    }
  });

  //List View
  Views.List = Backbone.View.extend({
    tagName: "ul",

    beforeRender: function() {
      var obj = this;
      var count = 0;
      obj.collection.each(function(item) {
        obj.insertView(new Views.Item({
          model: item,
          id: count
        }));
        count++;
      }, obj);
    },

    initialize: function() {
      var obj = this;
      obj.collection.on("add", function(item) {
        if (item.get('numPosts') > 0) {
          obj.insertView(new Views.Item({
            model: item,
            id: obj.collection.length - 1
          })).render();
        }
      }, obj);
    }
  });

  //Views
  Category.Views = Views;

  // Return the module for AMD compliance.
  return Category;

});
