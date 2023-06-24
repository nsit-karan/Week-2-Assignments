/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());

module.exports = app;

/**
 * id tracker - keep increment for new records
 * let the id be unused if a record is deleted
 */
let uniqueId = '1';

/**
 * storing all the todos as a map
 * with key as the id.
 * 
 * optimize for insert, read, updates
 * deletes (check later)
 */
let todos = new Map();

// get All todos
function getHandler(req, res) {

  let allTodos = [];
  for (let [key, value] of todos) {
    console.log(key);
    console.log(value);

    allTodos.push(value);
  }
  return res.status(200).send(allTodos);
}
app.get("/todos/", getHandler);

// get specific todo
function getHandlerId(req, res) {
  let todoElem = todos.get(req.params.id);
  if (todoElem != undefine) {
    return res.status(200).send(todoElem);
  } else {
    return res.send("Error").status(404);
  }
}

// post handler for todos
function postHandler(req, res) {
  console.log(req.body);

  todoReq = req.body;
  let newTodo = {
    id: uniqueId,
    title: todoReq.title,
    completed: todoReq.completed,
    description: todoReq.description
  }

  let todoRes = {
    id: uniqueId
  }

  todos.set(newTodo.id, newTodo);

  // increment the id for next post
  // convert to int and then back to string
  uniqueId = String(Number(uniqueId) + 1);

  res.status(200).send(todoRes);

}
app.post("/todos", postHandler);

function putHandler(req, res) {
  let putId = req.params.id;
  console.log(putId);

  let putElement = todos.get(putId);
  console.log(putElement);

  if (putElement != undefined) {
    putElement.title = req.body.title
    putElement.completed = req.body.completed
    res.status(200).send("Updated cleanly");
  } else {
    res.status(404).send("not found");
  }
}
app.put("/todos/:id", putHandler);

// delete handler
function deleteHandler(req, res) {
  let deleteId = req.params.id;
  let deleteElem = todos.get(deleteId);

  if (deleteElem != undefined) {
    todos.delete(deleteId);
    res.status(200).send("Deleted cleanly");
  } else {
    res.status(404).send("Element not found");
  }
}
app.delete("/todos/:id", deleteHandler);


// start handler for the app server
function started() {
  console.log(`TODO app server running on port ${port}`)
}
app.listen(port, started);

module.exports = app;
