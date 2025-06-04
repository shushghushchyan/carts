async function fetchBooks() {
  try {
    const response = await fetch('./cards.json');
    if (!response.ok) throw new Error('Network response was not ok');

    const books = await response.json();
    const container = document.getElementById('book-cards');

    books.forEach((book) => {
      const card = document.createElement('div');
      card.classList.add('book-card');

      const img = document.createElement('img');
      img.classList.add('img');
      img.src = book.images[0];
      img.alt = 'Book image';

      img.addEventListener('mouseenter', () => {
        img.timeoutId = setTimeout(() => {
          img.src = book.images[1];
        }, 2000);
      });

      img.addEventListener('mouseleave', () => {
        clearTimeout(img.timeoutId);
        img.src = book.images[0];
      });

      const inputValue = document.createElement("input");
      inputValue.type = "number";
      inputValue.min = "1";
      inputValue.value = "1";
      inputValue.classList.add("quantity-input");

      const buy = document.createElement("button");
      buy.innerText = "BUY NOW";

      buy.addEventListener("click", () => {
        const quantity = Number(inputValue.value);
        const storageKey = `book-${book.name}`;
        const storage = localStorage.getItem(storageKey);

        if (storage) {
          const existing = JSON.parse(storage);
          existing.selectedQuantity += quantity;
          localStorage.setItem(storageKey, JSON.stringify(existing));
        } else {
          const selectedBook = {
            name: book.name,
            price: book.price,
            discount: book.discount,
            rating: book.rating,
            images: book.images,
            description: book.description,
            selectedQuantity: quantity
          };
          localStorage.setItem(storageKey, JSON.stringify(selectedBook));
        }

        updateBasketQuantity();
      });

      card.innerHTML = `
        ${book.discount > 0 
          ? `<div class="sale">SALE ${book.discount}%</div>` 
          : ""
        }
        <p>Rating: ${book.rating}</p>
        <p><strong>${book.name}</strong></p>
        ${book.discount > 0
          ? `<div style="display: flex; gap: 5px">
               <p>Price:</p> 
               <p style="text-decoration:line-through">${book.price} AMD</p>  
               <p style="color:red">${book.price - (book.price * book.discount) / 100} AMD</p>
             </div>`
          : `<p>${book.price} AMD</p>`
        }
        <p>${book.description}</p>
      `;

      card.appendChild(document.createElement("br"));
      card.appendChild(document.createTextNode("Quantity:"));
      card.appendChild(inputValue);
      card.appendChild(buy);
      container.appendChild(card);
      card.insertBefore(img, card.firstChild);
    });

  } catch (error) {
    console.error('Error loading books:', error);
  }
}

function updateBasketQuantity() {
  const quantityBasket = document.getElementById("quantityBasket");
  if (!quantityBasket) return;

  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("book-")) {
      const product = JSON.parse(localStorage.getItem(key));
      count += product.selectedQuantity;
    }
  }
  quantityBasket.innerText = count;
}

function renderCartProducts() {
  const basketDiv = document.getElementById("basketDiv");
  if (!basketDiv) return;

  basketDiv.innerHTML = '';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("book-")) {
      const product = JSON.parse(localStorage.getItem(key));

      const productCard = document.createElement("div");
      productCard.classList.add("cart-card-basket");
      productCard.style.border = "1px solid #ccc";
      productCard.style.padding = "10px";
      productCard.style.margin = "10px";
      productCard.style.borderRadius = "10px";

      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.min = "1";
      quantityInput.value = product.selectedQuantity;
      quantityInput.style.marginRight = "10px";

      const saveBtn = document.createElement("button");
      saveBtn.innerText = "save";
      saveBtn.style.marginLeft = "10px";
      saveBtn.style.backgroundColor = "green";
      saveBtn.style.color = "white";

      saveBtn.addEventListener("click", () => {
        product.selectedQuantity = Number(quantityInput.value);
        localStorage.setItem(key, JSON.stringify(product));
        updateBasketQuantity();
        renderCartProducts();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "delete";
      deleteBtn.style.backgroundColor = "red";
      deleteBtn.style.color = "white";
      deleteBtn.style.marginLeft = "10px";

      deleteBtn.addEventListener("click", () => {
        localStorage.removeItem(key);
        updateBasketQuantity();
        renderCartProducts();
      });

      productCard.innerHTML = `
        <img src="${product.images[0]}" alt="Book Image" style="max-width: 100px;">
        <h3>${product.name}</h3>
        <p>Գին՝ ${product.discount > 0 
          ? `<span style="text-decoration: line-through;">${product.price} AMD</span> 
             <span style="color: red;">${product.price - (product.price * product.discount) / 100} AMD</span>`
          : `${product.price} AMD`
        }</p>
      `;

      const quantityWrap = document.createElement("div");
      quantityWrap.appendChild(quantityInput);
      quantityWrap.appendChild(saveBtn);
      quantityWrap.appendChild(deleteBtn);
      productCard.appendChild(quantityWrap);
      basketDiv.appendChild(productCard);
    }
  }
}

