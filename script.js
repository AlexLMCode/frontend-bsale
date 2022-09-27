let products, categories;
let searchButton = document.getElementById("searchButton");

let clear = document.getElementById("home").addEventListener("click", () => {
  let productsContainer = document.querySelector(".row");
  productsContainer.innerHTML = "";

  getProducts()
    .then((prods) => {
      products = prods.data;
      setProducts();
    })
    .catch((e) => console.error("Error: ", e));
});

const handleSearchBox = () => {
  let searchBox = document.getElementById("searchBox").value;

  if (searchBox === "") {
    alert("Ingrese datos de busqueda");
    return;
  } else {
    let productsContainer = document.querySelector(".row");
    productsContainer.innerHTML = "";

    getProducts(searchBox)
      .then((prods) => {
        products = prods.data;
        if (products.length === 0) {
          console.log("Aqui?");
          let noProds = document.createElement("h1");
          noProds.style = "margin: 1rem 0";
          noProds.innerText = "No hay proudctos con ese nombre";
          productsContainer.appendChild(noProds);
          return;
        }
        setProducts();
      })
      .catch((e) => console.error("Error: ", e));
  }
};

const setCategories = () => {
  let container = document.getElementById("categories-container");
  categories.forEach((category) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.appendChild(document.createTextNode(category.name));
    li.addEventListener("click", (e) => {
      changeCategory(e);
      showOffCanvas();
    });
    container.appendChild(li);
  });
};

const changeCategory = (element) => {
  let selectedCategory = element.target.firstChild.wholeText;
  setSelectedCategory(selectedCategory);
};

const setSelectedCategory = (selectedCategory) => {
  let productsContainer = document.querySelector(".row");
  productsContainer.innerHTML = "";

  console.log("clickeado:", selectedCategory);

  let selectedCat = categories.filter((cat) => cat.name === selectedCategory);
  console.log("Selected cat:", selectedCat[0].id);

  getProducts("", selectedCat[0].id)
    .then((prods) => {
      products = prods.data;
      setProducts();
    })
    .catch((e) => console.error("Error: ", e));
};

const createCard = (name, img, discount, price, category) => {
  category = categories.filter((cat) => cat.id === category);
  let container = document.createElement("div");
  container.classList.add("col-sm-12");
  container.classList.add("col-lg-4");
  container.classList.add("col-sm-6");

  container.innerHTML = `<div class="card" style="border-radius: 15px; margin-bottom: 1rem;">
    <div
      class="bg-image hover-overlay ripple ripple-surface ripple-surface-light"
      data-mdb-ripple-color="light"
    >
      <img
        src="${img}"
        style="
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
          height:410px;
        "
        class="img-fluid"
        alt="${img ? name : "No image URL provided"}"
      />
      <a href="#!">
        <div class="mask"></div>
      </a>
    </div>
    <div class="card-body pb-0">
      <div class="d-flex justify-content-between">
        <div>
          <p>
            <a href="#!" class="text-dark">${name}</a>
          </p>
          <p class="small text-muted" style="text-transform:capitalize">${category[0].name}</p>
        </div>
      </div>
    </div>
    <hr class="my-0" />
    <div class="card-body pb-0">
      <div class="d-flex justify-content-between">
        <p><a href="#!" class="text-dark">$${price}</a></p>
        <p class="text-warning">- $${discount}</p>
      </div>
    </div>
    <hr class="my-0" />
    <div class="card-body">
      <div
        class="d-flex justify-content-between align-items-center pb-2 mb-1"
      >
        <button type="button" class="btn btn-primary">
          Agregar al carrito
        </button>
      </div>
    </div>
  </div>`;
  return container;
};

const setProducts = (category = "") => {
  let productsContainer = document.querySelector(".row");

  if (category.length === 0) {
    products.forEach((prod) => {
      let card = createCard(
        prod.name,
        prod.url_image,
        prod.discount,
        prod.price,
        prod.category
      );
      productsContainer.appendChild(card);
    });
  }
};

const getProducts = async (productName = "", categoryId = "") => {
  try {
    let res = await fetch(
      `http://ec2-35-92-43-27.us-west-2.compute.amazonaws.com/api/products/?productName=${productName}&categoryId=${categoryId}`
    );
    let products = await res.json();
    console.log("procesados:", products);
    return products;
  } catch (error) {
    console.log(error);
  }
};

const getCategories = async () => {
  try {
    let res = await fetch(
      "http://ec2-35-92-43-27.us-west-2.compute.amazonaws.com/api/categories"
    );
    let categories = await res.json();
    return categories;
  } catch (error) {
    console.log(error);
  }
};

const searchProduct = async (string) => {
  try {
    let res = fetch(`/api/products/n=${string.trim.toLowerCase()}`);
    let categories = await res.json();
    return categories;
  } catch (error) {
    console.log(error);
  }
};

const showOffCanvas = () => {
  let canvas = document.querySelector(".offcanvas");
  document.body.style = "";
  canvas.classList.remove("show");
  let backdrop = document.querySelector(".offcanvas-backdrop");
  backdrop.remove();
};

getCategories()
  .then((cats) => {
    cats.data.forEach((cat) => console.log(cat));
    categories = cats.data;
    setCategories();
    console.log("categories:", categories);
  })
  .catch((e) => console.error("Error: ", e));

getProducts()
  .then((prods) => {
    products = prods.data;
    setProducts();
    console.log("Products:", products);
  })
  .catch((e) => console.error("Error: ", e));
