const express = require('express');
const book_routes = require('./router/book_router.js').book;

const app = express();

app.use(express.json());


const PORT = 5001;

// Restrict access to book endpoints to local host only.
app.use("/books/*", function localOnly(req, res, next) {
    // Simulate a check to allow only local server access
    if (req.headers["x-is-localonly"] !== "true") {
        return res.status(403).json({ message: "Access restricted to local server" });
    }
    
    next();
});
// Publish book endpoints to consume using Axios.
app.use("/books", book_routes);

app.listen(PORT, () => console.log(`Books Server is running on port ${PORT}`));
