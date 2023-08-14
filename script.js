'use strict'

class Book {
    constructor(title, author, pages, readStatus) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
    }
    changeReadStatus = () => {this.readStatus ? this.readStatus = false : this.readStatus = true;}
}

const Library = (function () {
    let library = [];

    function getLibrary() {
        return library;        
    }

    function findBook(libraryArray, bookName) {
        if (libraryArray.length === 0) return;
        for (const book of libraryArray) {
            const trimmedTitle = trimString(book.title);
            if (trimmedTitle === bookName) {
                return libraryArray.indexOf(book);
            };
        };
    }
    
    function addBookToLibrary(title, author, pages, readStatus) {
        if (title === '' || author === '' || pages === 0) {
            alert('Please add title, author and number of pages');
            return;
        };
        for (const book of library) {
            if (book.title === title && book.author === author) {
                alert('Book is already in the list');
                return;
            }
        }
        const newBook = new Book (title, author, pages, readStatus); 
        library.push(newBook);
    }
    
    function removeFromLibrary(bookIndex) {
        library.splice(bookIndex, 1)   
    }
    
    function trimString(str) {
        const length = 20;
        const trimmedString = str.length > length ? str.substring(0, length - 3) + "..." : str;
        return trimmedString;
    }
    
    

    return{addBookToLibrary, removeFromLibrary, trimString, findBook, getLibrary}
})()

Library.addBookToLibrary('Lord of the Rings', 'J.R.R.Tolkien', 1000, false);
Library.addBookToLibrary('Game of Thrones', 'George R.R. Martin', 1500, true);

const DisplayController = (function () {
    const libraryArr = Library.getLibrary()
    const library = Library;
    //Cache DOM
    const containerEl = document.querySelector('#cards-display')
    const modalEl = document.querySelector('#modal')
    const titleEl = document.querySelector('#newTitle')
    const authorEl = document.querySelector('#newAuthor')
    const pagesEl = document.querySelector('#newPages')
    const readEl = document.querySelector('#newRead')
    const btnOpenForm = document.querySelector('#open-form')
    const btnCloseModal = document.querySelector('#modal-close')
    const btnAddNew = document.querySelector('#add-book')

    //Bind Events
    btnOpenForm.addEventListener('click', toggleModalVisibility)
    btnCloseModal.addEventListener('click', toggleModalVisibility)
    document.addEventListener('click', handleModal)
    btnAddNew.addEventListener('click', displayBooks)
    document.addEventListener('click', switchStatus)
    document.addEventListener('click', removeCurrentBook)

    function init() {
        displayLibrary()
    }
    init()
 
    function displayLibrary() {
        cleanDisplay()
        libraryArr.forEach((book, i) => {
            const trimmedTitle = library.trimString(book.title);
            const trimmedAuthor = library.trimString(book.author);
            containerEl.insertAdjacentHTML('afterbegin', 
            `<div class="card">
                <h3>Title: <span id="title">${trimmedTitle}</span></h3>
                <h3>Author: <span id="author">${trimmedAuthor}</span></h3>
                <h3>Pages: <span id="pages">${book.pages}</span></h3>
                <h3>Read status: <span id="status">${book.readStatus?'Finished':'Reading'}</span>
                <input type='checkbox' class='status-check' id='status-check' ${book.readStatus?'checked':""}>
                </h3>
                <button class='btn btn-remove' id='remove'>Remove</button>
            </div>`
            );
        })
    }

    function cleanDisplay() {
        containerEl.innerHTML = ``;
    }

    function toggleModalVisibility() {
        modalEl.classList.toggle('hidden');
    }

    function handleModal(e) {
        if (e.target === modalEl) toggleModalVisibility();
    }

    function displayBooks(e) {
        e.preventDefault();
        library.addBookToLibrary(titleEl.value, authorEl.value, +pagesEl.value, readEl.checked);
        displayLibrary();
        titleEl.value = '';
        authorEl.value = '';
        pagesEl.value = '';
    }

    function removeCurrentBook(e) {
        if (e.target.id === 'remove') {
            const currentBookTitle = e.target.parentNode.childNodes[1].lastChild.textContent;
            const currentBookIndex = library.findBook(libraryArr, currentBookTitle);
            library.removeFromLibrary(currentBookIndex);
            displayLibrary();
        }
    }

    function switchStatus(e) {
        if (e.target.id === 'status-check') {   
            const currentBookTitle = e.target.parentNode.parentNode.childNodes[1].lastChild.textContent;
            const currentBook = libraryArr[library.findBook(libraryArr, currentBookTitle)];
            currentBook.changeReadStatus();
            displayLibrary();
        }
    }
})()