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

function getAllBooks() {
  return books;
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).send(JSON.stringify(await getAllBooks()));
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  /*if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn]));
  } else {
    return res.status(404).json({ message: 'No books with this ISBN' });
  }*/
  const searchByIsbn = new Promise((resolve, reject) => {
    const filteredBook = books[isbn];
    if (filteredBook) {
      resolve(filteredBook);
    } else {
      reject(e);
    }
  });

  searchByIsbn
    .then((filteredBook) => res.status(200).send(JSON.stringify(filteredBook)))
    .catch((e) => res.status(404).json({ message: 'No books with this ISBN' }));
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.replace(/[-_.]/gi, ' ').toLowerCase();
  const filterByAuthor = (authorName) => {
    return Object.values(books).filter((book) =>
      book.author.toLowerCase().includes(authorName.toLowerCase())
    );
  };
  const filteredBooksByAuthor = await filterByAuthor(author);
  if (filteredBooksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooksByAuthor));
  } else {
    return res.status(404).json({ message: 'No books by that author.' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const bookTitle = req.params.title.replace(/[-_.]/gi, ' ').toLowerCase();
  const filterByTitle = (title) => {
    return Object.values(books).filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  };
  const filteredBooksByTitle = await filterByTitle(bookTitle);
  if (filteredBooksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooksByTitle));
  } else {
    return res.status(404).json({ message: 'No books with that title.' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && Object.keys(books[isbn].reviews).length > 0) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews));
  } else {
    return res.status(404).json({ message: 'No reviews for this ISBN' });
  }
});

module.exports.general = public_users;
