import "./App.css";
import { useState, useEffect } from "react";
import ListBooks from "./ListBooks";
import SearchBooks from "./SearchBooks";
import { Route, Routes } from "react-router-dom";
import OpenSearch from "./OpenSearch";
import * as BooksAPI from "./BooksAPI"

function App() {
  const bookshelfs = [
    { name: "Currently Reading", value: "currentlyReading" },
    { name: "Want To Read", value: "wantToRead" },
    { name: "Read", value: "read" },
  ];

  const [books, setBooks] = useState([]);

  const updateBookShelf = (book, newShelf) => {
    const updateBook = async () => {
      let isNewBook = true;
      //call update API to server, don't need to use response data
      await BooksAPI.update(book, newShelf);

      let newBooks = books.map(b => {
        if (b.id === book.id) {
          isNewBook = false;
          return { ...b, shelf: newShelf };
        }
        return b;
      });

      if (isNewBook) {
        book.shelf = newShelf;
        newBooks = [...newBooks, book];
      }

      setBooks(newBooks);
    }
    updateBook();
  };

  useEffect(() => {
    const getAllBooks = async () => {
      const books = await BooksAPI.getAll();
      setBooks(books);
    }
    getAllBooks();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <ListBooks
                bookshelfs={bookshelfs}
                books={books}
                onUpdate={updateBookShelf}
              />
              <OpenSearch />
            </div>
          }
        />
        <Route
          path="/search"
          element={
            <SearchBooks
              books={books}
              onUpdate={updateBookShelf}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
