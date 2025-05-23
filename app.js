function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function setupMobileNav() {
  const navToggle = $('.nav-toggle');
  const header = $('#header');
  let mobileNavMenu = null;
  
  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      if (mobileNavMenu) {
        mobileNavMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      } else {
        mobileNavMenu = document.createElement('div');
        mobileNavMenu.className = 'mobile-nav active';
        
        const navLinks = $('.nav-links');
        if (navLinks) {
          mobileNavMenu.appendChild(navLinks.cloneNode(true));
        }
        
        const cta = $('.header-cta');
        if (cta) {
          mobileNavMenu.appendChild(cta.cloneNode(true));
        }
        
        header.appendChild(mobileNavMenu);
        navToggle.classList.add('active');
        
        const mobileLinks = mobileNavMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            mobileNavMenu.classList.remove('active');
            navToggle.classList.remove('active');
          });
        });
      }
    });
  }
}

function setupStickyHeader() {
  const header = $('#header');
  const headerHeight = header?.offsetHeight || 0;
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (!header) return;
    
    if (currentScrollY > headerHeight) {
      header.classList.add('sticky');
      if (currentScrollY > lastScrollY) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    } else {
      header.classList.remove('sticky');
      header.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  });
}

function setupActiveNavLinks() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function setupStatsCounter() {
  const stats = $$('.stat-number');
  let animated = false;
  
  const animateStats = () => {
    if (animated) return;
    
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count') || '0', 10);
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current > target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current).toString();
      }, 30);
    });
    
    animated = true;
  };
  
  const aboutSection = $('#about');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(aboutSection);
  }
}

function setupPortfolioFilter() {
  const filterBtns = $$('.filter-btn');
  const portfolioItems = $$('.portfolio-item');
  
  const portfolioData = Array.from(portfolioItems).map(item => ({
    element: item,
    category: item.getAttribute('data-category') || 'all'
  }));
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      portfolioData.forEach(item => {
        if (filter === 'all' || item.category === filter) {
          item.element.style.display = '';
          setTimeout(() => {
            item.element.style.opacity = '1';
            item.element.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.element.style.opacity = '0';
          item.element.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.element.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function setupTestimonialSlider() {
  const slider = $('.testimonial-slider');
  if (!slider) return;
  
  const track = $('.testimonial-track');
  const cards = Array.from($$('.testimonial-card'));
  const dotsContainer = $('.testimonial-dots');
  const prevBtn = $('.prev-btn');
  const nextBtn = $('.next-btn');
  
  if (!track || !dotsContainer || !prevBtn || !nextBtn) return;
  
  const controls = {
    prevBtn,
    nextBtn,
    dots: dotsContainer,
    track,
    cards,
    currentIndex: 0
  };
  
  cards.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(controls, index));
    dotsContainer.appendChild(dot);
  });
  
  prevBtn.addEventListener('click', () => {
    const newIndex = controls.currentIndex - 1;
    if (newIndex < 0) {
      goToSlide(controls, cards.length - 1);
    } else {
      goToSlide(controls, newIndex);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    const newIndex = controls.currentIndex + 1;
    if (newIndex >= cards.length) {
      goToSlide(controls, 0);
    } else {
      goToSlide(controls, newIndex);
    }
  });
  
  let interval = setInterval(() => {
    const newIndex = (controls.currentIndex + 1) % cards.length;
    goToSlide(controls, newIndex);
  }, 5000);
  
  slider.addEventListener('mouseenter', () => clearInterval(interval));
  slider.addEventListener('mouseleave', () => {
    interval = setInterval(() => {
      const newIndex = (controls.currentIndex + 1) % cards.length;
      goToSlide(controls, newIndex);
    }, 5000);
  });
}

function goToSlide(controls, index) {
  controls.track.style.transform = `translateX(-${index * 100}%)`;
  controls.currentIndex = index;
  
  const dots = Array.from(controls.dots.querySelectorAll('.dot'));
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function setupContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      return;
    }
    
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Please enter your email');
      return;
    }
    
    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email');
      return;
    }
    
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please enter your message');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showSuccessMessage('Your message has been sent successfully!');
    }, 1500);
  });
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  const errorMsg = document.createElement('div');
  errorMsg.className = 'error-message';
  errorMsg.textContent = message;
  errorMsg.style.color = 'var(--color-error)';
  errorMsg.style.fontSize = '0.875rem';
  errorMsg.style.marginTop = '0.25rem';
  
  const existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    formGroup.removeChild(existingError);
  }
  
  formGroup.appendChild(errorMsg);
  input.style.borderColor = 'var(--color-error)';
  
  input.addEventListener('input', function onInput() {
    formGroup.removeChild(errorMsg);
    input.style.borderColor = '';
    input.removeEventListener('input', onInput);
  });
}

function showSuccessMessage(message) {
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = message;
  successMsg.style.position = 'fixed';
  successMsg.style.bottom = '20px';
  successMsg.style.right = '20px';
  successMsg.style.backgroundColor = 'var(--color-success)';
  successMsg.style.color = 'white';
  successMsg.style.padding = '1rem';
  successMsg.style.borderRadius = 'var(--radius-md)';
  successMsg.style.boxShadow = 'var(--shadow-lg)';
  successMsg.style.zIndex = '1000';
  successMsg.style.opacity = '0';
  successMsg.style.transform = 'translateY(20px)';
  successMsg.style.transition = 'opacity 0.3s, transform 0.3s';
  
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    successMsg.style.opacity = '1';
    successMsg.style.transform = 'translateY(0)';
  }, 10);
  
  setTimeout(() => {
    successMsg.style.opacity = '0';
    successMsg.style.transform = 'translateY(20px)';
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 300);
  }, 4000);
}

function setupScrollAnimation() {
  const animateElements = $$('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
}

function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;
      
      const headerHeight = $('#header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupStickyHeader();
  setupActiveNavLinks();
  setupStatsCounter();
  setupPortfolioFilter();
  setupTestimonialSlider();
  setupContactForm();
  setupScrollAnimation();
  setupSmoothScrolling();
});
