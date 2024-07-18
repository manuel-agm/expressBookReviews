const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return !users.map(item => item.username).includes(username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find((user) => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body.username  
  const pass = req.body.password
  if (authenticatedUser(user, pass)) {
    const accessToken = jwt.sign({ username: user }, 'access', { expiresIn: '1h' });
    req.session.authorization = {
      accessToken
    }
    return res.status(200).json('Customer successfully logged in');
  } else {
    return res.status(400).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  books[req.params.isbn].reviews[req.user] = req.param('review')
  return res.status(200).json('The review for the book with ISBN ' + req.params.isbn + ' has been added/updated');
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.user]
  return res.status(200).send("Reviews deleted successfully")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
