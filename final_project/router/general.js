const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    if (!isValid(req.body.username)) {
      return res.status(300).json({ message: 'Please use another username.' });
    }

    let new_user = {};

    new_user.username = req.body.username;
    new_user.email = req.body.email;
    new_user.password = req.body.password;

    users.push(new_user);

    return res.status(200).json({ message: 'User successfully registered.' });
  } else {
    return res
      .status(300)
      .json({ message: 'Please fill in all fields and try again.' });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn]));
  } else {
    return res.status(404).json({ message: 'No books with this ISBN' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
