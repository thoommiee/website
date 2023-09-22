// Functie om alle bestellingen uit de lokale opslag te verwijderen
function clearOrders() {
    localStorage.removeItem('orders');
    displayOrderList(); // Vernieuw de weergave van de bestellingen
}

// Functie om de bestellingen weer te geven in de opgegeven div
function displayOrderList() {
    const orderListDiv = document.getElementById("orderList");
    orderListDiv.innerHTML = '';

    // Haal de opgeslagen bestellingen op uit de lokale opslag
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        orderListDiv.textContent = "Er zijn nog geen bestellingen gedaan.";
        return;
    }

    // Bouw een tabel om de bestellingen weer te geven
    const orderTable = document.createElement("table");
    orderTable.className = "order-table";

    // Voeg een rij toe voor de tabelkoppen
    const tableHead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Ordernummer", "Prijs", "Datum & Tijd"];

    headers.forEach(headerText => {
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    tableHead.appendChild(headerRow);
    orderTable.appendChild(tableHead);

    // Voeg rijen toe voor elke bestelling
    const tableBody = document.createElement("tbody");

    orders.forEach(order => {
        const orderRow = document.createElement("tr");

        // Voeg cel toe voor ordernummer
        const orderNumberCell = document.createElement("td");
        orderNumberCell.textContent = order.orderNumber;
        orderRow.appendChild(orderNumberCell);

        // Voeg cel toe voor prijs
        const priceCell = document.createElement("td");
        priceCell.textContent = `€${order.totalPrice.toFixed(2)}`;
        orderRow.appendChild(priceCell);

        // Voeg cel toe voor datum & tijd
        const dateTimeCell = document.createElement("td");
        dateTimeCell.textContent = order.dateTime;
        orderRow.appendChild(dateTimeCell);

        tableBody.appendChild(orderRow);
    });

    orderTable.appendChild(tableBody);
    orderListDiv.appendChild(orderTable);

    // Voeg een knop toe om bestellingen te verwijderen
    const clearButton = document.createElement("button");
    clearButton.className = "removeOrder";
    clearButton.textContent = "Verwijder Bestellingen";
    clearButton.addEventListener("click", clearOrders);
    orderListDiv.appendChild(clearButton);
}

// Roep de functie aan om de bestellingen weer te geven bij het laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
    displayOrderList();
});
