(function() {
  "use strict";

  // ====================================
  // Particle System for Hero Background
  // ====================================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let connections = [];
    let animFrameId;
    // Reduce particles on mobile for smooth performance
    const isMobile = window.innerWidth < 768;
    const isLowPower = window.innerWidth < 480;
    const PARTICLE_COUNT = isLowPower ? 25 : (isMobile ? 40 : 80);
    const MAX_DISTANCE = isMobile ? 100 : 150;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.7 ? 'rgba(255, 215, 0,' : 'rgba(100, 255, 218,';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const opacity = (1 - dist / MAX_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(100, 255, 218,' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      animFrameId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // ====================================
  // Typed.js Effect
  // ====================================
  const typed = document.querySelector('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 2500
    });
  }

  // ====================================
  // Counter Animation for Hero Stats
  // ====================================
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }

  // Trigger counter animation when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }

  // ====================================
  // Progress Bar Animation
  // ====================================
  function animateProgressBars() {
    const bars = document.querySelectorAll('.progress-bar-fill');
    bars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width + '%';
    });
  }

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars();
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ====================================
  // Publication Tabs
  // ====================================
  const pubTabs = document.querySelectorAll('.pub-tab');
  const pubItems = document.querySelectorAll('.pub-item');

  pubTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active from all tabs
      pubTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      
      pubItems.forEach(item => {
        if (item.classList.contains(filter)) {
          item.style.display = 'flex';
          item.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ====================================
  // Skills Category Tabs
  // ====================================
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillChips = document.querySelectorAll('.skill-chip');

  if (skillTabs.length > 0) {
    skillTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class
        skillTabs.forEach(t => t.classList.remove('active'));
        
        // Add active to current
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        
        skillChips.forEach(chip => {
          // Reset animation
          chip.style.animation = 'none';
          chip.offsetHeight; /* trigger reflow */
          
          if (filter === 'all' || chip.classList.contains(filter)) {
            chip.style.display = 'inline-flex';
            chip.style.animation = 'fadeInUp 0.5s ease-out';
          } else {
            chip.style.display = 'none';
          }
        });
      });
    });
    
    // Initialize the first tab automatically (Programming)
    // small timeout so elements are fully loaded
    setTimeout(() => {
        if(skillTabs[0]) skillTabs[0].click();
    }, 100);
  }

  // ====================================
  // Mobile Nav Toggle (Touch-friendly)
  // ====================================
  document.addEventListener('click', function(e) {
    if (e.target.matches('.mobile-nav-toggle') || e.target.closest('.mobile-nav-toggle')) {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      const toggle = document.querySelector('.mobile-nav-toggle');
      toggle.classList.toggle('bx-menu');
      toggle.classList.toggle('bx-x');
    }
    // Close mobile nav when tapping outside sidebar on mobile
    if (document.body.classList.contains('mobile-nav-active') &&
        !e.target.closest('#header') &&
        !e.target.matches('.mobile-nav-toggle') &&
        !e.target.closest('.mobile-nav-toggle')) {
      document.body.classList.remove('mobile-nav-active');
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) {
        toggle.classList.add('bx-menu');
        toggle.classList.remove('bx-x');
      }
    }
  });

  // ====================================
  // Smooth Scroll for Navigation
  // ====================================
  document.querySelectorAll('.scrollto').forEach(el => {
    el.addEventListener('click', function(e) {
      if (document.querySelector(this.hash)) {
        e.preventDefault();

        let body = document.querySelector('body');
        if (body.classList.contains('mobile-nav-active')) {
          body.classList.remove('mobile-nav-active');
          let navbarToggle = document.querySelector('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bx-menu');
          navbarToggle.classList.toggle('bx-x');
        }
        
        const target = document.querySelector(this.hash);
        const headerOffset = 20;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ====================================
  // Navigation Active State on Scroll
  // ====================================
  window.addEventListener('load', navActiveState);
  window.addEventListener('scroll', navActiveState);

  function navActiveState() {
    let position = window.scrollY + 200;
    document.querySelectorAll('#navbar .scrollto').forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = document.querySelector(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  }

  // ====================================
  // Back to Top Button
  // ====================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ====================================
  // AOS Initialization
  // ====================================
  window.addEventListener('load', () => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-cubic',
      once: false,
      mirror: true,
      offset: 80
    });
  });

  // ====================================
  // WhatsApp Form Integration
  // ====================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      const whatsappNumber = "919989900350";
      const text = `Hello Prof. Anil Raju,%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
      
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;
      window.open(whatsappURL, '_blank');
    });
  }

  // ====================================
  // GLightbox Initialization
  // ====================================
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  // ====================================
  // Footer Year
  // ====================================
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ====================================
  // Smooth Reveal Animations
  // ====================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section-container').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    revealObserver.observe(section);
  });

})();
