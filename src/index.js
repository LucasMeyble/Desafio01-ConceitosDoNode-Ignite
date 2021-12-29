const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { json } = require('express/lib/response');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user){
    return response.status(400).json({ error: "User not found" });
  };

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {

  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name,
    username, 
    todos: []
  });

  return response.status(201).json(users);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const { user } = request;

  user.todos.push({
    id: uuidv4(), 
    title: title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  });

  return response.status(201).json(user.todos);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(user.todos)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  todo.done = true;

  return response.status(200).json(user.todos);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;