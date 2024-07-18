const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body["username"]
  if (username) {
    if (isValid(username)) {
      const password = req.body["password"]
      if (password) {
        users.push({"username": username, "password": password})
        return res.status(200).send("User " + username + " sucessfully registed")
      } else {
        return res.status(400).send("Password not specified")
      }
    } else {
      return res.status(400).send("Username " + username + " already taken")
    }
  } else {
    return res.status(400).send("Username not specified")
  }
});

public_users.get('/', async function (req, res) {
  try {
    const bookList = Object.values(books).map(item => item.title);
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const book = books[req.params.isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const booksByAuthor = Object.values(books).filter(item => item.author === req.params.author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const booksByTitle = Object.values(books).filter(item => item.title === req.params.title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn].reviews
  return res.status(200).json(book)
});

module.exports.general = public_users;
