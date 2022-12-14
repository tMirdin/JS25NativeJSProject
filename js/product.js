const API = "http://localhost:8000/product";

// ? Сохранение тегов в переменные

// инпуты и кнопки для создания новых данных
let inpDetails = document.querySelector(".section__add_details");
let inpPrice = document.querySelector(".section__add_price");
let inpQuantity = document.querySelector(".section__add_quantity");
let inpSales = document.querySelector(".section__add_sales");
let inpCategory = document.querySelector(".section__add_category");
let inpUrl = document.querySelector(".section__add_url");
let btnAdd = document.querySelector(".section__add_btn-add");
let accordion = document.getElementsByClassName("accordion__header")[0];

// тег для отображения данных в браузере
let sectionRead = document.getElementById("section__read");

// инпуты и кнопки для редактирования
let inpEditDetails = document.querySelector(".window__edit_details");
let inpEditPrice = document.querySelector(".window__edit_price");
let inpEditQuantity = document.querySelector(".window__edit_quantity");
let inpEditSales = document.querySelector(".window__edit_sales");
let inpEditCategory = document.querySelector(".window__edit_category");
let inpEditUrl = document.querySelector(".window__edit_url");
let btnEditSave = document.querySelector(".window__edit_btn-save");
let mainModal = document.querySelector(".main-modal");
let btnEditClose = document.querySelector(".window__edit_close");

//  инпут и переменная для поиска
let inpSearch = document.querySelector(".search-txt");
let searchValue = inpSearch.value;

// кнопки для пагинации
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let currentPage = 1;

// Фильтрация
let form = document.getElementsByTagName("form")[0];
let category = "all";

// ! =========== Кодовое слово ==========
let section__add = document.querySelector(".section__add");
let admin_panel_arr = document.getElementsByClassName("admin-panel");
let clickAdmin = document.getElementById("open_admin");
let code = "";

function adminReturn() {
  if (code !== "Mirdin") {
    setTimeout(() => {
      for (let i of admin_panel_arr) {
        i.style.display = "none";
      }
    }, 50);
    section__add.style.display = "none";
  } else {
    setTimeout(() => {
      for (let i of admin_panel_arr) {
        i.style.display = "block";
      }
    }, 50);
    section__add.style.display = "block";
  }
}

clickAdmin.addEventListener("click", () => {
  code = prompt("Введите кодовое слово:");
  adminReturn();
});

//! ======== Accordion Start ==========

accordion.addEventListener("click", (event) => {
  accordion.classList.toggle("active");
  let accordionBody = document.getElementById("accordion__body");
  if (accordion.classList.contains("active")) {
    accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
  } else {
    accordionBody.style.maxHeight = 0;
  }
});
//? ======== Accordion End ============

// ! =========== Create Start ===========
function createProduct(obj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then(() => readProducts());
}

btnAdd.addEventListener("click", () => {
  // проверка на заполненность полей
  if (
    !inpDetails.value.trim() ||
    !inpPrice.value.trim() ||
    !inpCategory.value.trim() ||
    !inpQuantity.value.trim() ||
    !inpSales.value.trim() ||
    !inpUrl.value.trim()
  ) {
    alert("Заполните поле");
    return;
  }
  let obj = {
    detailes: inpDetails.value,
    price: inpPrice.value,
    quantity: inpQuantity.value,
    category: inpCategory.value,
    sale: inpSales.value,
    urlImg: inpUrl.value,
  };
  createProduct(obj);
  inpDetails.value = "";
  inpPrice.value = "";
  inpQuantity.value = "";
  inpCategory.value = "";
  inpSales.value = "";
  inpUrl.value = "";
});
// ? =========== Create End =============

// ! ============ Read Start ============
function readProducts() {
  fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=6&${
      category === "all" ? "" : "category=" + category
    }`
  )
    .then((res) => res.json())
    .then((data) => {
      sectionRead.innerHTML = "";
      data.forEach((product) => {
        sectionRead.innerHTML += `
        <div class="card">
        <div class="card2">
            <div class="front2" style="background-image: url(${product.urlImg});"></div>  
           <div class="back2">
            <div id="card_details2"><p>${product.detailes}</p></div>
           </div>  
          </div>
          <div class="text">
          <h2>${product.category}</h2>
        <span class="card_price">Цена: ${product.price} сом</span>
        <br>
        <span class="card_sales">Cкидка: ${product.sale} %</span>
            </div>
            <div class= "userIcon" id="user-panel">
            <img src="../images/сердце.png" alt="">
            <button class="btnBuy">Выбрать</button>
            </div>
        <div class="admin-panel" id="admin">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1799/1799391.png"
            alt=""
            width="30"
            id=${product.id}
            class="read_del"
            onclick="deleteProduct(${product.id})"
          />
          <img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" alt="" width="30" onclick="handleEditBtn(${product.id})"/>
        </div>
      </div>
        `;
      });
    });
  pageTotal();
  adminReturn();
}

readProducts();
// ? ============ Read End ============

// ! ============ Delete Start ===========
// todo вариант 1 для удаления
// document.addEventListener("click", (e) => {
//   let del_class = [...e.target.classList];
//   if (del_class[0] === "read__del") {
//     console.log(e.target.id);
//     fetch(`${API}/${e.target.id}`, {
//       method: "DELETE",
//     }).then(() => readProducts());
//   }
// });

// todo вариант 2 для удаления
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readProducts());
}
// ? ============ Delete End ===========

// ! =============== Edit Sart ===========
function editProduct(id, editedObj) {
  // проверка на заполненность полей
  if (
    !inpEditDetails.value.trim() ||
    !inpEditPrice.value.trim() ||
    !inpEditCategory.value.trim() ||
    !inpEditQuantity.value.trim() ||
    !inpEditSales.value.trim() ||
    !inpEditUrl.value.trim()
  ) {
    alert("Заполните поле");
    return;
  }
  fetch(`${API}/${id}`, {
    method: "PATCH", // PUT - меняет объект целиком. PATCH - меняет только те ключи, которые нужны
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedObj),
  }).then(() => readProducts());
}

let editId = "";
function handleEditBtn(id) {
  mainModal.style.display = "block";
  fetch(`${API}/${id}`)
    .then((res) => res.json())
    .then((productObj) => {
      inpEditDetails.value = productObj.detailes;
      inpEditPrice.value = productObj.price;
      inpEditQuantity.value = productObj.quantity;
      inpEditSales.value = productObj.sale;
      inpEditCategory.value = productObj.category;
      inpEditUrl.value = productObj.urlImg;
      editId = productObj.id;
    });
}

btnEditClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

btnEditSave.addEventListener("click", () => {
  let editedObj = {
    detailes: inpEditDetails.value,
    price: inpEditPrice.value,
    quantity: inpEditQuantity.value,
    category: inpEditCategory.value,
    urlImg: inpEditUrl.value,
    sale: inpEditSales.value,
  };
  editProduct(editId, editedObj);
  mainModal.style.display = "none";
});
// ? =============== Edit End ===========

// ! ============ Search Start ==========
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  readProducts();
});
// ? ============ Search End ==========

// ! ========== Paginate Start =========
let countPage = 1;
function pageTotal() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 6);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
// ? ========== Paginate End ==========

// ! ========Filter Start =======
form.addEventListener("change", (e) => {
  // console.log(e.target.value);
  category = e.target.value;
  readProducts();
});
// ? ========Filter End =======
