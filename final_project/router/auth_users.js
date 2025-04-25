const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [
  { username: 'admin', email: 'admin@example.com', password: '12345678' },
];

const isValid = (username) => {
  //returns boolean
  if (!username) {
    return false;
  }

  users.forEach((user) => {
    if (user.username == username) {
      return false;
    }
  });

  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.filter((user) => user.username == username)[0];
  if (user && user.password == password) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  if (req.body.username && req.body.password) {
    if (authenticatedUser(req.body.username, req.body.password)) {
      let accessToken = jwt.sign(
        {
          data: req.body.username,
        },
        'access',
        { expiresIn: 60 * 60 }
      );

      req.session.username = req.body.username;

      req.session.authorization = {
        accessToken,
      };

      return res.status(200).json({ message: 'Succesfully logged in.' });
    } else {
      return res
        .status(401)
        .json({ message: 'Please check your info and try again.' });
    }
  }
  return res
    .status(401)
    .json({ message: 'Please fill in both password and username.' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    books[isbn].reviews[req.session.username] = req.body.review;
    return res.status(200).json({
      message:
        'Your review is updated for book with ISBN ' +
        isbn +
        ' as follows: ' +
        req.body.review,
    });
  } else {
    return res.status(404).json({ message: 'There is no book with this ISBN' });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: 'Your review is deleted for book with ISBN ' + isbn,
      });
    } else {
      return res.status(404).json({
        message: "You don't have a review for book with ISBN " + isbn,
      });
    }
  } else {
    return res.status(404).json({ message: 'There is no book with this ISBN' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
