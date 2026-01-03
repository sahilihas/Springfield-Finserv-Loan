// ===================================
// DARK MODE FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark');
    }

    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            
            // Save preference
            const newTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
        });
    }

    // ===================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===================================
    // LOAN CALCULATOR
    // ===================================
    const amountSlider = document.getElementById('loan-amount');
    const termSlider = document.getElementById('loan-term');
    const amountLabel = document.getElementById('amount-label');
    const termLabel = document.getElementById('term-label');
    const monthlyDisplay = document.getElementById('monthly-payment');

    const APR = 0.12; // 12% annual percentage rate

    function updateCalculator() {
        if (!amountSlider || !termSlider || !monthlyDisplay) return;

        const principal = parseFloat(amountSlider.value);
        const months = parseInt(termSlider.value);
        const monthlyRate = APR / 12;

        // Update labels
        if (amountLabel) {
            amountLabel.innerText = `$${principal.toLocaleString()}`;
        }
        if (termLabel) {
            termLabel.innerText = `${months} Months`;
        }

        // Calculate monthly payment using amortization formula
        // M = P * [r(1+r)^n] / [(1+r)^n - 1]
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                               (Math.pow(1 + monthlyRate, months) - 1);

        if (monthlyDisplay) {
            monthlyDisplay.innerText = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
        }

        // Update slider background gradient
        updateSliderBackground(amountSlider);
        updateSliderBackground(termSlider);
    }

    function updateSliderBackground(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const percentage = ((val - min) / (max - min)) * 100;
        
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    }

    if (amountSlider) {
        amountSlider.addEventListener('input', updateCalculator);
    }
    if (termSlider) {
        termSlider.addEventListener('input', updateCalculator);
    }

    // Initialize calculator on page load
    updateCalculator();

    // ===================================
    // CONTACT FORM SUBMISSION
    // ===================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                company: formData.get('company'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            // In a real application, you would send this to a server
            console.log('Contact form submitted:', data);

            // Show success message
            if (formSuccess) {
                formSuccess.classList.remove('hidden');
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // ===================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ===================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .team-member, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================================
    // FORM VALIDATION HELPER
    // ===================================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                input.classList.add('error');
            });

            input.addEventListener('input', () => {
                if (input.validity.valid) {
                    input.classList.remove('error');
                }
            });
        });
    });

    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================
    let scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Create scroll to top button if it doesn't exist
    if (!scrollToTopBtn && document.body.scrollHeight > window.innerHeight * 2) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scrollToTop';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            z-index: 999;
            box-shadow: var(--shadow-lg);
        `;
        document.body.appendChild(scrollToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollToTopBtn.addEventListener('mouseenter', () => {
            scrollToTopBtn.style.transform = 'translateY(-5px)';
        });

        scrollToTopBtn.addEventListener('mouseleave', () => {
            scrollToTopBtn.style.transform = 'translateY(0)';
        });
    }

    console.log('Springfield Financial - All scripts loaded successfully');
});