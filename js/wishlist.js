document.addEventListener('DOMContentLoaded', function () {
    const wishlistCountSpan = document.getElementById('wishlist-count');
    const wishlistItemsDiv = document.getElementById('wishlist-items');

    // Function to update the wishlist count and save to localStorage
    function updateWishlistCount(count) {
        localStorage.setItem('wishlistCount', count);
        wishlistCountSpan.textContent = count;
    }

    // Function to load the wishlist count from localStorage
    function loadWishlistCount() {
        let count = parseInt(localStorage.getItem('wishlistCount')) || 0;
        wishlistCountSpan.textContent = count;
        return count;
    }

    // Function to add a product to the wishlist
    function addProductToWishlist(product) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!wishlist.some(item => item.name === product.name)) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount(wishlist.length);
            displayWishlist();
        }
    }

    // Function to display the wishlist in the modal
    function displayWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlistItemsDiv.innerHTML = '';
        wishlist.forEach((item, index) => {
            const productItem = document.createElement('div');
            productItem.classList.add('wishlist-item', 'd-flex', 'align-items-center', 'mb-3');
            productItem.innerHTML = `
                <div class="mr-3">
                    <img src="${item.image}" class="img-fluid" style="height: 100px; width: 100px;" alt="${item.name}">
                </div>
                <div>
                    <h5>${item.name}</h5>
                    <p>$${item.price}</p>
                </div>
                <button class="btn btn-outline-danger ml-auto remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            wishlistItemsDiv.appendChild(productItem);
        });

        // Add event listeners to the remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                removeProductFromWishlist(index);
            });
        });
    }

    // Function to remove a product from the wishlist
    function removeProductFromWishlist(index) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount(wishlist.length);
        displayWishlist();
    }

    // Load the wishlist count and display the wishlist on page load
    loadWishlistCount();
    displayWishlist();

    // Add event listeners to all product heart buttons
    document.querySelectorAll('.product-heart-btn').forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action of the link

            const product = {
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.getAttribute('data-image')
            };

            addProductToWishlist(product);
        });
    });
});