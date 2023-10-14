// ! Html'den gelenler
const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const basketBtn = document.querySelector("#basket-btn");
const closeBtn = document.querySelector("#close-btn");
const basketList = document.querySelector("#list");
const totalInfo = document.querySelector("#total");

// ! olay izleyicileri
//  html'in yüklenme anını izler:
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

/* 
*kategori bilgilerini alma
*1- api'ye istek at
*2- gelen veriyi işle
*3- verileri ekrana basıcak fonksiyonu çalıştır
*4- hata oluşursa kullanıcıyı bilgilendir

*/

const baseUrl = "https://fakestoreapi.com";

function fetchCategories() {
  fetch(`${baseUrl}/products/categories`)
    .then((response) => response.json())
    .then(renderCategories); // then çalıştırıdğı fonksiyon verileri parametre olarak gönderir
  // .catch((err) => alert('Kategorileri alırken bir hata oluştu'));
}

//  her bir kategori için ekrana kart oluştur
function renderCategories(categories) {
  categories.forEach((category) => {
    // *1-div oluştur
    const categoryDiv = document.createElement("div");
    // *2-dive class ekleme
    categoryDiv.classList.add("category");
    // *3-içeriği belirleme
    const randomNum = Math.round(Math.random() * 1000);
    categoryDiv.innerHTML = `
<img src="https://picsum.photos/300/300?r=${randomNum}" />
<h2>${category}</h2>
`;
    // *4-html'e gönderme
    categoryList.appendChild(categoryDiv);
  });
}
// data değişkenini global scope'da tanımlandı
// bu sayede bütün fonksiyonlar bu değere erişebilecek
let data;
//  ürünler verisini çekme
async function fetchProducts() {
  try {
    //   api'a istek at
    const response = await fetch(`${baseUrl}/products`);
    // gelen cevabı işle
    data = await response.json();

    // ekrana bas
    renderProducts(data);
  } catch (err) {
    // alert("Ürünleri alırken bir hata oluştu");
  }
}

// ürünleri ekrana basıcak
function renderProducts(products) {
  // her bir ürün için ürün kartı oluşturma
  const cardsHTML = products
    .map(
      (product) => `
            <div class="card">
            <div class="img-wrapper">
            <img src="${product.image}" />
            </div>
            <h4>${product.title}</h4>
            <h4>${product.category}</h4>
            <div class="info">
              <span>${product.price}$</span>
              <button onclick="addToBasket(${product.id})">Sepete Ekle</button>
            </div>
          </div>
   `
    )
    .join(" ");
  // hazırladığımız html'i ekrana basma
  productList.innerHTML = cardsHTML;
}

// ! Sepet İşlemleri
let basket = [];
let total = 0;

// modal'ı açar
basketBtn.addEventListener("click", () => {
  modal.classList.add("active");
  renderBasket();
  calculateTotal();
});

//  dışarı veya çarpıya tıklanırsa modal'ı kapatır
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-wrapper") ||
    e.target.id === "close-btn"
  ) {
    modal.classList.remove("active");
  }
});

function addToBasket(id) {
  // id'sinden yola çıkarak objenin değerlerini bulma
  const product = data.find((i) => i.id === id);
  // sepete ürün daha önce eklendiyse bulma
  const found = basket.find((i) => i.id == id);
  if (found) {
    // miktarı arttırır
    found.amount++;
  } else {
    // sepete ürünü ekler
    basket.push({ ...product, amount: 1 });
  }
 //  bidlirim verme
 Toastify({
    text: 'Ürün sepete eklendi',
    duration: 3000,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #00b09e, #96c93d)',
    },
  }).showToast();
}


//  sepete elemanları listeleme
function renderBasket() {
  // console.log(basket);
  basketList.innerHTML = basket.map(
    (item) =>
      `
            <div class="item">
            <img src="${item.image}">
            <h3 class="title">${item.title.slice(0, 20) + "..."}</h3>
            <h4 class="price">$${item.price}</h4>
            <p>Miktar: ${item.amount}</p>
            <img onclick="handleDelete(${item.id})" id="delete-img" src="images/e-trash.png">
            </div>
        `
  )
  .join(" ");
}

// toplam ürün sayı ve fiyatını hesaplama
function calculateTotal() {
  // reduce > diziyi döner ve elemanların belirlediğimiz değerlerini toplar
  const total = basket.reduce((sum, item) => sum + item.price * item.amount,
   0
   );

  //   toplam miktar hesaplama
  const amount = basket.reduce((sum, i) => sum + i.amount, 0);
  // hesaplanan bilgileri ekrana basma
  totalInfo.innerHTML = `
<span id="count">${amount} ürün</span>
toplam:
    <span id="price">${total.toFixed(2)}</span>$
`;
}

//  elemanı silme
function handleDelete (deleteId){
//  kaldırılacak ürünü diziden çıkarma
basket = basket.filter((i) => i.id !==deleteId)
// listeyi güncelle
renderBasket();
// toplamı güncelle
calculateTotal();
}
