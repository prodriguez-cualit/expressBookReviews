# Practice-Project: Book Review Application

## Course link
https://www.coursera.org/learn/developing-backend-apps-with-nodejs-and-express/


## Description
* In order to be able to use Axios, the _Books DB_ logic was moved to a separate Express app which publishes endpoints to retriece all books, a book by ISBN, books by title and books by author. It also publishes endpoints for review CRUD. Some of these endpoints use a Promise with setTimeout to simulate a delay in the request.
* The main app listens to requests on port 5000 while the books app listens on 5001.


## Run

To run the apps for the first time 2 commands must be executed, once the dependencies are installed it can be executed with just `npm start`

* `npm install` Will install dependencies for both apps
* `npm start` Will start both apps

  <img width="611" height="401" alt="Terminal Screenshot" src="https://github.com/user-attachments/assets/1fe2946a-43e4-4c2c-a145-fd8d683b073f" />
