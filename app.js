// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

// Add Book to the List
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list');
  // create tr element
  const row = document.createElement('tr');
  // Insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;

  // Append to the list
  list.appendChild(row);
};

// Show Alert
UI.prototype.showAlert = function (message, className) {
  // Create div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.container');

  const form = document.querySelector('#book-form');

  // Insert alert
  container.insertBefore(div, form);

  // Timeout after 3 sec
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
};

// Delete Book
UI.prototype.deleteBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
};

// Clear fields
UI.prototype.clearFields = function () {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};

// LS Construstor
function Store() {}

// Get books from LS
Store.prototype.getBooks = function () {
  let books;

  if (localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;
};

// Add book to LS
Store.prototype.addBook = function (book) {
  // Instantiate Store
  const store = new Store();

  // Get books
  const books = store.getBooks();

  // Add book
  books.push(book);

  // Add to LS
  localStorage.setItem('books', JSON.stringify(books));
};

// Display books from LS
Store.prototype.displayBooks = function () {
  // Instantiate Store
  const store = new Store();

  // Get books
  const books = store.getBooks();

  // Instantiate UI
  const ui = new UI();

  books.forEach(function (book) {
    ui.addBookToList(book);
  });
};

// Remove book from LS
Store.prototype.removeBook = function (isbn) {
  // Instantiate Store
  const store = new Store();

  // Get books
  const books = store.getBooks();

  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem('books', JSON.stringify(books));
};

// DOM Load event
document.addEventListener('DOMContentLoaded', new Store().displayBooks);

// Event Listener for add Book
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Instantiate Store
  const store = new Store();

  // Validate
  if (title === '' || author === '' || isbn === '') {
    // Error alert
    ui.showAlert('Please fill in all field', 'error');
  } else {
    // ADD book to UI
    ui.addBookToList(book);

    // Add book to Store
    store.addBook(book);

    // Show success
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();

  // Instantiate Store
  const store = new Store();

  // Delete book
  ui.deleteBook(e.target);

  // Delete from LS
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});
