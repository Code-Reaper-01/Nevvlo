// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');
const wishlistBtn = document.getElementById('wishlist-btn');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistCount = document.getElementById('wishlist-count');
const wishlistItems = document.getElementById('wishlist-items');
const wishlistEmpty = document.getElementById('wishlist-empty');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchSuggestions = document.getElementById('search-suggestions');
const countdown = document.getElementById('countdown');
const quickViewModal = document.getElementById('quick-view-modal');
const closeQuickViewModal = document.getElementById('close-quick-view-modal');
const modalProductContent = document.getElementById('modal-product-content');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
const icon = themeToggle.querySelector('i');
icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

// Wishlist Toggle
wishlistBtn.addEventListener('click', () => {
    wishlistSidebar.classList.add('active');
    updateWishlistDisplay();
});

closeWishlist.addEventListener('click', () => {
    wishlistSidebar.classList.remove('active');
});

// Initialize wishlist from localStorage
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Update wishlist count
function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

// Update wishlist display in sidebar
function updateWishlistDisplay() {
    if (wishlist.length === 0) {
        wishlistItems.style.display = 'none';
        wishlistEmpty.style.display = 'flex';
    } else {
        wishlistItems.style.display = 'block';
        wishlistEmpty.style.display = 'none';
        
        // Clear current items
        wishlistItems.innerHTML = '';
        
        // Add each item to the sidebar
        wishlist.forEach((productId, index) => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const item = document.createElement('div');
                item.className = 'wishlist-item';
                item.innerHTML = `
                    <div class="wishlist-item-img">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="wishlist-item-info">
                        <h4 class="wishlist-item-title">${product.title}</h4>
                        <div class="wishlist-item-price">$${product.price.toFixed(2)}</div>
                        <div class="wishlist-item-actions">
                            <button class="wishlist-item-remove" data-id="${product.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                            <a href="${product.affiliateLink}" target="_blank" class="wishlist-item-buy">
                                <i class="fas fa-shopping-cart"></i> Buy Now
                            </a>
                        </div>
                    </div>
                `;
                wishlistItems.appendChild(item);
            }
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.wishlist-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                removeFromWishlist(productId);
            });
        });
    }
}

// Add to wishlist
function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        
        // Show notification
        showNotification('Added to wishlist');
    }
}