function summ() {
  let sum = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith("book-")) continue;

    const value = JSON.parse(localStorage.getItem(key));
    const total = value.discount > 0
      ? value.selectedQuantity * (value.price - (value.price * value.discount / 100))
      : value.selectedQuantity * value.price;

    sum += total;
  }
  return sum;
}

function updateTotalPrice() {
  const total = document.getElementById("totalPrice");
  if (total) {
    total.innerHTML = `Total: ${summ()} AMD`;
  }
}

function renderBasket() {
  const basketDiv = document.getElementById("basketDiv");
  if (!basketDiv) return;

  basketDiv.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith("book-")) continue;

    const product = JSON.parse(localStorage.getItem(key));

    const productCard = document.createElement("div");
    productCard.classList.add("cart-card-basket");
    productCard.style.border = "1px solid #ccc";
    productCard.style.padding = "10px";
    productCard.style.margin = "10px";
    productCard.style.borderRadius = "10px";

    const quantityInput = document.createElement("input");
    quantityInput.classList.add("quantityBasket")
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = product.selectedQuantity;
    quantityInput.style.marginRight = "10px";

    const divSaveDelete = document.createElement("div");
    divSaveDelete.classList.add("divSaveDelete");
    const saveBtn = document.createElement("button");
    saveBtn.classList.add("savebtn")
    saveBtn.innerText = "save";
    saveBtn.style.marginLeft = "10px";
    saveBtn.style.color = "white";

    saveBtn.addEventListener("click", () => {
      product.selectedQuantity = Number(quantityInput.value);
      localStorage.setItem(key, JSON.stringify(product));
      updateBasketQuantity();
      updateTotalPrice();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deletebtn")
    deleteBtn.innerText = "delete";
    deleteBtn.style.color = "white";
    deleteBtn.style.marginLeft = "10px";

    deleteBtn.addEventListener("click", () => {
      localStorage.removeItem(key);
      renderBasket();
      updateBasketQuantity();
      updateTotalPrice();
      empty();

    });

    productCard.innerHTML = `
      <img src="${product.images[0]}" alt="Book Image" style="max-width: 100px;">
      <h3>${product.name}</h3>
      <p>Գին՝ ${product.discount > 0 
        ? `<span style="text-decoration: line-through;">${product.price} AMD</span> 
           <span style="color: red;">${product.price - (product.price * product.discount) / 100} AMD</span>`
        : `${product.price} AMD`
      }</p>
    `;

    const quantityWrap = document.createElement("div");
    quantityWrap.innerText = "quantity ";
    quantityWrap.appendChild(quantityInput);
    quantityWrap.appendChild(saveBtn);
    quantityWrap.appendChild(deleteBtn);

    productCard.appendChild(quantityWrap);
    productCard.appendChild(divSaveDelete);
    divSaveDelete.appendChild(deleteBtn);
    divSaveDelete.appendChild(saveBtn)
    basketDiv.appendChild(productCard);
  }
  updateTotalPrice();
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("basket.html")) {
    renderBasket();
  } else {
    fetchBooks();
    updateBasketQuantity();
  }
});

function empty() {
  if (window.location.pathname.includes("basket.html") && localStorage.length < 1) {
    const empty = document.createElement("div");
    empty.classList.add("empty"); 
    empty.innerHTML = "Basket is empty";
    document.body.appendChild(empty); 
  }
}

empty();
