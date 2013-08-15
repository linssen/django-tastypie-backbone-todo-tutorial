var app = app || {};

$(function() {

    // The model for our todo item mapped to the Django one.
    app.Todo = Backbone.Model.extend({
        defaults: {
            title: "",
            order: 0,
            complete: false
        },

        url: function() {
            var id = this.id || '';
            return "/api/item/"+id;
        },

        // Toggle the completedness of the item
        toggleComplete: function() {
            // Save the model with the inverse of it's boolean complete var.
            this.save({complete: !this.get("complete")});
        }
    });

    // The collection of our todo models.
    TodoList = Backbone.Collection.extend({
        model: app.Todo,
        
        // A catcher for the meta object TastyPie will return.
        meta: {},

        // Set the (relative) url to the API for the item resource.
        url: "/api/item",

        // Our API will return an object with meta, then objects list.
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

        // Cache the jQuery UI sortable object.
        $sortable: {},

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
            // (re)Render the view when the model changes
            this.listenTo(this.model, "change", this.render);

            // Remove the view when the model is destroyed
            this.listenTo(this.model, "destroy", this.remove);
        },

        // Render our view to the DOM as a new li (from tagName).
        render: function() {
            var _self = this;

            // Give the list item an id.
            this.$el.attr("id", this.model.get("id"));

            // Render the template with our model as a JSON object.
            this.$el.html(this.template(this.model.toJSON()));

            // Add the complete or not if it's false
            this.$el.toggleClass("complete", this.model.get("complete"));

            // Set up the sortable.
            this.$sortable = $("#todo-list").sortable({
                items: "li",
                stop: function(event, ui) { _self.updateOrder(event, ui); }
            });

            // Cache the input
            this.$input = this.$(".edit input");
            return this;
        },

        // Just delete the view.
        clear: function() {
            this.model.destroy();
        },

        // Put the view in editing mode.
        edit: function() {
            this.$el.addClass("editing");
            this.$input.focus(); 
        },

        // Update the collection's order.
        updateOrder: function(event, ui) {
            var order = this.$sortable.sortable("toArray");
            for(var i=0; i<order.length; i++) {

                var item = app.Todos.get(order[i]);
                item.save({order: i});
            }
        },

        // Update the model when we hit enter.
        updateOnEnter: function(event) {
            var keyCode = event.keyCode || event.which;

            // If we haven't hit enter, then continue.
            if (keyCode != 13) return;

            // Defer the updating and closing to our close method.
            this.close();
        },

        // Close the editing mode and save the model.
        close: function() {
            var title = this.$input.val().trim();

            // If the string is empty then clear the view (destroying the model).
            if (!title) {
                this.clear();

            // Otherwise update the model and close out of editing mode.
            } else {
                this.model.save({title: title});
                this.$el.removeClass("editing");
            }
        },

        // Bind the event to the model's toggle function.
        toggleComplete: function() {
            this.model.toggleComplete();
        }
    });

    // The view for the entire app.
    app.AppView = Backbone.View.extend({
        el: "#todo-app",

        // Bind our events.
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
            var keyCode = event.keyCode || event.which,
                title = this.$input.val().trim();

            // If we haven't hit enter, then continue.
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
