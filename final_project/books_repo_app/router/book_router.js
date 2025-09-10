const express = require('express');

const booksDB = require("./booksdb.js");
const bookRouter = express.Router("/books");

bookRouter.get('/all', async function (req, res) {
  const books = await booksDB.getAllbooks(); 
  return res.send(books); 
});

bookRouter.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });
  const book = await booksDB.getBookByISBN(isbn);
  if (book)
    return res.send(book);
  else
    return res.status(404).json({ message: "Book not found" });
});

bookRouter.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  if (!author) return res.status(400).json({ message: "Author is required" });

  const books = await booksDB.getBookByAuthor(author);
  return res.send(books);
});

bookRouter.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  if (!title) return res.status(400).json({ message: "Title is required" });

  const books = await booksDB.getBooksByTitle(title);
  return res.send(books);
});

bookRouter.put('/review/:isbn/user/:username', (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  const username = req.params.username;
  if (!username) return res.status(400).json({ message: "Username is required" });

  const book = booksDB.books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { review } = req.body;
  if (!review) return res.status(400).json({ message: "Review is required" });

  let message = "Review added successfully";
  if (book.reviews[username]) message = "Review updated successfully";

  book.reviews[username] = review;

  return res.send({ message });
});

bookRouter.delete('/review/:isbn/user/:username', (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });
  
  const username = req.params.username;
  if (!username) return res.status(400).json({ message: "Username is required" });

  const book = booksDB.books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (!book.reviews[username]) return res.status(404).json({ message: "Review not found" });

  delete book.reviews[username];

  return res.send({ message: "Review deleted successfully" });
});

module.exports.book  = bookRouter;

