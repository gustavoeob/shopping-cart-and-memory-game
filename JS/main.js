$(document).ready(function () {
  // Traigo todos los productos del html
  let carts = document.querySelectorAll(".add-cart");
  // Declaro mi variable products para posteriormente asignarle data de mi archivo data.json

  // Importamos a data desde un archivo JSON
  let products;
  $.getJSON("/JS/data.json", function (data) {
    products = data.products;
  });

  // Hacemos un bucle para cada accion que se ejecute como actualizar el n
  for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener("click", () => {
      cartNumbers(products[i]);
      totalCost(products[i]);
      deleteButtons(products[i]);
    });
  }
  // Si tenemos data cargada en el local storage la cargamos tambien en el DOM y viceversa
  function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem("cartNumbers");
    if (productNumbers) {
      document.querySelector(".cart span").textContent = productNumbers;
    }
  }

  // Esta funcion me permite saber cuantos productos estoy añadiendo o quitando del carito
  function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem("cartNumbers");
    // convierto la data obtenida del localStorage de string a number para poder manipularla.
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    if (action) {
      localStorage.setItem("cartNumbers", productNumbers - 1);
      document.querySelector(".cart span").textContent = productNumbers - 1;
      console.log("action running");
    } else if (productNumbers) {
      localStorage.setItem("cartNumbers", productNumbers + 1);
      document.querySelector(".cart span").textContent = productNumbers + 1;
    } else {
      localStorage.setItem("cartNumbers", 1);
      document.querySelector(".cart span").textContent = 1;
    }
    setItems(product);
  }

  function setItems(product) {
    // Key & Value con la informacion del producto
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    // Si mi carro no esta vacio
    if (cartItems != null) {
      let currentProduct = product.tag;

      if (cartItems[currentProduct] == undefined) {
        cartItems = {
          ...cartItems,
          [currentProduct]: product,
        };
      }
      cartItems[currentProduct].inCart += 1;
    } else {
      product.inCart = 1;
      cartItems = {
        [product.tag]: product,
      };
    }

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
  }
  // Sumo el precio por la cantidad de productos total de mi carrito
  function totalCost(product, action) {
    let cart = localStorage.getItem("totalCost");

    if (action) {
      cart = parseInt(cart);

      localStorage.setItem("totalCost", cart - product.price);
    } else if (cart != null) {
      cart = parseInt(cart);
      localStorage.setItem("totalCost", cart + product.price);
    } else {
      localStorage.setItem("totalCost", product.price);
    }
  }
  // Genera el HTML enviando los productos enviados desde mi index.html a cart.html
  function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    let cart = localStorage.getItem("totalCost");
    cart = parseInt(cart);

    let productContainer = document.querySelector(".products");
    // Si hay productos en mi carrito instantaneamnte se genera en el DOM
    if (cartItems && productContainer) {
      $(productContainer).html("");
      Object.values(cartItems).map((item, index) => {
        // Product container es el espacio de trabajo y le actualizo con la informacion de cartItems
        productContainer.innerHTML += `<div class="product-container">
                <div class="product"><ion-icon name="close-circle" id="removeIcon"></ion-icon><img src="/images/${
                  item.tag
                }.jpg" />
                    <span class="sm-hide">${item.name}</span>
                </div>
                <div class="price sm-hide">$${item.price},00</div>
                <div class="quantity">
                    <ion-icon class="decrease " name="arrow-dropleft-circle"></ion-icon>
                        <span>${item.inCart}</span>
                    <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>   
                </div>
                <div class="total">$${item.inCart * item.price},00</div>
            </div>`;
      });
// Total de la compra
      productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">Pay Total</h4>
                <h4 class="basketTotal">$${cart},00</h4>
            </div>`;

      deleteButtons();
      manageQuantity();
    }
  }

  // Aca encapsulo las funciones de incrementar, decrementar y eliminar productos del carro 
  function manageQuantity() {
    // Selecciono elementos del DOM que agregué con js
    let decreaseButtons = document.querySelectorAll(".decrease");
    let increaseButtons = document.querySelectorAll(".increase");
    let currentQuantity = 0;
    let currentProduct = "";
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    // Con este bucle defino que cada vez que cliqueo el boton se acumula en el indice
    // Boton para eliminar productos desde cart.html
    for (let i = 0; i < increaseButtons.length; i++) {
      decreaseButtons[i].addEventListener("click", () => {
        console.log(cartItems);
        currentQuantity =
          decreaseButtons[i].parentElement.querySelector("span").textContent;
        console.log(currentQuantity);
        currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling
          .querySelector("span")
          .textContent.toLocaleLowerCase()
          .replace(/ /g, "")
          .trim();
        console.log(currentProduct);
// Actualiza el valor luego de eliminar los productos en el carro
        if (cartItems[currentProduct].inCart > 1) {
          cartItems[currentProduct].inCart -= 1;
          cartNumbers(cartItems[currentProduct], "decrease");
          totalCost(cartItems[currentProduct], "decrease");
          localStorage.setItem("productsInCart", JSON.stringify(cartItems));
          displayCart();
        }
      });
      // Boton para agregar productos al carro desde cart.html
      increaseButtons[i].addEventListener("click", () => {
        console.log(cartItems);
        currentQuantity =
          increaseButtons[i].parentElement.querySelector("span").textContent;
        console.log(currentQuantity);
        currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling
          .querySelector("span")
          .textContent.toLocaleLowerCase()
          .replace(/ /g, "")
          .trim();
        console.log(currentProduct);
// Actualiza el valor luego de incrementar los productos en el carro
        cartItems[currentProduct].inCart += 1;
        cartNumbers(cartItems[currentProduct]);
        totalCost(cartItems[currentProduct]);
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCart();
      });
    }
  }
// Boton para eliminar productos desde cart.html 
  function deleteButtons() {
    let deleteButtons = $(".product ion-icon");
    let productNumbers = localStorage.getItem("cartNumbers");
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for (let i = 0; i < deleteButtons.length; i++) {
      // reload()
      deleteButtons[i].addEventListener("click", (e) => {
        e.preventDefault();
        productName = deleteButtons[i].parentElement.textContent
          .toLocaleLowerCase()
          .replace(/ /g, "")
          .trim();
// Actualiza los valores del localStorage luego de manipular el escuchador de eventos
        localStorage.setItem(
          "cartNumbers",
          productNumbers - cartItems[productName].inCart
        );
        localStorage.setItem(
          "totalCost",
          cartCost -
            cartItems[productName].price * cartItems[productName].inCart
        );

        delete cartItems[productName];
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));

        displayCart();
        onLoadCartNumbers();
      });
    }
  }
  // Carga siempre la info almacenada de en localStorage cada vez que se actualiza la pagina
  onLoadCartNumbers();
  displayCart();
});
