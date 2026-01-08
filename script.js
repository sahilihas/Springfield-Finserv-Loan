console.log("script.js loaded");
document.addEventListener('DOMContentLoaded', () => {

  /* ===================================
     DARK MODE FUNCTIONALITY
  =================================== */
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  // Apply saved theme on load
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark');
  }
  // Toggle dark mode
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      htmlElement.classList.toggle('dark');
      localStorage.setItem(
        'theme',
        htmlElement.classList.contains('dark') ? 'dark' : 'light'
      );
    });
  }

  /*MOBILE NAVIGATION (HAMBURGER)*/
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.getElementById('mobileOverlay');

  if (mobileToggle && navMenu && overlay) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
      });
    });
  }

  document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
  }
});

   // ===================================
    // FAQ ACCORDION
    // ===================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
  /* ===================================
     SMOOTH SCROLLING
  =================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  

  /* ===================================
     LOAN CALCULATOR
  =================================== */
  const amountSlider = document.getElementById('loan-amount');
  const termSlider = document.getElementById('loan-term');
  const amountLabel = document.getElementById('amount-label');
  const termLabel = document.getElementById('term-label');
  const monthlyDisplay = document.getElementById('monthly-payment');
  const APR = 0.12;

  function updateSliderBackground(slider) {
    const min = +slider.min;
    const max = +slider.max;
    const val = +slider.value;
    const percent = ((val - min) / (max - min)) * 100;
    slider.style.background =
      `linear-gradient(to right, var(--primary) ${percent}%, #e2e8f0 ${percent}%)`;
  }

  function updateCalculator() {
    if (!amountSlider || !termSlider || !monthlyDisplay) return;

    const principal = +amountSlider.value;
    const months = +termSlider.value;
    const monthlyRate = APR / 12;

    amountLabel && (amountLabel.textContent = `$${principal.toLocaleString()}`);
    termLabel && (termLabel.textContent = `${months} Months`);

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    monthlyDisplay.textContent = `$${payment.toFixed(2)}`;

    updateSliderBackground(amountSlider);
    updateSliderBackground(termSlider);
  }

  amountSlider && amountSlider.addEventListener('input', updateCalculator);
  termSlider && termSlider.addEventListener('input', updateCalculator);
  updateCalculator();

  /* ===================================
     CONTACT FORM
  =================================== */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      formSuccess?.classList.remove('hidden');
      contactForm.reset();

      setTimeout(() => {
        formSuccess?.classList.add('hidden');
      }, 5000);
    });
  }

  /* ===================================
     ACTIVE NAV LINK
  =================================== */
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ===================================
     SCROLL TO TOP BUTTON
  =================================== */
  let scrollBtn = document.getElementById('scrollToTop');

  if (!scrollBtn && document.body.scrollHeight > window.innerHeight * 2) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.textContent = '↑';
    scrollBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      transition: 0.3s;
      z-index: 999;
    `;
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
      scrollBtn.style.opacity = window.scrollY > 300 ? '1' : '0';
    });

    scrollBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  console.log('✅ Springfield JS loaded successfully');
});