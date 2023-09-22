// Declareer een globale variabele products buiten alle functies.
let products = [];

// Functie om de JSON-gegevens uit te lezen
function loadJSON(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'products.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

// Functie om de producten op de pagina te bewerken
function editProduct(product) {
    const productDiv = document.createElement("div");
    productDiv.className = "product";

    const id = document.createElement("span");
    id.textContent = `ID: ${product.id}`;

    const name = document.createElement("span");
    name.textContent = `Naam: ${product.name}`;

    const category = document.createElement("span");
    category.textContent = `Categorie: ${product.category}`;

    const size = document.createElement("span");
    size.textContent = `Maat: ${product.size}`;

    const price = document.createElement("span");
    price.textContent = `Prijs: €${product.price}`;

    const amount = document.createElement("span");
    amount.textContent = `Aantal: ${product.amount}`;

    const addButton = document.createElement("button");
    addButton.textContent = "Toevoegen";
    addButton.className = "addToBasket"; 
    addButton.addEventListener("click", () => {
        product.amount++;
        amount.textContent = `Aantal: ${product.amount}`;
        saveToLocalStorage(products);
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Verwijderen";
    removeButton.className = "removeFromBasket";
    removeButton.addEventListener("click", () => {
        if (product.amount > 0) {
            product.amount--;
            amount.textContent = `Aantal: ${product.amount}`;
            if (product.amount === 0) {
                products = products.filter(p => p.id !== product.id);
                productDiv.remove();
            }
            saveToLocalStorage(products);
        }
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Artikel bewerken";
    editButton.className = "editProduct";
    editButton.addEventListener("click", () => {
        editProductForm(product, productDiv);
    });

    productDiv.appendChild(id);
    productDiv.appendChild(name);
    productDiv.appendChild(category);
    productDiv.appendChild(size);
    productDiv.appendChild(price);
    productDiv.appendChild(amount);
    productDiv.appendChild(addButton);
    productDiv.appendChild(removeButton);
    productDiv.appendChild(editButton);

    productList.appendChild(productDiv);
}

// Functie om het bewerkingsformulier voor een product weer te geven
function editProductForm(product, productDiv) {
    const editForm = document.createElement("form");
    editForm.classList.add("editProductForm");
    editForm.innerHTML = `
        <label for="editId">ID:</label>
        <input type="text" id="editId" value="${product.id}" required><br>

        <label for="editName">Naam:</label>
        <input type="text" id="editName" value="${product.name}" required><br>

        <label for="editCategory">Categorie:</label>
        <input type="text" id="editCategory" value="${product.category}" required><br>

        <label for="editSize">Maat:</label>
        <input type="text" id="editSize" value="${product.size}" required><br>

        <label for="editPrice">Prijs:</label>
        <input type="number" id="editPrice" value="${product.price}" step="0.01" required><br>

        <label for="editAmount">Aantal:</label>
        <input type="number" id="editAmount" value="${product.amount}" required><br>

        <button type="button" id="saveEditButton">Product Opslaan</button>
    `;

    const saveEditButton = editForm.querySelector("#saveEditButton");
    saveEditButton.addEventListener("click", () => {
        const editedProduct = {
            "id": document.getElementById("editId").value,
            "name": document.getElementById("editName").value,
            "category": document.getElementById("editCategory").value,
            "size": document.getElementById("editSize").value,
            "price": parseFloat(document.getElementById("editPrice").value),
            "amount": parseInt(document.getElementById("editAmount").value)
        };

        // Update het bewerkte product in de local storage
        const index = products.findIndex(p => p.id === editedProduct.id);
        if (index !== -1) {
            products[index] = editedProduct;
            saveToLocalStorage(products);

            // Verwijder het bewerkingsformulier en update de productlijst
            editForm.remove();
            productDiv.innerHTML = ""; // Leeg het productdiv
            displayProducts();
        }
    });

    productDiv.appendChild(editForm);
}

// Functie om de producten op de pagina te weergeven
function displayProducts() {
    const productList = document.getElementById("productList");
    productList.innerHTML = '';

    const categoryFilter = document.getElementById("categoryFilter").value;

    products.forEach(product => {
        if (categoryFilter === 'All' || product.category === categoryFilter) {
            editProduct(product);
        }
    });
}

// Functie om de gegevens naar localStorage op te slaan
function saveToLocalStorage(products) {
    localStorage.setItem('productInventory', JSON.stringify(products));
}

// Eventlistener voor wijzigen van de categorie filter
document.getElementById("categoryFilter").addEventListener("change", () => {
    loadJSON((data) => {
        products = data;
        displayProducts();
    });
});

// Hoofdfunctionaliteit bij het laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
    products = JSON.parse(localStorage.getItem('productInventory'));
    if (!products) {
        loadJSON((data) => {
            products = data;
            saveToLocalStorage(products);
            displayProducts();
        });
    } else {
        displayProducts();
    }
});

// Functie om een nieuw product toe te voegen
function addNewProduct() {
    const newProductId = document.getElementById("newProductId").value;
    const newProductName = document.getElementById("newProductName").value;
    const newProductCategory = document.getElementById("newProductCategory").value;
    const newProductSize = document.getElementById("newProductSize").value;
    const newProductPrice = document.getElementById("newProductPrice").value;
    const newProductAmount = document.getElementById("newProductAmount").value;

    const newProduct = {
        "id": newProductId,
        "name": newProductName,
        "category": newProductCategory,
        "size": newProductSize,
        "price": parseFloat(newProductPrice),
        "amount": parseInt(newProductAmount)
    };

    // Voeg het nieuwe product toe aan de bestaande producten
    products.push(newProduct);
    saveToLocalStorage(products);

    // Leeg het formulier na toevoegen
    document.getElementById
}
