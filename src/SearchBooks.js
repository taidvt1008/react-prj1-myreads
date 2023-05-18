import { Link } from "react-router-dom"
import { useState } from "react"
import Book from "./Book";
import * as BooksAPI from "./BooksAPI"

const SearchBooks = ({ books, onUpdate }) => {
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [query, setQuery] = useState("");

    const searchAllBooks = async (query) => {
        const maxResults = 20; //following README
        const searchingBooks = await BooksAPI.search(query, maxResults);
        if (Array.isArray(searchingBooks)) {
            const searchingBooksWithShelf = searchingBooks.map(b => {
                const existedBook = books.filter((book) => book.id === b.id)
                if (existedBook.length === 0) {
                    return { ...b, shelf: 'none' };
                }
                return { ...b, shelf: existedBook[0].shelf };
            });

            setSearchedBooks(searchingBooksWithShelf);
        } else {
            setSearchedBooks([]);
        }
    }

    const updateSearchBookShelf = (book, newShelf) => {
        let newBooks = searchedBooks.map(b => {
            if (b.id === book.id) {
                return { ...b, shelf: newShelf };
            }
            return b;
        });
        setSearchedBooks(newBooks);
    };

    const handleQuery = (e) => {
        setQuery(e.target.value);
        if (e.target.value !== "") {
            searchAllBooks(e.target.value);
        } else {
            setSearchedBooks([]);
        }
    }

    return (
        <div className="search-books">
            <div className="search-books-bar">
                <Link to="/" className="close-search" >Close</Link>
                <div className="search-books-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN"
                        value={query}
                        onChange={handleQuery}
                    />
                </div>
            </div>
            <div className="search-books-results">
                <ol className="books-grid">
                    {
                        searchedBooks.length > 0
                            ? searchedBooks.map((book) =>
                                <Book
                                    key={book.id}
                                    book={book}
                                    onUpdate={onUpdate}
                                    onUpdateSearch={updateSearchBookShelf}
                                />)
                            : <p>Not found</p>
                    }
                </ol>
            </div>
        </div>
    );
};

export default SearchBooks;