// Cajun Ventures - Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initAnimations();
    initTestimonialSlider();
    initGalleryFilter();
    initComparisonSlider();
    initFAQ();
    initForms();
    initCalculator();
    initLightbox();
    initMobileQuoteBar();
});

// Header Scroll Effect
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;
    const scrollThreshold = 50;  // Add .scrolled class after 50px scroll
    const hideThreshold = 300;   // Only hide header after scrolling 300px down

    function updateHeader() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class based on scroll position
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Optional: Hide header on scroll down, show on scroll up
        // Only activate after user has scrolled past hideThreshold
        // Uncomment the block below to enable this behavior:
        /*
        if (currentScroll > hideThreshold) {
            if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
                // Scrolling down - hide header
                header.classList.add('header-hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('header-hidden');
            }
        } else {
            header.classList.remove('header-hidden');
        }
        */

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        ticking = false;
    }

    // Use requestAnimationFrame for smooth performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Check initial scroll position on page load (for refreshes mid-page)
    updateHeader();
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-main');
    
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('open');
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            nav.classList.remove('open');
        }
    });
}

// Mobile Quote Bar
function initMobileQuoteBar() {
    if (document.querySelector('.mobile-quote-bar')) return;

    const bar = document.createElement('div');
    bar.className = 'mobile-quote-bar';
    bar.setAttribute('aria-label', 'Quick contact actions');
    bar.innerHTML = `
        <a href="tel:4096171161" class="mobile-quote-bar-call">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            Call Now
        </a>
        <a href="quote.html" class="mobile-quote-bar-quote">
            Free Quote
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
    `;

    document.body.appendChild(bar);
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation delay for grid items
                const parent = entry.target.parentElement;
                if (parent && parent.classList.contains('grid')) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const container = document.querySelector('.testimonial-slider');
    if (!container) return;

    const slides = container.querySelectorAll('.testimonial-slide');
    const dots = container.querySelectorAll('.slider-dot');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoplayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            slide.style.opacity = i === index ? '1' : '0';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    // Initialize
    showSlide(0);

    // Dot navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            resetAutoplay();
        });
    });

    // Arrow navigation
    const prevBtn = container.querySelector('.slider-prev');
    const nextBtn = container.querySelector('.slider-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    container.addEventListener('mouseleave', startAutoplay);
}

// Gallery Filter
function initGalleryFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const items = document.querySelectorAll('.gallery-item');
    
    if (tabs.length === 0 || items.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter items
            items.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}

// Before/After Comparison Slider
function initComparisonSlider() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.comparison-handle');
        const afterDiv = slider.querySelector('.comparison-after');
        
        if (!handle || !afterDiv) return;

        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            afterDiv.style.clipPath = 'inset(0 ' + (100 - percentage) + '% 0 0)';
            handle.style.left = percentage + '%';
        }

        // Mouse events
        handle.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updateSlider(e.clientX);
            }
        });

        // Touch events
        handle.addEventListener('touchstart', () => isDragging = true);
        document.addEventListener('touchend', () => isDragging = false);
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
            }
        });

        // Click to jump
        slider.addEventListener('click', (e) => {
            if (e.target !== handle) {
                updateSlider(e.clientX);
            }
        });
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

// Form Handling - Netlify Forms + HubSpot CRM Integration
function initForms() {
    const forms = document.querySelectorAll('form[data-form]');

    forms.forEach(form => {
        const successMsg = form.querySelector('.form-success');
        const errorMsg = form.querySelector('.form-error');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        // Get HubSpot form type if specified
        const hubspotFormType = form.dataset.hubspot;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hide any previous messages
            if (successMsg) successMsg.classList.remove('show');
            if (errorMsg) errorMsg.classList.remove('show');

            // Disable button and show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span>';
            }

            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }

            // Prepare form data
            const formData = new FormData(form);

            // Submit to both Netlify and HubSpot in parallel
            // Netlify is primary; HubSpot is secondary for CRM tracking
            const submissionPromises = [];

            // Netlify Forms submission (primary)
            const netlifyPromise = fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            submissionPromises.push(netlifyPromise);

            // HubSpot CRM submission (secondary - runs in parallel)
            if (hubspotFormType && window.HubSpot && window.HubSpot.submit) {
                const hubspotPromise = window.HubSpot.submit(formData, hubspotFormType)
                    .then(result => {
                        if (result.success) {
                            console.log('HubSpot CRM: Contact synced successfully');
                        } else {
                            // Log but do not fail the form - HubSpot is secondary
                            console.warn('HubSpot CRM: Sync failed -', result.error);
                        }
                        return result;
                    })
                    .catch(err => {
                        console.warn('HubSpot CRM: Error -', err.message);
                        return { success: false, error: err.message };
                    });
                submissionPromises.push(hubspotPromise);
            }

            try {
                // Wait for Netlify response (primary), HubSpot runs in background
                const response = await netlifyPromise;

                if (response.ok) {
                    // Show success message
                    if (successMsg) {
                        successMsg.classList.add('show');
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Reset form
                    form.reset();

                    // Track form submission event for HubSpot analytics
                    if (window._hsq) {
                        window._hsq.push(['trackEvent', {
                            id: 'form_submission',
                            value: hubspotFormType || form.dataset.form
                        }]);
                    }

                    // Hide success message after 8 seconds
                    setTimeout(() => {
                        if (successMsg) successMsg.classList.remove('show');
                    }, 8000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form error:', error);

                // Show error message
                if (errorMsg) {
                    errorMsg.classList.add('show');
                } else if (successMsg) {
                    // Fallback: modify success message to show error
                    successMsg.textContent = 'Something went wrong. Please call us at (409) 617-1161.';
                    successMsg.style.background = 'rgba(255, 0, 0, 0.1)';
                    successMsg.style.borderColor = '#ff0000';
                    successMsg.classList.add('show');
                }
            } finally {
                // Re-enable button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
        
        // Remove error class on input
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('error');
            });
        });
    });
    
    // Phone number formatting
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0,3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
                }
            }
            
            e.target.value = value;
        });
    });
}

