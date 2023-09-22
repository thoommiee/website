// Functie om de producten op de pagina weer te geven
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = '';

    const categoryFilter = document.getElementById("categoryFilter").value;

    products.forEach(product => {
        if (categoryFilter === 'All' || product.category === categoryFilter) {
            const productDiv = document.createElement("div");
            productDiv.className = "product";

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

            // Voeg een knop toe om het product aan de winkelwagen toe te voegen
            const addToCartButton = document.createElement("button");
            addToCartButton.className = "addToCartButton";
            addToCartButton.setAttribute("data-name", product.name);
            addToCartButton.setAttribute("data-category", product.category);
            addToCartButton.setAttribute("data-size", product.size);
            addToCartButton.setAttribute("data-price", product.price);
            addToCartButton.setAttribute("data-amount", product.amount);

            productDiv.appendChild(name);
            productDiv.appendChild(category);
            productDiv.appendChild(size);
            productDiv.appendChild(price);
            productDiv.appendChild(amount);
            productDiv.appendChild(addToCartButton);
            productList.appendChild(productDiv);
        }
    });
}

// Eventlistener voor het toevoegen van producten aan de winkelwagen
document.getElementById("productList").addEventListener("click", (e) => {
    if (e.target.classList.contains("addToCartButton")) {
        const product = {
            name: e.target.getAttribute("data-name"),
            category: e.target.getAttribute("data-category"),
            size: e.target.getAttribute("data-size"),
            price: parseFloat(e.target.getAttribute("data-price")),
        };
        shoppingCart.addToCart(product);

        // Controleer of productInventory bestaat in de lokale opslag
        if (localStorage.getItem('productInventory')) {
            const products = JSON.parse(localStorage.getItem('productInventory'));
            const productIndex = products.findIndex(p => p.name === product.name);

            if (productIndex !== -1 && products[productIndex].amount > 0) {
                products[productIndex].amount--;
                localStorage.setItem('productInventory', JSON.stringify(products));
            }
        } else {
            // Als productInventory niet bestaat in de lokale opslag, kun je hier passende code toevoegen, bijvoorbeeld:
            console.error("productInventory niet gevonden in de lokale opslag");
        }

        // Werk de beschikbaarheid van producten op de pagina bij
        updateProductAvailability();

        // Vernieuw de pagina
        location.reload();
    }
});

// Eventlistener voor wijzigen van de categorie filter
document.getElementById("categoryFilter").addEventListener("change", () => {
    const products = JSON.parse(localStorage.getItem('productInventory'));
    displayProducts(products);
    updateProductAvailability();
});

// Functie om de beschikbaarheid van producten op de pagina bij te werken
function updateProductAvailability() {
    const products = JSON.parse(localStorage.getItem('productInventory'));
    const buttons = document.querySelectorAll(".addToCartButton");

    buttons.forEach(button => {
        const productName = button.getAttribute("data-name");
        const product = products.find(product => product.name === productName);

        if (product && product.amount === 0) {
            button.textContent = "Uitverkocht";
            button.disabled = true;
            
            // Voeg CSS-styling toe aan de uitverkochte knop
            button.style.color = "red";
            button.style.backgroundColor = "transparent";
        } else {
            button.textContent = "Voeg toe aan winkelwagen";
            button.disabled = false;
            
            // Reset de CSS-styling voor knoppen die niet zijn uitverkocht
            button.style.color = ""; // Hiermee wordt de tekstkleur gereset naar de standaardwaarde
            button.style.backgroundColor = ""; // Hiermee wordt de achtergrondkleur gereset naar de standaardwaarde
        }
    });
}


// Hoofdfunctionaliteit bij het laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
    const products = JSON.parse(localStorage.getItem('productInventory'));
    if (products) {
        displayProducts(products);
        updateProductAvailability();
    }
});