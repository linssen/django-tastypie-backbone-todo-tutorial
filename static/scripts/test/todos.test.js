module( "Todos", {
    setup: function() {
        var testData = {
            "id": 1, 
            "pk": "1", 
            "title": "Throw my lunch out the window.", 
            "complete": false, 
            "created_at": "2013-03-18T10:07:05.921190", 
            "updated_at": "2013-03-21T10:14:11.026800",
            "resource_uri": "/api/item/1"
        };
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", "/api/item/1", 
            [200, {"Content-Type": "application/json"}, JSON.stringify(testData)]
        );
        this.server.respondWith("GET", "/api/item", [
            200, {"Content-Type": "application/json"}, 
            JSON.stringify({
                meta: {},
                objects: [testData] 
            })
        ]);
    },
    tearDown: function() {
        this.server.restore();
    }
});

test("Can be created with default values for its attributes.", function() {  
    var todo = new app.Todo();  
    
    equal(todo.get("title"), "", "Text was set to empty string.");
    equal(todo.get("complete"), false, "Complete is default to false.");
});

test("Will set attributes on the model at instantiation", function() {
    var todo = new app.Todo({title: "Throw my lunch out the window.", complete: true});

    equal(todo.get("title"), "Throw my lunch out the window.");
    equal(todo.get("complete"), true);
});

test("Can fetch todos from the server", function() {
    var todo = {};
    app.Todos.fetch();
    this.server.respond();

    todo = app.Todos.get(1);
    equal(todo.get("title"), "Throw my lunch out the window.");
});

test("TodoView will render each item.", function() {
    var $todoList = $("#todo-list");

    app.Todos.fetch();
    this.server.respond();

    equal($todoList.find("li").length, 1);
});
