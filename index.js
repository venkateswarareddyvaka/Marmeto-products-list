let products = [];
let copyProducts = [];

function fetchData(type) {
  showSpinner();
  if (products && products.length) {
    // filter the data from existing data by category
    const filtered = copyProducts.find((item) => item.category_name == type);
    activeButton(type.toLowerCase());

    // remove the existing items
    const productsContainer = document.querySelector(".listing-section");
    productsContainer.innerHTML = "";

    // display the present category items
    filtered?.category_products.forEach((product, key) => {
      createProductElement(product, key);
    });
    hideSpinner();
  } else {
    fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    )
      .then((res) => res.json())
      .then((data) => {
        products = [...data.categories];
        copyProducts = [...data.categories];
        const filtered = copyProducts.find(
          (item) => item.category_name == type
        );
        filtered?.category_products.forEach((product, key) => {
          createProductElement(product, key);
        });
        hideSpinner();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function createProductElement(product, key) {
  // Create product container
  const productContainer = document.createElement("div");
  productContainer.classList.add("product");

  // Create image box
  const imageBox = document.createElement("div");
  imageBox.classList.add("image-box");

  // Create image label
  const imageLabel = document.createElement("div");
  if (product.badge_text) {
    imageLabel.classList.add("image-label");
    imageLabel.textContent = product.badge_text;
  }

  // Create images container
  const imagesContainer = document.createElement("div");
  imagesContainer.classList.add("images");
  imagesContainer.id = `image-${key}`;
  // imagesContainer.style.backgroundImage = `url('${product.product_image}')`
  imagesContainer.style.backgroundImage = `url(${product.image})`;
  imagesContainer.id = "image-" + product.id; // assuming product has an id property

  // Append image label and images container to image box
  imageBox.appendChild(imageLabel);
  imageBox.appendChild(imagesContainer);

  // Create text box
  const textBox = document.createElement("div");
  textBox.classList.add("text-box");

  // Create item heading
  const itemHeading = document.createElement("h2");
  itemHeading.classList.add("item");

  // Create spans for item heading
  const itemSpans = [
    product.title.length > 16
      ? product.title.slice(0, 15) + "..."
      : product.title,
    "•",
    product.vendor,
  ].map((text) => {
    const span = document.createElement("span");
    span.textContent = text;
    return span;
  });

  // Append spans to item heading
  itemHeading.append(...itemSpans);

  // Create price heading
  const priceHeading = document.createElement("h3");

  // Create spans for price heading

  const price = Number(product.price);
  const compare_at_price = Number(product.compare_at_price);
  const discount = Math.ceil(
    ((compare_at_price - price) / compare_at_price) * 100
  );

  const priceSpans = [
    `Rs. ${Number(product.price).toFixed(2)}`,
    `₹${Number(product.compare_at_price).toFixed(2)}`,
    `${discount}% Off`,
  ].map((text) => {
    const span = document.createElement("span");
    span.innerHTML = text; // using innerHTML to render <s> tag correctly
    return span;
  });

  // Append spans to price heading
  priceHeading.append(...priceSpans);

  // Create Add to Cart button
  const cartButton = document.createElement("button");
  cartButton.textContent = "Add to Cart";
  cartButton.type = "button";
  cartButton.classList.add("cart-button");
  cartButton.onclick = function () {
    onClick(product.id); // assuming product has an id property
  };

  // Append item heading, price heading, and button to text box
  textBox.appendChild(itemHeading);
  textBox.appendChild(priceHeading);
  textBox.appendChild(cartButton);

  // Append image box and text box to product container
  productContainer.appendChild(imageBox);
  productContainer.appendChild(textBox);

  // Append product container to the listing section
  const listingSection = document.querySelector(".listing-section");
  listingSection.appendChild(productContainer);
}

function activeButton(category) {
  // Remove "active" class from all buttons
  document.querySelectorAll(".buttons-list button").forEach((button) => {
    button.classList.remove("active");
  });

  // Set "active" class on the clicked button
  const clickedButton = document.querySelector(
    `.buttons-list button[data-category="${category}"]`
  );
  clickedButton.classList.add("active");
}

function showSpinner() {
  // Show the spinner container
  const spinnerContainer = document.getElementById("spinner-container");
  spinnerContainer.style.display = "block";
}

function hideSpinner() {
  // Hide the spinner container
  const spinnerContainer = document.getElementById("spinner-container");
  spinnerContainer.style.display = "none";
}

fetchData("Men");