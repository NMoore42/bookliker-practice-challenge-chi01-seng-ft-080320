//VARIABLES
const bookList = document.querySelector("#list")
const bookDetail = document.querySelector("#show-panel")
let clickedBookUsers;

//FUNCTIONS

function getBooksData() {
  fetch("http://localhost:3000/books")
    .then( resp => resp.json() )
    .then( booksData => renderBookLis(booksData))
    .catch( err => console.log(err) )
}

function renderBookLis(booksData) {
  let liString = ""
  booksData.forEach( bookData => liString += `<li data-id=${bookData.id}>${bookData.title}</li>`)
  bookList.innerHTML = liString
}

function showBookDetailHandler() {
  if (event.target.tagName === "LI") {
    getBookData(event.target.dataset.id)
  }
}

function getBookData(bookId) {
  fetch(`http://localhost:3000/books/${bookId}`)
    .then( resp => resp.json() )
    .then( bookData => showBookDetail(bookData))
    .catch( err => console.log(err) )
}

function showBookDetail(bookData) {
  clickedBookUsers = bookData.users
  bookDetail.innerHTML = `
    <img src=${bookData.img_url} alt="image of book">
    <h4>${bookData.title}</h4>
    <h4>${bookData.subtitle}</h4>
    <h4>${bookData.author}</h4>
    <p>${bookData.description}</p>
    <ul id="user-ul">
      ${createUserLis(bookData.users)}
    </ul>
    <button data-id=${bookData.id}>Save</button>
  `
}

function createUserLis(usersArr) {
  let liString = ""
  usersArr.forEach( user => liString += `<li>${user.username}</li>`)
  return liString
}

function likeBookHandler() {
  if (event.target.tagName === "BUTTON") {
    likeBook(event.target.dataset.id)
  }
}

function likeBook(bookId) {
  const patchObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      users: [...clickedBookUsers, {"id":1, "username":"pouros"}]
    })
  }

  fetch(`http://localhost:3000/books/${bookId}`, patchObj)
    .then( resp => resp.json() )
    .then( bookData => appendLikedUser(bookData.users))
    .catch( err => console.log(err) )
}

function appendLikedUser(usersArr) {
  const userUl = document.getElementById("user-ul")
  userUl.innerHTML = createUserLis(usersArr)
}

//EVENT LISTENERS
bookList.addEventListener("click", showBookDetailHandler)
bookDetail.addEventListener("click", likeBookHandler)

//INVOKED FUNCTIONS
getBooksData()
