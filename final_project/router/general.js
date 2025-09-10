const express = require('express');
const axios = require('axios');

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BOOKS_HOST = 'http://localhost:5001';

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    users[username] = { username, password };
    return res.status(200).json({ message: "User successfully registered" });
  } else {
    return res.status(409).json({ message: "Username already exists" });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const books = await axios.get(`${BOOKS_HOST}/books/all`, { headers: { "x-is-localonly": "true" } });
    return res.send(JSON.stringify(books.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  try {
    const book = await axios.get(`${BOOKS_HOST}/books/isbn/${isbn}`, { headers: { "x-is-localonly": "true" } })
    if (book.status === 200)
      return res.send(book.data);
    else
      return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    res.status(error.status || 500).json({ message: "Error fetching books" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  if (!author) return res.status(400).json({ message: "Author is required" });

  try {
    const books = await axios.get(`${BOOKS_HOST}/books/author/${author}`, { headers: { "x-is-localonly": "true" } })
    return res.send(books.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  if (!title) return res.status(400).json({ message: "Title is required" });

  const books = booksDB.getBooksByTitle(title);
  return res.send(JSON.stringify(books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  try {
    const book = await axios.get(`${BOOKS_HOST}/books/isbn/${isbn}`, { headers: { "x-is-localonly": "true" } })
    if (book.status === 200)
      return res.send(book.data?.reviews);
    else
      return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    res.status(error.status || 500).json({ message: "Error fetching book reviews" });
  }
});

module.exports.general = public_users;
