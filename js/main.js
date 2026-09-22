/* main.js - Core UI Interactions, Scroll Reveal, Typing Effect, Theme Toggle & Navigation */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Theme Switcher */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('SY_THEME') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    updateThemeIcon(savedTheme);
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const target = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('SY_THEME', target);
      updateThemeIcon(target);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'lucide-sun' : 'lucide-moon';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  /* 2. Scroll Progress Bar & Sticky Navbar */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;

    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Nav Highlight
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* 3. Mobile Menu Toggle */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
    // Close mobile menu when clicking a link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  /* 4. Typing Effect for Hero */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const words = [
      "Machine Learning Intern",
      "Data Analyst",
      "Problem Solver",
      "Python Developer"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 50;
      } else {
        typingElement.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }

  /* 5. Custom Cursor Tracker */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* 6. Intersection Observer for Scroll Reveal & Skill Bars */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Animate skill bars inside revealed element if present
        const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-level') || '75%';
          bar.style.width = targetWidth;
        });
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* 7. Contact Form Handler */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-message').value.trim();

      if (!name || !email || !msg) {
        showFormStatus('Please fill in all required fields.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="lucide-loader-2 animate-spin"></i> Sending...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="lucide-check"></i> Sent Successfully!`;
        showFormStatus(`Thank you, ${name}! Your message has been sent to Sachchidanand.`, 'success');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1200);
    });
  }

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.style.display = 'block';
    formStatus.style.color = type === 'success' ? '#00e676' : '#ff5252';
    formStatus.style.marginTop = '1rem';
    formStatus.style.fontWeight = '600';
  }

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
