let productList = [];
let carrito = [];
let total = 0;
let order = {
  items: [],
};

function add(productId, price) {
  const product = productList.find((p) => p.id === productId);
  product.stock--;

  order.items.push(productList.find((p) => p.id === productId));

  console.log(productId, price);
  carrito.push(productId);
  total = total + price;
  document.getElementById("checkout").innerHTML = `Carrito $${total}`;
  displayProducts();
}

async function showOrder() {
  document.getElementById("all-products").style.display = "none";
  document.getElementById("order").style.display = "block";

  document.getElementById("order-total").innerHTML = `$${total}`;

  let productsHTML = `
    <tr>
        <th>Cantidad</th>
        <th>Detalle</th>
        <th>Subtotal</th>
    </tr>`;
  order.items.forEach((p) => {
    productsHTML += `<tr>
            <td>1</td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
        </tr>`;
  });
  document.getElementById("order-table").innerHTML = productsHTML;
}

async function pay() {
  try {
    order.shipping = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      addressLine1: document.getElementById("addressLine1").value,
      addressLine2: document.getElementById("addressLine2").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postalCode").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
    };

    const preference = await (
      await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    var script = document.createElement("script");

    // The source domain must be completed according to the site for which you are integrating.
    // For example: for Argentina ".com.ar" or for Brazil ".com.br".
    script.src =
      "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference.preferenceId;
    script.setAttribute("data-button-label", "Pagar con Mercado Pago");
    document.getElementById("order-actions").innerHTML = "";
    document.querySelector("#order-actions").appendChild(script);

    document.getElementById("name").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("addressLine1").disabled = true;
    document.getElementById("addressLine2").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("postalCode").disabled = true;
    document.getElementById("state").disabled = true;
    document.getElementById("country").disabled = true;
  } catch {
    window.alert("Sin stock");
  }

  carrito = [];
  total = 0;
  order = {
    items: [],
  };
  //await fetchProducts();
  document.getElementById("checkout").innerHTML = `Carrito $${total}`;
}

//-----
function displayProducts() {
  document.getElementById("all-products").style.display = "block";
  document.getElementById("order").style.display = "none";

  const funkos = productList.filter((p) => p.category === "funkos");
  displayProductsByType(funkos, "product-cards-funkos");

  const cuadros = productList.filter((p) => p.category === "cuadros");
  displayProductsByType(cuadros, "product-cards-cuadros");

  const tazas = productList.filter((p) => p.category === "tazas");
  displayProductsByType(tazas, "product-cards-tazas");

  const preventas = productList.filter((p) => p.category === "preventas");
  displayProductsByType(preventas, "product-cards-preventas");
}

function displayProductsByType(productsByType, tagId) {
  let productsHTML = "";
  productsByType.forEach((p) => {
    let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;

    if (p.stock <= 0) {
      buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.price})">Sin stock</button>`;
    }

    productsHTML += `<div class="product-container">
            <h3>${p.name}</h3>
            <img src="${p.image}" />
            <h1>$${p.price}</h1>
            ${buttonHTML}
        </div>`;
  });
  document.getElementById(tagId).innerHTML = productsHTML;
}

async function fetchProducts() {
  productList = await (await fetch("/api/products")).json();
  displayProducts();
}

window.onload = async () => {
  await fetchProducts();
};

// Header
window.onscroll = function(){

  scroll = document.documentElement.scrollTop;

  header = document.getElementById("header");

  if (scroll > 20){
      header.classList.add('nav_mod');
  }else if (scroll < 20){
      header.classList.remove('nav_mod');
  }

}

document.getElementById("btn_menu").addEventListener("click", mostrar_menu);

  menu = document.getElementById("header");
  body = document.getElementById("container__all");
  nav = document.getElementById("nav");

function mostrar_menu(){

  body.classList.toggle('move_content');
  menu.classList.toggle('move_content');
  nav.classList.toggle('move_nav');
}

window.addEventListener("resize", function(){

  if (window.innerWidth > 760)  {
      body.classList.remove('move_content');
      menu.classList.remove('move_content');
      nav.classList.remove('move_nav');
  }

});
// --------------------------