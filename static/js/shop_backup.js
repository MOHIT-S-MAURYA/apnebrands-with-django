document.addEventListener('DOMContentLoaded', function() {
    console.log('Shop JS loaded');
    
    // Shop functionality elements
    const productsGrid = document.getElementById('products-grid');
    const sortSelect = document.getElementById('sort-select');
    const viewButtons = document.querySelectorAll('.view-btn');
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.filter-option input[type="radio"]');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    
    console.log('Elements found:', {
        productsGrid: !!productsGrid,
        sortSelect: !!sortSelect,
        viewButtons: viewButtons.length,
        filterCheckboxes: filterCheckboxes.length
    });
    
    let currentProducts = Array.from(document.querySelectorAll('.product-card'));
    let filteredProducts = [...currentProducts];

    console.log('Found', currentProducts.length, 'products');

    // Initialize shop
    initializeShop();

    function initializeShop() {
        console.log('Initializing shop...');
        
        // Set up event listeners
        setupEventListeners();
        
        // Ensure grid layout is applied
        if (productsGrid) {
            productsGrid.classList.remove('list-view');
            productsGrid.classList.add('grid-view');
            console.log('Grid initialized with classes:', productsGrid.className);
        }
        
        // Update product count
        updateResultsCount();
        
        console.log('Shop initialization complete');
    }

    function setupEventListeners() {
        // Sorting
        if (sortSelect) {
            sortSelect.addEventListener('change', handleSort);
        }

        // View toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', handleViewToggle);
        });

        // Filters
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleFilter);
        });

        filterRadios.forEach(radio => {
            radio.addEventListener('change', handleFilter);
        });

        // Clear filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }

        // Setup product event listeners
        setupProductEventListeners();
    }

    function handleSort() {
        const sortValue = sortSelect.value;
        console.log('Sorting by:', sortValue);
        
        let sortedProducts = [...filteredProducts];

        switch (sortValue) {
            case 'price-low':
                sortedProducts.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('₹', '').replace(',', ''));
                    const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('₹', '').replace(',', ''));
                    return priceA - priceB;
                });
                console.log('Sorted by price low to high');
                break;

            case 'price-high':
                sortedProducts.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('₹', '').replace(',', ''));
                    const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('₹', '').replace(',', ''));
                    return priceB - priceA;
                });
                console.log('Sorted by price high to low');
                break;

            case 'newest':
                sortedProducts.sort((a, b) => {
                    const idA = parseInt(a.dataset.productId);
                    const idB = parseInt(b.dataset.productId);
                    return idB - idA; // Higher ID = newer
                });
                console.log('Sorted by newest');
                break;

            case 'rating':
                sortedProducts.sort((a, b) => {
                    const starsA = a.querySelectorAll('.fas.fa-star').length;
                    const starsB = b.querySelectorAll('.fas.fa-star').length;
                    return starsB - starsA;
                });
                console.log('Sorted by rating');
                break;

            case 'popularity':
            default:
                console.log('Using default/popularity order');
                // Keep original order
                break;
        }

        console.log('Rendering', sortedProducts.length, 'sorted products');
        renderProducts(sortedProducts);
    }

    function handleViewToggle(e) {
        const viewType = e.currentTarget.dataset.view;
        console.log('Switching to view:', viewType);
        
        // Update active button
        viewButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Update grid class
        productsGrid.classList.remove('grid-view', 'list-view');
        
        if (viewType === 'list') {
            productsGrid.classList.add('list-view');
        } else {
            productsGrid.classList.add('grid-view');
        }
        
        console.log('Grid classes after toggle:', productsGrid.className);
    }

    function handleFilter() {
        console.log('Applying filters...');
        
        // Get all active filters
        const activeFilters = {
            categories: [],
            priceRanges: [],
            rating: null
        };

        // Collect category filters
        document.querySelectorAll('.filter-group[data-filter-type="category"] input:checked').forEach(input => {
            activeFilters.categories.push(input.value);
        });

        // Collect price filters
        document.querySelectorAll('.filter-group[data-filter-type="price"] input:checked').forEach(input => {
            activeFilters.priceRanges.push(input.value);
        });

        // Collect rating filter
        const ratingFilter = document.querySelector('.filter-group[data-filter-type="rating"] input:checked');
        if (ratingFilter) {
            activeFilters.rating = parseInt(ratingFilter.value);
        }

        console.log('Active filters:', activeFilters);

        // Filter products
        filteredProducts = currentProducts.filter(product => {
            return matchesFilters(product, activeFilters);
        });

        console.log('Filtered to', filteredProducts.length, 'products');
        renderProducts(filteredProducts);
        updateResultsCount();
    }

    function matchesFilters(product, filters) {
        // Category filter
        if (filters.categories.length > 0) {
            const productCategory = product.querySelector('.product-brand').textContent.toLowerCase();
            const matchesCategory = filters.categories.some(cat => 
                productCategory.includes(cat.toLowerCase())
            );
            if (!matchesCategory) return false;
        }

        // Price filter
        if (filters.priceRanges.length > 0) {
            const price = parseFloat(product.querySelector('.current-price').textContent.replace('₹', '').replace(',', ''));
            const matchesPrice = filters.priceRanges.some(range => {
                if (range === '0-500') return price < 500;
                if (range === '500-1000') return price >= 500 && price < 1000;
                if (range === '1000-2000') return price >= 1000 && price < 2000;
                if (range === '2000+') return price >= 2000;
                return false;
            });
            if (!matchesPrice) return false;
        }

        // Rating filter
        if (filters.rating) {
            const stars = product.querySelectorAll('.fas.fa-star').length;
            if (stars < filters.rating) return false;
        }

        return true;
    }

    function renderProducts(products) {
        console.log('Rendering', products.length, 'products');
        
        // Clear current products (but keep the debug message)
        const debugMessage = productsGrid.querySelector('p[style*="background: yellow"]');
        productsGrid.innerHTML = '';
        
        // Re-add debug message if it existed
        if (debugMessage) {
            productsGrid.appendChild(debugMessage);
        }

        if (products.length === 0) {
            const noProductsDiv = document.createElement('div');
            noProductsDiv.className = 'no-products-message';
            noProductsDiv.innerHTML = `
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            `;
            productsGrid.appendChild(noProductsDiv);
            return;
        }

        // Add products back to DOM
        products.forEach(product => {
            productsGrid.appendChild(product);
        });

        // Re-setup event listeners for product buttons
        setupProductEventListeners();
        
        console.log('Products rendered successfully');
    }

    function setupProductEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            // Remove existing listeners to avoid duplicates
            btn.removeEventListener('click', handleAddToCart);
            btn.addEventListener('click', handleAddToCart);
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.removeEventListener('click', handleWishlist);
            btn.addEventListener('click', handleWishlist);
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.removeEventListener('click', handleQuickView);
            btn.addEventListener('click', handleQuickView);
        });
    }

    function clearAllFilters() {
        console.log('Clearing all filters');
        
        // Clear all checkboxes and radio buttons
        filterCheckboxes.forEach(checkbox => checkbox.checked = false);
        filterRadios.forEach(radio => radio.checked = false);

        // Reset filtered products
        filteredProducts = [...currentProducts];
        renderProducts(filteredProducts);
        updateResultsCount();
    }

    function updateResultsCount() {
        const resultsInfo = document.querySelector('.results-info span');
        if (resultsInfo) {
            const count = filteredProducts.length;
            resultsInfo.innerHTML = `Showing <strong>${count}</strong> product${count !== 1 ? 's' : ''}`;
        }
    }

    function handleAddToCart(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const productId = btn.dataset.productId;
        const productName = btn.dataset.productName;
        
        console.log('Adding to cart:', productName);
        
        // Disable button temporarily
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            
            // Show notification
            showNotification(`${productName} added to cart!`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        }, 800);
    }

    function handleWishlist(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.color = '#ef4444';
            showNotification('Added to wishlist!', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.color = '';
            showNotification('Removed from wishlist!', 'info');
        }
    }

    function handleQuickView(e) {
        e.preventDefault();
        const productId = e.currentTarget.dataset.productId;
        console.log('Quick view for product:', productId);
        showNotification('Quick view feature coming soon!', 'info');
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div>
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Setup close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Test sorting after initialization
    setTimeout(() => {
        if (sortSelect && sortSelect.value) {
            console.log('Initial sort test with value:', sortSelect.value);
            handleSort();
        }
    }, 500);
});
