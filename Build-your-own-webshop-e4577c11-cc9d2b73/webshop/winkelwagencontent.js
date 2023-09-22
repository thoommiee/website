class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.updateCartCount();
        this.loadOrderNumber(); // Laad het laatst gebruikte ordernummer
    }

    // Voeg een product toe aan de winkelwagen
    addToCart(product) {
        this.items.push(product);
        this.saveCart();
        this.updateCartCount();
    }

    // Winkelwagen legen
    emptyCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        refreshPage();
    }

    // Bestelling verwerken
    checkout() {
        if (this.items.length > 0) {
            const orderNumber = this.orderNumber; // Gebruik het huidige ordernummer
            const totalPrice = this.calculateTotalPrice();
            const order = {
                orderNumber,
                totalPrice,
                dateTime: new Date().toLocaleString()
            };

            this.saveOrder(order);
            this.incrementOrderNumber(); // Verhoog het ordernummer voor de volgende bestelling
            alert("Bestelling geplaatst!");
            this.emptyCart();
            refreshPage();
        } else {
            alert("Winkelwagen is leeg. Voeg producten toe om een bestelling te plaatsen!");
        }
    }

    // Functie om het laatst gebruikte ordernummer op te halen
    loadOrderNumber() {
        this.orderNumber = parseInt(localStorage.getItem('nextOrderNumber')) || 1000;
    }

    // Functie om het ordernummer te verhogen
    incrementOrderNumber() {
        this.orderNumber++;
        localStorage.setItem('nextOrderNumber', this.orderNumber.toString());
    }

    // Voeg een product terug toe aan productInventory
    addToInventory(product) {
        const products = JSON.parse(localStorage.getItem('productInventory'));
        const productIndex = products.findIndex(p => p.name === product.name);

        if (productIndex !== -1) {
            products[productIndex].amount++;
            localStorage.setItem('productInventory', JSON.stringify(products));
        }
    }

    // Lokale opslag bijwerken met winkelwageninhoud
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Winkelwagenteller bijwerken
    updateCartCount() {
        const cartCount = document.getElementById("cartCount");
        cartCount.textContent = this.items.length;
    }

    // Winkelwagen laden vanuit lokale opslag
    loadCart() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            this.items = JSON.parse(cartData);
        }
    }

    // Functie om een bestelling op te slaan in de lokale opslag
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Bereken de totaalprijs van de winkelwagen
    calculateTotalPrice() {
        return this.items.reduce((total, product) => total + product.price, 0);
    }
}

// Functie om de pagina te herladen
function refreshPage() {
    window.location.reload();
}

const shoppingCart = new ShoppingCart();

// Eventlistener voor het legen van de winkelwagen
document.getElementById("emptyCart").addEventListener("click", () => {
    shoppingCart.items.forEach(product => {
        shoppingCart.addToInventory(product); // Voeg elk product in de winkelwagen terug toe aan productInventory
    });
    shoppingCart.emptyCart();
});

// Eventlistener voor het bestellen
document.getElementById("checkout").addEventListener("click", () => {
    shoppingCart.checkout();
});

// Functie om de winkelwageninhoud weer te geven in de opgegeven div
function displayCartContents() {
    const cartContentsDiv = document.getElementById("cartContents");
    cartContentsDiv.innerHTML = '';

    if (shoppingCart.items.length === 0) {
        cartContentsDiv.textContent = "Winkelwagen is leeg.";
        return;
    }

    // Bouw een lijst met de producten in de winkelwagen
    const cartList = document.createElement("ul");
    let totalPrice = 0; // Deze waarde houdt de totaalprijs bij

    shoppingCart.items.forEach((product, index) => {
        const cartItem = document.createElement("li");
        cartItem.className = "cart-item";
        cartItem.textContent = `${product.name} - Prijs: €${product.price}`;
        totalPrice += product.price; // Voeg de prijs van het product toe aan de totaalprijs

        // Voeg een knop toe om het product uit de winkelwagen te verwijderen
        const removeButton = document.createElement("button");
        removeButton.className = "removeFromCart";
        removeButton.textContent = "Verwijder";
        removeButton.addEventListener("click", () => {
            shoppingCart.items.splice(index, 1); // Verwijder het product uit de winkelwagen
            shoppingCart.saveCart(); // Sla de gewijzigde winkelwagen op
            shoppingCart.addToInventory(product); // Voeg het verwijderde product terug toe aan productInventory
            displayCartContents(); // Vernieuw de weergave van de winkelwageninhoud
        });

        cartItem.appendChild(removeButton);
        cartList.appendChild(cartItem);
    });

    // Voeg een rij toe voor de totaalprijs
    const totalRow = document.createElement("li");
    totalRow.textContent = `Totaalprijs: €${totalPrice.toFixed(2)}`; // Toon de totaalprijs van de winkelwagen met twee decimalen
    totalRow.classList.add("totalRow");
    cartList.appendChild(totalRow);

    cartContentsDiv.appendChild(cartList);
}

// Roep de functie aan om de winkelwageninhoud weer te geven bij het laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
    displayCartContents();
});
