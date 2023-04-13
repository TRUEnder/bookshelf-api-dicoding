const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, readPage, pageCount } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    ...request.payload,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooks = () => books.map((book) => {
  const { id, name, publisher } = book;
  return { id, name, publisher };
});

const getBooksByQueryName = (query) => {
  const returnedBooks = [];

  books.forEach((book) => {
    const { id, name, publisher } = book;
    const bookName = name.toLowerCase();
    if (bookName.includes(query.toLowerCase())) {
      returnedBooks.push({ id, name, publisher });
    }
  });

  return returnedBooks;
};

const getBooksByReading = (readingStat) => {
  const returnedBooks = [];

  books.forEach((book) => {
    if (Number(book.reading) === Number(readingStat)) {
      const { id, name, publisher } = book;
      returnedBooks.push({ id, name, publisher });
    }
  });

  return returnedBooks;
};

const getBooksByFinished = (finishedStat) => {
  const returnedBooks = [];

  books.forEach((book) => {
    if (Number(book.finished) === Number(finishedStat)) {
      const { id, name, publisher } = book;
      returnedBooks.push({ id, name, publisher });
    }
  });

  return returnedBooks;
};

const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let dataObject;

  if (name !== undefined) {
    dataObject = {
      books: getBooksByQueryName(name),
    };
  } else if (reading === '0' || reading === '1') {
    dataObject = {
      books: getBooksByReading(reading),
    };
  } else if (finished === '0' || finished === '1') {
    dataObject = {
      books: getBooksByFinished(finished),
    };
  } else {
    dataObject = {
      books: getAllBooks(),
    };
  }

  const response = h.response({
    status: 'success',
    data: dataObject,
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const theBook = books.filter((book) => book.id === id)[0];

  if (theBook === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: theBook,
    },
  });
  response.code(200);
  return response;
};

const updateBookHandler = (request, h) => {
  const { id } = request.params;
  const { name, readPage, pageCount } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const finished = readPage === pageCount;
  const { insertedAt } = books[index];
  const updatedAt = new Date().toISOString();

  const updatedBookInfo = {
    ...request.payload,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books[index] = updatedBookInfo;

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
    data: {
      book: updatedBookInfo,
    },
  });
  response.code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
