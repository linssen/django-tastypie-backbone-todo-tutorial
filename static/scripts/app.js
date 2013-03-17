var app = app || {};

$(function() {

    // The model for our todo item mapped to the Django one.
    app.Todo = Backbone.Model.extend({
        defaults: {
            title: "",
            complete: false
        },

        toggleComplete: function() {
            // Save the model with the inverse of it's boolean complete var.
            this.save({complete: !this.get("complete")});
        }
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

        // Bind our events.
        events: {
            "click .destroy": "clear",
            "dblclick label": "edit",
            "keypress .edit input": "updateOnEnter",
            "click .done-toggle": "toggleComplete",
            "blur .edit input": "close"
        },

        // Set up our listeners to model events.
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
            this.listenTo(this.model, "destroy", this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            // Add the complete or not if it's false
            this.$el.toggleClass("complete", this.model.get("complete"));

            // Cache the input
            this.$input = this.$(".edit input");
            return this;
        },

        clear: function() {
            this.model.destroy();
        },

        edit: function() {
            this.$el.addClass("editing");
            this.$input.focus(); 
        },

        updateOnEnter: function(event) {
            var keyCode = event.keyCode || event.which,
                title = this.$input.val().trim();

            if (keyCode != 13 || !title) return;

            this.model.save({title: title}); 
            this.$el.removeClass("editing");
        },

        close: function() {
            var title = this.$input.val().trim();

            if (!title) return;

            this.model.save({title: title});
            this.$el.removeClass("editing");
        },

        toggleComplete: function() {
            this.model.toggleComplete();
        }
    });

    // The view for the entire app.
    app.AppView = Backbone.View.extend({
        el: "#todo-app",

        events: {
            "keypress #new-todo": "createOnEnter"
        },

        initialize: function() {
            // TastyPie requires us to use a ?format=json param, so we'll
            // set that as a default.
            $.ajaxPrefilter(function(options) {
                _.extend(options, {format: "json"});
            });

            // Bind relavent events to the todos.
            this.listenTo(app.Todos, "add", this.addOne);
            this.listenTo(app.Todos, "reset", this.addAll);

            // Cache some of our elements.
            this.$input = this.$("#new-todo");

            // Get our todos from the API!
            app.Todos.fetch();
        },

        // Crate a new todo when the input has focus and enter key is hit.
        createOnEnter: function(event) {
            //if (event.keyCode !== "
            var keyCode = event.keyCode || event.which,
                title = this.$input.val().trim();
            if (keyCode != 13 || !title) return;

            // Create a new todo.
            app.Todos.create({title: title, complete: false});

            // Reset the input.
            this.$input.val("");
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