// Cost Calculator
function initCalculator() {
    const calculator = document.querySelector('.calculator');
    if (!calculator) return;

    const serviceSelect = calculator.querySelector('#calc-service');
    const acreageInput = calculator.querySelector('#calc-acreage');
    const resultDisplay = calculator.querySelector('.calculator-result-value');
    
    if (!serviceSelect || !acreageInput || !resultDisplay) return;

    // Base prices per acre (these are estimates for display purposes)
    const basePrices = {
        'land-clearing': { min: 1500, max: 3500 },
        'brush-hogging': { min: 150, max: 400 },
        'excavation': { min: 2000, max: 5000 },
        'grading': { min: 1000, max: 2500 },
        'drainage': { min: 1500, max: 4000 },
        'house-pad': { min: 3000, max: 8000 },
        'driveway': { min: 2000, max: 6000 },
        'pond': { min: 5000, max: 15000 },
        'demolition': { min: 3000, max: 10000 },
        'fencing': { min: 1500, max: 4000 }
    };

    function calculateEstimate() {
        const service = serviceSelect.value;
        const acreage = parseFloat(acreageInput.value) || 0;
        
        if (!service || acreage <= 0) {
            resultDisplay.textContent = '$0 - $0';
            return;
        }

        const prices = basePrices[service];
        if (!prices) {
            resultDisplay.textContent = 'Contact for quote';
            return;
        }

        // Calculate with diminishing rate for larger acreage
        let multiplier = acreage;
        if (acreage > 5) {
            multiplier = 5 + (acreage - 5) * 0.8;
        }
        if (acreage > 20) {
            multiplier = 5 + 15 * 0.8 + (acreage - 20) * 0.6;
        }

        const minTotal = Math.round(prices.min * multiplier / 100) * 100;
        const maxTotal = Math.round(prices.max * multiplier / 100) * 100;

        resultDisplay.textContent = `$${minTotal.toLocaleString()} - $${maxTotal.toLocaleString()}`;
    }

    serviceSelect.addEventListener('change', calculateEstimate);
    acreageInput.addEventListener('input', calculateEstimate);
}

// Lightbox
function initLightbox() {
    // Create lightbox element if it doesn't exist
    let lightbox = document.querySelector('.lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <img src="" alt="Gallery Image">
            <button class="lightbox-prev">&#10094;</button>
            <button class="lightbox-next">&#10095;</button>
        `;
        document.body.appendChild(lightbox);
        
        // Add lightbox styles
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.95);
                z-index: 2000;
                justify-content: center;
                align-items: center;
                padding: 40px;
            }
            .lightbox.open {
                display: flex;
            }
            .lightbox img {
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            }
            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #ff6a00, #ff3d00);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lightbox-prev, .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background: rgba(255,255,255,0.1);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .lightbox-prev { left: 20px; }
            .lightbox-next { right: 20px; }
            .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(255,106,0,0.8);
            }
        `;
        document.head.appendChild(style);
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let galleryImages = [];
    let currentIndex = 0;

    // Open lightbox on gallery item click
    document.querySelectorAll('.gallery-item[data-lightbox]').forEach((item, index) => {
        item.addEventListener('click', () => {
            galleryImages = Array.from(document.querySelectorAll('.gallery-item[data-lightbox] img'));
            currentIndex = index;
            openLightbox(item.querySelector('img').src);
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to current page nav link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNavLink();

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + (counter.dataset.suffix || '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.dataset.suffix || '');
            }
        };
        
        // Start animation when in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

animateCounters();

// Hero Blur-up (LQIP) Loading Effect
function initHeroBlurUp() {
    const heroContainers = document.querySelectorAll('.hero-bg, .page-hero');

    heroContainers.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;

        // Create a blurred placeholder if full image hasn't loaded
        const placeholder = document.createElement('div');
        placeholder.className = 'hero-placeholder';
        placeholder.style.cssText = `
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            z-index: -1;
            transition: opacity 0.5s ease-out;
        `;

        // Add blur effect placeholder
        if (!img.complete) {
            container.appendChild(placeholder);
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-out';

            img.addEventListener('load', () => {
                img.style.opacity = '1';
                placeholder.style.opacity = '0';
                setTimeout(() => {
                    if (placeholder.parentNode) {
                        placeholder.parentNode.removeChild(placeholder);
                    }
                }, 500);
            });
        }
    });
}

// Initialize hero blur-up effect
initHeroBlurUp();

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
