
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}


// Classe Élément du panier

class ShoppingCartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    // Calcule le total d'un élément du panier
    getTotalPrice() {
        return this.product.price * this.quantity;
    }

    // Augmenter la quantité
    increaseQuantity() {
        this.quantity++;
    }

    // Diminuer la quantité (minimum 0)
    decreaseQuantity() {
        if (this.quantity > 0) {
            this.quantity--;
        }
    }
}


//Classe Panier d'achat

class ShoppingCart {
    constructor() {
        this.items = []; // Stocke les éléments du panier
    }

    // Ajouter un produit au panier
    addItem(product) {
        let item = this.items.find(i => i.product.id === product.id);
        if (item) {
            item.increaseQuantity();
        } else {
            this.items.push(new ShoppingCartItem(product));
        }
        this.updateDOM();
    }

    // Supprimer un produit du panier
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateDOM();
    }

    // Diminuer la quantité d'un produit
    decreaseQuantity(productId) {
        let item = this.items.find(i => i.product.id === productId);
        if (item) {
            item.decreaseQuantity();
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.updateDOM();
            }
        }
    }

    // Calculer le total du panier
    getTotal() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    //  Mettre à jour l'affichage du panier
    updateDOM() {
        document.querySelectorAll(".item").forEach(itemDiv => {
            let productId = parseInt(itemDiv.getAttribute("data-price"));
            let cartItem = this.items.find(item => item.product.price === productId);

            let quantitySpan = itemDiv.querySelector(".quantity");
            let totalSpan = itemDiv.querySelector(".item-total");

            if (cartItem) {
                quantitySpan.textContent = cartItem.quantity;
                totalSpan.textContent = cartItem.getTotalPrice();
            } else {
                quantitySpan.textContent = "0";
                totalSpan.textContent = "0";
            }
        });

        document.getElementById("total-price").textContent = this.getTotal();
    }
}


//Initialisation des objets et gestion des événements


//  Création des produits
const products = [
    new Product(1, "Paniers", 100),
    new Product(2, "Chaussettes", 20),
    new Product(3, "Sac", 50)
];

// Création du panier
const cart = new ShoppingCart();

// Ajout des événements sur les boutons
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".item").forEach((itemDiv, index) => {
        let plusBtn = itemDiv.querySelector(".plus");
        let minusBtn = itemDiv.querySelector(".minus");
        let deleteBtn = itemDiv.querySelector(".delete");
        let favoriteBtn = itemDiv.querySelector(".favorite");

        let product = products[index]; // Associer le bon produit en fonction de l'index

        // Ajouter au panier
        plusBtn.addEventListener("click", () => {
            cart.addItem(product);
        });

        // Diminuer la quantité
        minusBtn.addEventListener("click", () => {
            cart.decreaseQuantity(product.id);
        });

        // Supprimer du panier
        deleteBtn.addEventListener("click", () => {
            cart.removeItem(product.id);
        });

        // Toggle favori
        favoriteBtn.addEventListener("click", () => {
            favoriteBtn.classList.toggle("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function() {
            let itemDiv = this.parentElement.parentElement; // Sélection de l'article
            let itemTotalElement = itemDiv.querySelector(".item-total"); // Total de l'article
            let totalPriceElement = document.getElementById("total-price"); // Prix total du panier

            let itemTotal = parseFloat(itemTotalElement.textContent); // Convertir en nombre
            let totalPrice = parseFloat(totalPriceElement.textContent); // Convertir en nombre

            // Mettre à jour le prix total du panier
            totalPrice -= itemTotal;
            totalPriceElement.textContent = totalPrice.toFixed(2); // Mise à jour avec 2 décimales

            // Supprimer l'article du DOM
            itemDiv.remove();
        });
    });
});