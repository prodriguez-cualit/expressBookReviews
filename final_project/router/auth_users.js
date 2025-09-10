const express = require('express');
const jwt = require('jsonwebtoken');
let { books } = require("../books_repo_app/router/booksdb.js");
const regd_users = express.Router();
const axios = require('axios');

const JWT_SECRET_KEY = 'access';
const BOOKS_HOST = 'http://localhost:5001';

let users = {};

const isValid = (username) => {
  return !Object.keys(users).includes(username);
}

const authenticatedUser = (username, password) => { //returns boolean
  if (username && password) {
    return users[username] && users[username].password === password;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, JWT_SECRET_KEY, { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(403).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  const username = req.session.authorization.username;
  const { review } = req.body;
  if (!review) return res.status(400).json({ message: "Review is required" });

  try {
    const response = await axios.put(`${BOOKS_HOST}/books/review/${isbn}/user/${username}`, { review }, { headers: { "x-is-localonly": "true" } });
    return res.send(response.data);
  } catch (error) {
    res.status(error.status || 500).json({ message: "Error adding/updating review" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  const username = req.session.authorization.username;

  try {
    const response = await axios.delete(`${BOOKS_HOST}/books/review/${isbn}/user/${username}`, { headers: { "x-is-localonly": "true" } });
    return res.send(response.data);
  } catch (error) {
    res.status(error.status || 500).json({ message: "Error deleting review" });
  }
});

module.exports = {
  authenticated: regd_users,
  isValid,
  users,
  JWT_SECRET_KEY
};
