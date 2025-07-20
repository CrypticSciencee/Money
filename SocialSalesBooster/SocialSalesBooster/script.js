// ===== GLOBAL VARIABLES =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const watchOverviewBtn = document.getElementById('watch-overview');
const videoModal = document.getElementById('video-modal');
const modalClose = document.getElementById('modal-close');
const overviewVideo = document.getElementById('overview-video');
const contactForm = document.getElementById('contact-form');
const faqItems = document.querySelectorAll('.faq-item');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize all functionality
    initNavigation();
    initSmoothScroll();
    initVideoModal();
    initFAQ();
    initContactForm();
    initScrollEffects();
    
    console.log('AutoFlow AI Landing Page Initialized');
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(27, 31, 59, 0.98)';
                navbar.style.backdropFilter = 'blur(25px)';
                navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            } else {
                navbar.style.background = 'rgba(27, 31, 59, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.borderBottom = 'none';
            }
        });
    }
}

// ===== SMOOTH SCROLL FUNCTIONALITY =====
function initSmoothScroll() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== VIDEO MODAL FUNCTIONALITY =====
function initVideoModal() {
    if (watchOverviewBtn && videoModal && modalClose && overviewVideo) {
        // Open modal
        watchOverviewBtn.addEventListener('click', function() {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Auto-play video when modal opens
            overviewVideo.play().catch(e => {
                console.log('Auto-play prevented:', e);
            });
        });

        // Close modal function
        function closeModal() {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            overviewVideo.pause();
            overviewVideo.currentTime = 0;
        }

        // Close modal events
        modalClose.addEventListener('click', closeModal);
        
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Handle video errors
        overviewVideo.addEventListener('error', function() {
            console.error('Video failed to load');
            // You could show a fallback message here
            const videoContainer = this.parentElement;
            videoContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent-green);"></i>
                    <p>Video temporarily unavailable. Please try again later.</p>
                </div>
            `;
        });
    }
}

// ===== FAQ ACCORDION FUNCTIONALITY =====
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });

            // Make FAQ items keyboard accessible
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            try {
                // Validate form
                const validation = validateForm(formObject);
                if (!validation.isValid) {
                    throw new Error(validation.message);
                }
                
                // Submit to Formspree (replace with your actual endpoint)
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    showFormMessage('success', 'Thank you! Your audit request has been submitted. We\'ll contact you within 24 hours.');
                    this.reset();
                    
                    // Track conversion (you can integrate with analytics here)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'contact',
                            'event_label': 'audit_request'
                        });
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('error', error.message || 'Something went wrong. Please try again.');
            } finally {
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear error state on input
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    }
}

// ===== FORM VALIDATION =====
function validateForm(formObject) {
    const required = ['firstName', 'lastName', 'email', 'platforms', 'message'];
    const missing = required.filter(field => !formObject[field] || formObject[field].trim() === '');
    
    if (missing.length > 0) {
        return {
            isValid: false,
            message: `Please fill in all required fields: ${missing.join(', ')}`
        };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }
    
    return { isValid: true };
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    // Update field state
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, message);
    } else {
        field.classList.remove('error');
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFormMessage(type, message) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.background = 'rgba(0, 245, 160, 0.1)';
        messageDiv.style.border = '1px solid rgba(0, 245, 160, 0.3)';
        messageDiv.style.color = '#00F5A0';
    } else {
        messageDiv.style.background = 'rgba(255, 107, 107, 0.1)';
        messageDiv.style.border = '1px solid rgba(255, 107, 107, 0.3)';
        messageDiv.style.color = '#ff6b6b';
    }
    
    messageDiv.textContent = message;
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const isTime = text.includes('min');
    const isMultiplier = text.includes('×');
    const hasPlus = text.includes('+');
    
    let targetNumber;
    if (isTime) {
        targetNumber = parseInt(text);
    } else if (isMultiplier) {
        targetNumber = parseInt(text.replace('×', ''));
    } else {
        targetNumber = parseInt(text.replace('+', ''));
    }
    
    let currentNumber = 0;
    const increment = targetNumber / 50;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        
        let displayText = Math.floor(currentNumber).toString();
        if (isTime) {
            displayText += 'min';
        } else if (isMultiplier) {
            displayText = Math.floor(currentNumber) + '×';
        } else if (hasPlus) {
            displayText += '+';
        }
        
        element.textContent = displayText;
    }, 30);
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add CSS class for form field errors
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important;
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Optimize scroll listeners
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could implement error tracking here
});

// Console message for developers
console.log(`
🚀 AutoFlow AI Landing Page
Built with vanilla HTML, CSS, and JavaScript
Optimized for performance and accessibility
`);
