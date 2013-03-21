module( "Todos.Model");  

test("Can be created with default values for its attributes.", function() {  
    var todo = new app.Todo();  
    
    equal(todo.get("title"), "", "Text was set to empty string.");
    equal(todo.get("complete"), false, "Complete is default to false.");
});
