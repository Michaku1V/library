'use strict'

const containerEl = document.querySelector('#cards-display')
const modalEl = document.querySelector('#modal')
const titleEl = document.querySelector('#newTitle')
const authorEl = document.querySelector('#newAuthor')
const pagesEl = document.querySelector('#newPages')
const readEl = document.querySelector('#newRead')
const btnOpenForm = document.querySelector('#open-form')
const btnCloseModal = document.querySelector('#modal-close')
const btnAddNew = document.querySelector('#add-book')
const statusEl = document.querySelector('#status-check')


let library = [];

function Book(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages; 
    this.readStatus = readStatus;   
}
addBookToLibrary('Lord of the Rings', 'J.R.R.Tolkien', 1000, false);
addBookToLibrary('Game of Thrones', 'George R.R. Martin', 1500, true);

Book.prototype.changeReadStatus = function () {
    this.readStatus ? this.readStatus = false : this.readStatus = true;
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

function cleanDisplay() {
    containerEl.innerHTML = ``;
}
function displayLibrary() {
    cleanDisplay()
    library.forEach((book, i) => {
        const trimmedTitle = trimString(book.title);
        const trimmedAuthor = trimString(book.author);
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
    displayLibrary();
    titleEl.value = '';
    authorEl.value = '';
    pagesEl.value = '';
    toggleModalVisibility();
}

function removeFromLibrary(bookIndex) {
    library.splice(bookIndex, 1)   
}

function trimString(str) {
    const length = 20;
    const trimmedString = str.length > length ? str.substring(0, length - 3) + "..." : str;
    return trimmedString;
}

function toggleModalVisibility() {
    modalEl.classList.toggle('hidden');
}

// BIND EVENTS
btnOpenForm.addEventListener('click', toggleModalVisibility)
btnCloseModal.addEventListener('click', toggleModalVisibility)
document.addEventListener('click', (e) => {
    if (e.target === modalEl) toggleModalVisibility();
    // ADD NEW BOOK
    if (e.target === btnAddNew) {
        e.preventDefault();
        addBookToLibrary(titleEl.value, authorEl.value, +pagesEl.value, readEl.checked);
        console.log(library)  
    }
    // REMOVE CURRENT BOOK
    if (e.target.id === 'remove') {
        const currentBookTitle = e.target.parentNode.childNodes[1].lastChild.textContent;
        const currentBookIndex = findBook(library, currentBookTitle);
        removeFromLibrary(currentBookIndex);
        displayLibrary();
    }
   // CHANGE READ STATUS
    if (e.target.id === 'status-check') {
        const currentBookTitle = e.target.parentNode.parentNode.childNodes[1].lastChild.textContent;
        const currentBook = library[findBook(library, currentBookTitle)];
        currentBook.changeReadStatus();
        displayLibrary();
    }
})