// Remove from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    updateWishlistDisplay();
    
    // Update wishlist buttons on product cards
    document.querySelectorAll(`.product-wishlist[data-id="${productId}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show notification
    showNotification('Removed from wishlist');
}

// Check if product is in wishlist
function isInWishlist(productId) {
    return wishlist.includes(productId);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize wishlist count
updateWishlistCount();

// Search functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length > 2) {
        const results = products.filter(product => 
            product.title.toLowerCase().includes(query) || 
            product.category.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (results.length > 0) {
            searchSuggestions.innerHTML = '';
            results.forEach(product => {
                const item = document.createElement('div');
                item.className = 'search-suggestion-item';
                item.textContent = product.title;
                item.addEventListener('click', () => {
                    window.location.href = `product.html?id=${product.id}`;
                });
                searchSuggestions.appendChild(item);
            });
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    } else {
        searchSuggestions.style.display = 'none';
    }
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});

// Close search suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
    }
});

// Countdown timer
function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diff = endOfDay - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto slide change
let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const heroSlider = document.querySelector('.hero-slider');
heroSlider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

heroSlider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Quick View Modal
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        modalProductContent.innerHTML = `
            <div class="modal-product-gallery">
                <div class="modal-product-thumbnails">
                    ${product.images.map((img, index) => `
                        <div class="modal-product-thumbnail ${index === 0 ? 'active' : ''}" data-img="${img}">
                            <img src="${img}" alt="${product.title}">
                        </div>
                    `).join('')}
                </div>
                <div class="modal-product-main-img">
                    <img src="${product.images[0]}" alt="${product.title}">
                </div>
            </div>
            <div class="modal-product-info">
                <span class="modal-product-category">${product.category}</span>
                <h2>${product.title}</h2>
                <div class="modal-product-rating">
                    <div class="rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                        ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </div>
                    <span>${product.reviewCount} reviews</span>
                </div>
                <div class="modal-product-price">$${product.price.toFixed(2)}</div>
                <p class="modal-product-description">${product.description}</p>
                <div class="modal-product-actions">
                    <a href="${product.affiliateLink}" target="_blank" class="btn btn-primary" style="flex: 1;">Buy Now</a>
                    <button class="product-wishlist ${isInWishlist(product.id) ? 'active' : ''}" data-id="${product.id}" style="width: 50px;">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="modal-product-meta">
                    <span><i class="fas fa-box"></i> Free shipping on orders over $50</span>
                    <span><i class="fas fa-undo"></i> 30-day return policy</span>
                    <span><i class="fas fa-shield-alt"></i> Secure checkout</span>
                </div>
            </div>
        `;
        
        // Add event listeners to thumbnails
        document.querySelectorAll('.modal-product-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                document.querySelectorAll('.modal-product-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                document.querySelector('.modal-product-main-img img').src = thumb.getAttribute('data-img');
            });
        });
        
        // Add event listener to wishlist button
        const wishlistBtn = modalProductContent.querySelector('.product-wishlist');
        wishlistBtn.addEventListener('click', () => {
            const productId = wishlistBtn.getAttribute('data-id');
            if (isInWishlist(productId)) {
                removeFromWishlist(productId);
                wishlistBtn.classList.remove('active');
            } else {
                addToWishlist(productId);
                wishlistBtn.classList.add('active');
            }
        });
        
        quickViewModal.classList.add('active');
    }
}

closeQuickViewModal.addEventListener('click', () => {
    quickViewModal.classList.remove('active');
});

// Close modal when clicking outside
quickViewModal.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.classList.remove('active');
    }
});

// Load featured products
function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-grid');
    const filteredProducts = products.slice(0, 8); // Show first 8 products as featured
    
    featuredGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            ${product.isNew ? '<span class="product-badge">New</span>' : ''}
            ${product.discount ? `<span class="product-badge" style="background-color: var(--success-color);">${product.discount}% OFF</span>` : ''}
            <div class="product-img">
                <img src="${product.image}" alt="${product.title}">
                <button class="product-wishlist ${isInWishlist(product.id) ? 'active' : ''}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="discount">${product.discount}% OFF</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                        ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-actions">
                    <button class="product-btn" onclick="window.open('${product.affiliateLink}', '_blank')">Buy Now</button>
                    <button class="product-btn btn-outline" onclick="showQuickView('${product.id}')">Quick View</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.product-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = button.getAttribute('data-id');
            if (isInWishlist(productId)) {
                removeFromWishlist(productId);
                button.classList.remove('active');
            } else {
                addToWishlist(productId);
                button.classList.add('active');
            }
        });
    });
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}


// Load AI recommended products
function loadAIRecommendations() {
    const aiGrid = document.getElementById('ai-recommendations-grid');
    // Get 4 random products for recommendations
    const recommendedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    aiGrid.innerHTML = recommendedProducts.map(product => `
        <div class="product-card">
            ${product.isNew ? '<span class="product-badge">New</span>' : ''}
            ${product.discount ? `<span class="product-badge" style="background-color: var(--success-color);">${product.discount}% OFF</span>` : ''}
            <div class="product-img">
                <img src="${product.image}" alt="${product.title}">
                <button class="product-wishlist ${isInWishlist(product.id) ? 'active' : ''}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="discount">${product.discount}% OFF</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                        ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-actions">
                    <button class="product-btn" onclick="window.open('${product.affiliateLink}', '_blank')">Buy Now</button>
                    <button class="product-btn btn-outline" onclick="showQuickView('${product.id}')">Quick View</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('#ai-recommendations-grid .product-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = button.getAttribute('data-id');
            if (isInWishlist(productId)) {
                removeFromWishlist(productId);
                button.classList.remove('active');
            } else {
                addToWishlist(productId);
                button.classList.add('active');
            }
        });
    });
}

// Initialize the page
function initPage() {
    loadFeaturedProducts();
    loadAIRecommendations();
}

// Call initPage when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

// Add to wishlist
function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        showNotification('Added to wishlist'); // Moved notification here
    }
}

// Remove from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    updateWishlistDisplay();
    showNotification('Removed from wishlist'); // Moved notification here
    
    // Update wishlist buttons on product cards
    document.querySelectorAll(`.product-wishlist[data-id="${productId}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
}
// In both loadFeaturedProducts() and loadAIRecommendations():
button.addEventListener('click', (e) => {
    e.stopPropagation();
    const productId = button.getAttribute('data-id');
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        button.classList.remove('active');
    } else {
        addToWishlist(productId);
        button.classList.add('active');
    }
});

