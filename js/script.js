const bookList = document.getElementById("book-list") // seleziona il contenitore in cui verranno inserite le card dei books
const cartList = document.getElementById("cart") // seleziona cart list
let cart = JSON.parse(localStorage.getItem("cart")) || [] // recupera il cart salvato dal localStorage e lo converte in un array JS con JSON.parse(). Se non esiste, inizializza cart come array vuoto ([])

// Funzione per recuperare books dall'API //
const fetchBooks = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
      .then(response => {
          if (response.ok) { // controlla se la richiesta ha avuto successo
              return response.json() // converte la risposta in JSON
          } else {
              console.error("Errore nel recupero dei libri:", response.status, response.statusText)
              return null // ritorna null per evitare errori nel successivo .then()
          }
      })
      .then(books => {
          if (books) { // Se books non è null, chiama displayBooks()
              displayBooks(books)
          }
      })
      .catch(error => console.error("Errore di rete:", error)) // gestisce errori di rete
}


// Funzione per visualizzare books //
const displayBooks = (books) => { // per ogni book viene creato un div
  books.forEach((book) => {
    const bookCard = document.createElement("div")
    bookCard.classList.add("col-md-3", "mb-4")
    // creazione di card con contenuto descrittivo dei books e buttons
    bookCard.innerHTML = 
              ` <div class="card h-100">
                  <img src="${book.img}" class="card-img-top" alt="${book.title}"> 
                  <div class="card-body">
                      <h5 class="card-title">${book.title}</h5>
                      <p class="card-text">€${book.price.toFixed(2)}</p>
                      <button class="btn btn-custom btn-sm" onclick='addToCart(${JSON.stringify(book)})'>Compra ora</button>
                      <button class="btn btn-custom btn-sm" onclick="removeBook(this)">Rimuovi</button>
                  </div>
              </div> `
    bookList.appendChild(bookCard)
  })
}

// Funzione per rimuovere card dalla pagina // 
const removeBook = (button) => {
  button.closest(".col-md-3").remove() // button.closest -> trova il contenitore del book (.col-md-3) più vicino all'elemento del btn
}

// Funzione per aggiungere un book al cart //
const addToCart = (book) => {
  cart.push(book) // aggiunge il book selezionato all'array cart
  localStorage.setItem("cart", JSON.stringify(cart)) // aggiorna il localStorage salvando cart come stringa JSON
  renderCart() // chiamata per aggiornare la visualizzazione del cart
}

// Funzione per aggiornare la visualizzazione del cart //
const renderCart = () => {
  cartList.innerHTML = "" // pulizia lista
  cart.forEach((book, index) => { // creazione di un li per ogni book messo nel cart (title, price and remove btn)
    const cartItem = document.createElement("li")
    cartItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "cart-item"
    )
    cartItem.innerHTML = 
    `${book.title} - €${book.price.toFixed(2)}
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Rimuovi</button>` // onclick -> chiama removeFromCart con l'indice del libro
    cartList.appendChild(cartItem);
  })
}

// Funzione per rimuovere book dal cart //
const removeFromCart = (index) => {
  cart.splice(index, 1) // rimuove book da array
  localStorage.setItem("cart", JSON.stringify(cart)) // aggiorna localStorage
  renderCart() // ricarica visualizzazione del carrello
}

fetchBooks() // recupera books e li mostra nella pagina
renderCart() // carica i books salvati nel cart (se presenti nel localStorage)