const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  fetch("https://api.escuelajs.co/api/v1/categories")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerHTML = `
        <img src="${category.image}" />
        <span>${category.name}</span>
        `;
        categoryList.appendChild(categoryDiv);
      })
    );
}

function fetchProduct() {
  fetch("https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 24).forEach((item) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
        <img src="${item.images[0]}" />
        <p>${item.title}</p>
        <p>${item.category.name}</p>
        <div class="product-action">
          <p>${item.price} $</p>
          <button onclick="addToBasket({id:${item.id} ,title:'${item.title}', price:${item.price},img:'${item.images[0]}',amount:1})">Sepete Ekle</button>
        </div>
        `;
        productList.appendChild(productDiv);
      })
    );
}

let basket = [];
let total = 0;

function addToBasket(product) {
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);
  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}

// Açma ve Kapama
openBtn.addEventListener("click", () => {
  modal.classList.add("active");

  //sepetin içine ürünleri listelem
  addList();

  //toplam bilgisini güncelleme
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  // Sepeti kapatınca içini temizleme
  modalList.innerHTML = "";
  //toplam değerini sıfırlama
  total = 0;
});
// Sepete Listeleme
function addList() {
  basket.forEach((product) => {
    //Sepet dizisindeki her bir obje için div oluşturur
    const listItem = document.createElement("div");
    //bunlara class ekle
    listItem.classList.add("list-item");
    //içeriğini değiştir
    listItem.innerHTML = `
    <img src="${product.img}"  />
    <h2>${product.title}</h2>
    <h2 class="price ">${product.price} $ </h2>
    <p>miktar : ${product.amount} </p>
    <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
    `;
    modalList.appendChild(listItem);

    //Toplam değişkenini güncelleme

    total += product.price * product.amount;
  });
}

// sepet dizisinden silme fonksiyonu
function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  // silinen elemanın fiyatını total'den çıkartma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener("click", (e) => {
  if (e.target.id === "del") {
    e.target.parentElement.remove();
  }
});

// eğer dışarıya tıklanırsa kapatma
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
