const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Se requiere nombre de usuario y contraseña"});
    }

    if (doesExist(username)) {
        return res.status(409).json({message: "El usuario ya existe"});
    }

    users.push({"username": username, "password": password});
    return res.status(200).json({message: "Usuario registrado con exito"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        
        const getBooks = () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(books);
            }, 500); 
          });
        };
    
        const bookList = await getBooks();
        res.status(200).send(JSON.stringify(bookList, null, 4));
      } catch (error) {
        res.status(500).json({ message: "Error al obtener los libros" });
      }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const getBook = new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject({ status: 404, message: "Libro no encontrado" });
          }
        }, 300); 
      });
  
      const bookDetails = await getBook;
      return res.status(200).send(JSON.stringify(bookDetails, null, 4));
  
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error interno" });
    }
  });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      setTimeout(() => {
        const keys = Object.keys(books);
        const filteredBooks = keys
          .filter(key => books[key].author === author)
          .map(key => books[key]);

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject({ status: 404, message: "No se encontraron libros de ese autor" });
        }
      }, 300);
    });

    const booksFound = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(booksFound, null, 4));

  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Error interno" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const getBooksByTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
          const keys = Object.keys(books);
          const filteredBooks = keys
            .filter(key => books[key].title === title)
            .map(key => books[key]);
  
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject({ status: 404, message: "No se encontraron libros con ese título" });
          }
        }, 300);
      });
  
      const booksFound = await getBooksByTitle;
      return res.status(200).send(JSON.stringify(booksFound, null, 4));
  
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message || "Error interno" });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({message: "Libro no encontrado"});
    }
});

module.exports.general = public_users;



