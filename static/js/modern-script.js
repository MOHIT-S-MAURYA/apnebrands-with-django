// Modern ApneBrands JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `/shop/?search=${encodeURIComponent(query)}`;
        }
    }

    // Alert close functionality
    document.querySelectorAll('.alert-close').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                this.parentElement.remove();
            }, 300);
        });
    });

    // Auto-hide alerts after 5 seconds
    document.querySelectorAll('.alert').forEach(alert => {
        setTimeout(() => {
            if (alert.parentElement) {
                alert.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        }, 5000);
    });

    // Product card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .feature-card').forEach(card => {
        observer.observe(card);
    });

    // Wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.dataset.productId;
            const icon = this.querySelector('i');
            
            // Toggle heart icon
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
            }
            
            // Here you would typically make an AJAX call to update wishlist
            console.log('Wishlist toggled for product:', productId);
        });
    });

    // Quick view functionality
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.dataset.productId;
            console.log('Quick view for product:', productId);
            // Implement quick view modal here
        });
    });

    // Quantity controls for cart
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            const isIncrement = this.classList.contains('increment');
            
            if (isIncrement) {
                input.value = currentValue + 1;
            } else if (currentValue > 1) {
                input.value = currentValue - 1;
            }
            
            // Update cart totals
            updateCartTotals();
        });
    });

    // Shop page functionality
    initShopFeatures();

    function initShopFeatures() {
        // Filter functionality
        const clearFiltersBtn = document.querySelector('.clear-filters-btn');
        const categoryFilters = document.querySelectorAll('input[type="checkbox"][id^="category-"]');
        const priceFilters = document.querySelectorAll('input[type="checkbox"][id^="price-"]');
        const ratingFilters = document.querySelectorAll('input[type="radio"][name="rating"]');
        const sortSelect = document.getElementById('sort-select');
        const viewToggleBtns = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('products-grid');

        // Clear all filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Reset all checkboxes and radio buttons
                categoryFilters.forEach(cb => cb.checked = false);
                priceFilters.forEach(cb => cb.checked = false);
                ratingFilters.forEach(rb => rb.checked = false);
                
                // Reset sort dropdown
                if (sortSelect) sortSelect.value = 'popularity';
                
                // Apply filters
                applyFilters();
            });
        }

        // Category filter change
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Price filter change
        priceFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Rating filter change
        ratingFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Sort change
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFilters);
        }

        // View toggle
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all buttons
                viewToggleBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');
                
                // Toggle grid view
                const view = this.dataset.view;
                if (productsGrid) {
                    if (view === 'list') {
                        productsGrid.classList.add('list-view');
                    } else {
                        productsGrid.classList.remove('list-view');
                    }
                }
            });
        });

        // Add to cart functionality
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const productName = this.dataset.productName;
                addToCart(productId, productName);
            });
        });

        // Wishlist functionality
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                toggleWishlist(productId, this);
            });
        });

        // Quick view functionality
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                openQuickView(productId);
            });
        });

        function applyFilters() {
            // Get all selected filters
            const selectedCategories = Array.from(categoryFilters)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
                
            const selectedPrices = Array.from(priceFilters)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
                
            const selectedRating = Array.from(ratingFilters)
                .find(rb => rb.checked)?.value;
                
            const sortValue = sortSelect?.value || 'popularity';

            // Build URL with filters
            const url = new URL(window.location.href);
            url.searchParams.delete('category');
            url.searchParams.delete('price');
            url.searchParams.delete('rating');
            url.searchParams.delete('sort');

            if (selectedCategories.length > 0) {
                url.searchParams.set('category', selectedCategories.join(','));
            }
            if (selectedPrices.length > 0) {
                url.searchParams.set('price', selectedPrices.join(','));
            }
            if (selectedRating) {
                url.searchParams.set('rating', selectedRating);
            }
            if (sortValue !== 'popularity') {
                url.searchParams.set('sort', sortValue);
            }

            // Reload page with new filters
            window.location.href = url.toString();
        }

        function addToCart(productId, productName) {
            // Show loading state
            const btn = document.querySelector(`[data-product-id="${productId}"].add-to-cart`);
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            btn.disabled = true;

            // Simulate API call (replace with actual cart API)
            setTimeout(() => {
                // Reset button
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                // Show success message
                showNotification(`${productName} added to cart!`, 'success');
                
                // Update cart count if exists
                updateCartCount();
            }, 1000);
        }

        function toggleWishlist(productId, btn) {
            const isActive = btn.classList.contains('active');
            const icon = btn.querySelector('i');
            
            if (isActive) {
                btn.classList.remove('active');
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Removed from wishlist', 'info');
            } else {
                btn.classList.add('active');
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Added to wishlist', 'success');
            }
        }

        function openQuickView(productId) {
            // Redirect to product detail page for now
            window.location.href = `/product/${productId}/`;
        }

        function updateCartCount() {
            // Update cart counter in header if exists
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                count++;
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'block' : 'none';
            }
        }
    }

    // Signup page functionality
    initSignupFeatures();

    function initSignupFeatures() {
        const signupForm = document.getElementById('signup-form');
        const usernameField = document.getElementById('username');
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirm-password');

        if (!signupForm) return;

        // Real-time username validation
        let usernameTimeout;
        if (usernameField) {
            usernameField.addEventListener('input', function() {
                clearTimeout(usernameTimeout);
                usernameTimeout = setTimeout(() => {
                    checkUsernameAvailability(this.value);
                }, 500);
            });
        }

        // Real-time email validation
        let emailTimeout;
        if (emailField) {
            emailField.addEventListener('input', function() {
                clearTimeout(emailTimeout);
                emailTimeout = setTimeout(() => {
                    checkEmailAvailability(this.value);
                }, 500);
            });
        }

        // Password strength validation
        if (passwordField) {
            passwordField.addEventListener('input', function() {
                validatePasswordStrength(this.value);
            });
        }

        // Confirm password validation
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('input', function() {
                validatePasswordMatch(passwordField.value, this.value);
            });
        }

        // Form submission
        signupForm.addEventListener('submit', function(e) {
            if (!validateSignupForm()) {
                e.preventDefault();
                showNotification('Please fix the errors in the form', 'error');
            }
        });

        function checkUsernameAvailability(username) {
            if (username.length < 3) {
                showFieldError('username', 'Username must be at least 3 characters');
                return;
            }

            // Make AJAX request to check username
            fetch('/check-username/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({username: username})
            })
            .then(response => response.json())
            .then(data => {
                if (data.available) {
                    showFieldSuccess('username', 'Username is available!');
                } else {
                    showFieldError('username', 'Username is already taken');
                }
            })
            .catch(() => {
                clearFieldMessage('username');
            });
        }

        function checkEmailAvailability(email) {
            if (!isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
                return;
            }

            // Make AJAX request to check email
            fetch('/check-email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({email: email})
            })
            .then(response => response.json())
            .then(data => {
                if (data.available) {
                    showFieldSuccess('email', 'Email is available!');
                } else {
                    showFieldError('email', 'Email is already registered');
                }
            })
            .catch(() => {
                clearFieldMessage('email');
            });
        }

        function validatePasswordStrength(password) {
            const minLength = 8;
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            let strength = 0;
            let message = '';

            if (password.length >= minLength) strength++;
            if (hasUpper) strength++;
            if (hasLower) strength++;
            if (hasNumber) strength++;
            if (hasSpecial) strength++;

            if (password.length < minLength) {
                message = 'Password must be at least 8 characters';
                showFieldError('password', message);
            } else if (strength < 3) {
                message = 'Password is too weak';
                showFieldError('password', message);
            } else if (strength < 4) {
                message = 'Password strength: Medium';
                showFieldWarning('password', message);
            } else {
                message = 'Password strength: Strong';
                showFieldSuccess('password', message);
            }
        }

        function validatePasswordMatch(password, confirmPassword) {
            if (confirmPassword === '') {
                clearFieldMessage('confirm-password');
                return;
            }

            if (password === confirmPassword) {
                showFieldSuccess('confirm-password', 'Passwords match!');
            } else {
                showFieldError('confirm-password', 'Passwords do not match');
            }
        }

        function validateSignupForm() {
            let isValid = true;

            // Check all required fields
            const requiredFields = ['first-name', 'last-name', 'username', 'email', 'password', 'confirm-password'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    showFieldError(fieldId, 'This field is required');
                    isValid = false;
                }
            });

            // Check password match
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            if (password !== confirmPassword) {
                showFieldError('confirm-password', 'Passwords do not match');
                isValid = false;
            }

            return isValid;
        }

        function showFieldError(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const successElement = document.getElementById(`${fieldId}-success`);
            const field = document.getElementById(fieldId);

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
            if (successElement) {
                successElement.style.display = 'none';
            }
            if (field) {
                field.classList.add('error');
                field.classList.remove('success');
            }
        }

        function showFieldSuccess(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const successElement = document.getElementById(`${fieldId}-success`);
            const field = document.getElementById(fieldId);

            if (successElement) {
                successElement.textContent = message;
                successElement.style.display = 'block';
            }
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            if (field) {
                field.classList.add('success');
                field.classList.remove('error');
            }
        }

        function showFieldWarning(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                errorElement.style.color = '#f59e0b'; // warning color
            }
        }

        function clearFieldMessage(fieldId) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const successElement = document.getElementById(`${fieldId}-success`);
            const field = document.getElementById(fieldId);

            if (errorElement) errorElement.style.display = 'none';
            if (successElement) successElement.style.display = 'none';
            if (field) {
                field.classList.remove('error', 'success');
            }
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function getCsrfToken() {
            return document.querySelector('[name=csrfmiddlewaretoken]').value;
        }
    }

    // Login page functionality
    initLoginFeatures();

    function initLoginFeatures() {
        const loginForm = document.getElementById('loginForm');
        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.querySelector('input[type="password"]');
        const rememberCheckbox = document.getElementById('remember');

        if (!loginForm) return;

        // Password visibility toggle
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', function() {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                }
            });
        }

        // Form validation
        loginForm.addEventListener('submit', function(e) {
            if (!validateLoginForm()) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'error');
            }
        });

        // Remember me functionality
        if (rememberCheckbox) {
            // Load saved credentials if available
            loadSavedCredentials();
            
            rememberCheckbox.addEventListener('change', function() {
                if (!this.checked) {
                    clearSavedCredentials();
                }
            });
        }

        function validateLoginForm() {
            let isValid = true;
            const usernameField = loginForm.querySelector('input[name="username"]');
            const passwordField = loginForm.querySelector('input[name="password"]');

            // Clear previous errors
            clearFormErrors();

            if (!usernameField.value.trim()) {
                showFieldError(usernameField, 'Username is required');
                isValid = false;
            }

            if (!passwordField.value.trim()) {
                showFieldError(passwordField, 'Password is required');
                isValid = false;
            }

            return isValid;
        }

        function showFieldError(field, message) {
            field.classList.add('error');
            
            // Create or update error message
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 14px;
                    margin-top: 4px;
                `;
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }

        function clearFormErrors() {
            const errorFields = loginForm.querySelectorAll('.error');
            const errorMessages = loginForm.querySelectorAll('.field-error');
            
            errorFields.forEach(field => field.classList.remove('error'));
            errorMessages.forEach(msg => msg.remove());
        }

        function loadSavedCredentials() {
            if (localStorage.getItem('rememberMe') === 'true') {
                const savedUsername = localStorage.getItem('savedUsername');
                if (savedUsername) {
                    const usernameField = loginForm.querySelector('input[name="username"]');
                    if (usernameField) {
                        usernameField.value = savedUsername;
                        rememberCheckbox.checked = true;
                    }
                }
            }
        }

        function clearSavedCredentials() {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedUsername');
        }

        // Save credentials on successful login
        loginForm.addEventListener('submit', function() {
            if (rememberCheckbox && rememberCheckbox.checked) {
                const usernameField = loginForm.querySelector('input[name="username"]');
                if (usernameField && usernameField.value) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedUsername', usernameField.value);
                }
            }
        });
    }

    // Contact page functionality
    initContactFeatures();

    function initContactFeatures() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        // Form validation and submission
        contactForm.addEventListener('submit', function(e) {
            if (!validateContactForm()) {
                e.preventDefault();
                showNotification('Please fix the errors in the form', 'error');
            } else {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;
                    
                    // Re-enable after form submission
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            }
        });

        // Character counter for message field
        const messageField = contactForm.querySelector('textarea[name="message"]');
        if (messageField) {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                text-align: right;
                color: var(--text-light);
                font-size: 12px;
                margin-top: 4px;
            `;
            messageField.parentNode.appendChild(counter);

            messageField.addEventListener('input', function() {
                const remaining = maxLength - this.value.length;
                counter.textContent = `${remaining} characters remaining`;
                counter.style.color = remaining < 50 ? '#ef4444' : 'var(--text-light)';
            });

            // Initialize counter
            messageField.dispatchEvent(new Event('input'));
        }

        function validateContactForm() {
            let isValid = true;
            const requiredFields = ['name', 'email', 'subject', 'message'];

            // Clear previous errors
            clearContactFormErrors();

            requiredFields.forEach(fieldName => {
                const field = contactForm.querySelector(`[name="${fieldName}"]`);
                if (!field.value.trim()) {
                    showContactFieldError(field, 'This field is required');
                    isValid = false;
                }
            });

            // Email validation
            const emailField = contactForm.querySelector('[name="email"]');
            if (emailField.value && !isValidEmail(emailField.value)) {
                showContactFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }

            return isValid;
        }

        function showContactFieldError(field, message) {
            field.classList.add('error');
            
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 14px;
                    margin-top: 4px;
                `;
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }

        function clearContactFormErrors() {
            const errorFields = contactForm.querySelectorAll('.error');
            const errorMessages = contactForm.querySelectorAll('.field-error');
            
            errorFields.forEach(field => field.classList.remove('error'));
            errorMessages.forEach(msg => msg.remove());
        }
    }

    // Product detail page functionality
    initProductDetailFeatures();

    function initProductDetailFeatures() {
        const quantityInput = document.getElementById('quantity');
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const wishlistBtn = document.querySelector('.wishlist-btn');
        const productGallery = document.querySelectorAll('.product-gallery img');
        const mainImage = document.querySelector('.main-product-image');
        const sizeOptions = document.querySelectorAll('.size-option');
        const colorOptions = document.querySelectorAll('.color-option');

        // Quantity controls
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                const currentValue = parseInt(quantityInput.value) || 1;
                
                if (action === 'increase') {
                    quantityInput.value = currentValue + 1;
                } else if (action === 'decrease' && currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        });

        // Add to cart
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const quantity = quantityInput ? quantityInput.value : 1;
                const selectedSize = document.querySelector('.size-option.selected')?.dataset.size;
                const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
                
                addToCartWithOptions(productId, quantity, selectedSize, selectedColor);
            });
        }

        // Wishlist toggle
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                toggleWishlist(productId, this);
            });
        }

        // Product gallery
        productGallery.forEach(img => {
            img.addEventListener('click', function() {
                if (mainImage) {
                    mainImage.src = this.src;
                    mainImage.alt = this.alt;
                }
                
                // Update active thumbnail
                productGallery.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Size selection
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Color selection
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Product tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });

        function addToCartWithOptions(productId, quantity, size, color) {
            const btn = addToCartBtn;
            const originalText = btn.innerHTML;
            
            // Show loading
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                showNotification(`Product added to cart! (Qty: ${quantity})`, 'success');
                updateCartCount();
            }, 1000);
        }

        // Image zoom functionality
        if (mainImage) {
            let isZoomed = false;
            
            mainImage.addEventListener('click', function() {
                if (!isZoomed) {
                    this.style.transform = 'scale(2)';
                    this.style.cursor = 'zoom-out';
                    isZoomed = true;
                } else {
                    this.style.transform = 'scale(1)';
                    this.style.cursor = 'zoom-in';
                    isZoomed = false;
                }
            });
        }
    }

    // General page functionality
    initGeneralFeatures();

    function initGeneralFeatures() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Animation on scroll
        const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        animateOnScroll.forEach(el => scrollObserver.observe(el));

        // Back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-md);
        `;

        document.body.appendChild(backToTopBtn);

        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Tooltip functionality
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
        });

        function showTooltip(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;

            document.body.appendChild(tooltip);

            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

            setTimeout(() => tooltip.style.opacity = '1', 10);
            e.target._tooltip = tooltip;
        }

        function hideTooltip(e) {
            if (e.target._tooltip) {
                e.target._tooltip.remove();
                delete e.target._tooltip;
            }
        }

        // Loading states for buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-loading')) {
                const btn = e.target;
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            }
        });

        // Copy to clipboard functionality
        const copyBtns = document.querySelectorAll('[data-copy]');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const textToCopy = this.dataset.copy;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showNotification('Copied to clipboard!', 'success');
                });
            });
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // Additional CSS for loading and animations
const additionalStyles = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: white;
            box-shadow: var(--shadow-lg);
            padding: 20px;
            gap: 16px;
        }
    }

    .wishlist-btn.active {
        color: var(--primary-color);
    }

    .filter-option input.error,
    input.error,
    textarea.error,
    select.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    img.lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }

    img.lazy.loaded {
        opacity: 1;
    }

    .product-thumbnail {
        cursor: pointer;
        opacity: 0.7;
        transition: var(--transition-normal);
        border: 2px solid transparent;
    }

    .product-thumbnail:hover,
    .product-thumbnail.active {
        opacity: 1;
        border-color: var(--primary-color);
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 300px;
        width: 100%;
        background-color: #fff;
        border: 1px solid transparent;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.5s ease-out, fadeOut 0.5s 2.5s forwards;
    }

    .notification-success {
        border-color: #4caf50;
    }

    .notification-error {
        border-color: #f44336;
    }

    .notification-warning {
        border-color: #ff9800;
    }

    .notification-info {
        border-color: #2196f3;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

}); // End of DOMContentLoaded
