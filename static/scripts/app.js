var app = app || {};

$(function() {

    // The model for our todo item mapped to the Django one.
    app.Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            complete: false
        },
    });

    // The collection of our todo models.
    TodoList = Backbone.Collection.extend({
        model: app.Todo,
        meta: {},

        // Set the (relative) url to the API for the item resource.
        url: "/api/item",

        parse: function(response) {
            this.meta = response.meta;
            return response.objects;
        }
    });
    app.Todos = new TodoList();

    // The visual representation of a single model.
    app.TodoView = Backbone.View.extend({
        // The element we'll append for the collection models.
        tagName: "li",

        // Cache the template for a single model.
        template: _.template($("#item-template").html()),

        // Set up our listeners to model events.
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    // The view for the entire app.
    app.AppView = Backbone.View.extend({
        el: "#todo-app",

        initialize: function() {
            // TastyPie requires us to use a ?format=json param, so we'll
            // set that as a default.
            $.ajaxPrefilter(function(options) {
                _.extend(options, {format: 'json'});
            });

            // Bind relavent events to the todos.
            this.listenTo(app.Todos, "add", this.addOne);
            this.listenTo(app.Todos, "reset", this.addAll);

            // Get our todos from the API!
            app.Todos.fetch();
        },

        // Add a single todo to the list.
        addOne: function(todo) {
            var view = new app.TodoView({model: todo});
            $("#todo-list").append(view.render().el);
        },

        // Clear the list and add each todo one by one.
        addAll: function() {
            this.$("todo-list").html("");
            app.Todos.each(this.addOne, this);
        }
    });

    // And we're off.
    new app.AppView();

});
