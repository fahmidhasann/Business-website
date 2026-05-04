/**
 * Portfolio Site JavaScript
 * Wrapped in IIFE to prevent global scope pollution.
 * Uses strict mode for safer execution.
 */
(function () {
  'use strict';

  /* ==========================================================================
     Utility Functions
     ========================================================================== */

  /**
   * Throttle a function to run at most once per wait period.
   * @param {Function} fn
   * @param {number} wait - milliseconds
   * @returns {Function}
   */
  function throttle(fn, wait) {
    let lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

  /**
   * Sanitize user input to remove HTML tags and trim whitespace.
   * @param {string} input
   * @returns {string}
   */
  function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, '').trim();
  }

  /**
   * Validate an email address format.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    // RFC 5322 simplified regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Calculate scroll target position with nav offset.
   * @param {HTMLElement} targetElement
   * @returns {number}
   */
  function getScrollTargetTop(targetElement) {
    var NAV_OFFSET = 80;
    var top = targetElement.getBoundingClientRect().top + window.scrollY;
    return Math.max(top - NAV_OFFSET, 0);
  }

  /* ==========================================================================
     Theme Functions
     ========================================================================== */

  function setThemeToggleIcon(toggleButton, theme) {
    if (!toggleButton) return;
    var icon = document.createElement('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    icon.setAttribute('aria-hidden', 'true');
    toggleButton.textContent = '';
    toggleButton.appendChild(icon);
    toggleButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    var toggleButton = document.querySelector('.dark-mode-toggle');
    setThemeToggleIcon(toggleButton, newTheme);
  }

  /* ==========================================================================
     Animation & Visual Effects
     ========================================================================== */

  function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 900 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
          opacity: {
            value: 0.45,
            random: true,
            anim: { enable: true, speed: 0.5, opacity_min: 0.15, sync: false }
          },
          size: { value: 2.5, random: true, anim: { enable: false } },
          line_linked: { enable: true, distance: 160, color: '#ffffff', opacity: 0.2, width: 1 },
          move: {
            enable: true, speed: 0.5, direction: 'none', random: true,
            straight: false, out_mode: 'out', bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: false },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } }
          }
        },
        retina_detect: true
      });
    }
  }

  function initializeTextAnimations() {
    if (typeof Typed !== 'undefined') {
      new Typed('.typed-text', {
        strings: ['AI-Powered Solutions', 'Workflow Automation', 'Intelligent Systems'],
        typeSpeed: 45,
        backSpeed: 25,
        loop: true,
        backDelay: 3000,
        startDelay: 1500,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true,
        smartBackspace: true
      });
    }
  }

  function initializeScrollEffects() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.project-card').forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08
        });
      });

      gsap.utils.toArray('.contact-card').forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08
        });
      });
    } else {
      var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      document.querySelectorAll('.project-card, .contact-card').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }
  }

  function updateProgressBar() {
    var progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    var scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }

  /* ==========================================================================
     Navigation Functions
     ========================================================================== */

  function initializeNavigation() {
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    function setMobileMenuOpen(isOpen) {
      if (!navToggle || !navMenu) return;
      navMenu.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          if (targetElement.classList.contains('project-card')) {
            revealProjectCard(targetElement);
          }
          requestAnimationFrame(function () {
            window.scrollTo({
              top: getScrollTargetTop(targetElement),
              behavior: 'smooth'
            });
          });
          if (navMenu && navMenu.classList.contains('active')) {
            setMobileMenuOpen(false);
          }
        }
      });
    });

    if (navToggle && navMenu) {
      setMobileMenuOpen(navMenu.classList.contains('active'));

      navToggle.addEventListener('click', function () {
        setMobileMenuOpen(!navMenu.classList.contains('active'));
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          setMobileMenuOpen(false);
          navToggle.focus();
        }
      });
    }
  }

  /* ==========================================================================
     Project Functions
     ========================================================================== */

  function clearProjectHideTimeout(projectCard) {
    if (!projectCard || !projectCard._hideTimeoutId) return;
    clearTimeout(projectCard._hideTimeoutId);
    projectCard._hideTimeoutId = null;
  }

  function revealProjectCard(projectCard) {
    if (!projectCard || !projectCard.classList.contains('project-card')) return;
    clearProjectHideTimeout(projectCard);
    var showMoreBtn = document.getElementById('projectsShowMore');
    if (projectCard.classList.contains('hidden-card') && showMoreBtn && showMoreBtn.getAttribute('aria-expanded') !== 'true') {
      showMoreBtn.click();
    }
  }

  function initializeShowMore() {
    var VISIBLE_COUNT = 3;

    function setup(gridId, btnId) {
      var grid = document.getElementById(gridId);
      var btn = document.getElementById(btnId);
      if (!grid || !btn) return;

      var allItems = Array.from(grid.children);
      allItems.forEach(function (item, i) {
        if (i >= VISIBLE_COUNT) {
          item.classList.add('hidden-card');
        }
      });

      if (allItems.length <= VISIBLE_COUNT) {
        btn.style.display = 'none';
        return;
      }

      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        var label = btn.querySelector('.show-more-label');
        var isProjects = gridId === 'projectsGrid';

        if (isExpanded) {
          allItems.forEach(function (item, i) {
            if (i >= VISIBLE_COUNT) item.classList.add('hidden-card');
          });
          btn.setAttribute('aria-expanded', 'false');
          if (label) label.textContent = isProjects ? 'Show More Projects' : 'Show More Videos';
        } else {
          allItems.forEach(function (item) {
            item.classList.remove('hidden-card');
          });
          btn.setAttribute('aria-expanded', 'true');
          if (label) label.textContent = isProjects ? 'Show Less Projects' : 'Show Less Videos';
        }
      });
    }

    setup('projectsGrid', 'projectsShowMore');
  }

  /* ==========================================================================
     Command Palette Functions
     ========================================================================== */

  function initializeCommandPalette() {
    var commandPalette = document.getElementById('commandPalette');
    var commandInput = document.getElementById('commandInput');
    var commandList = document.getElementById('commandList');
    if (!commandPalette || !commandInput || !commandList) return;

    var commandItems = Array.from(commandList.querySelectorAll('[role="option"]'));
    var lastFocusedElement = null;

    function getVisibleCommands() {
      return commandItems.filter(function (command) {
        return !command.hidden;
      });
    }

    function setActiveCommand(command) {
      commandItems.forEach(function (item) {
        var isActive = item === command;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });
    }

    function resetCommandFilter() {
      commandInput.value = '';
      commandItems.forEach(function (command) {
        command.hidden = false;
      });
      setActiveCommand(null);
    }

    function openCommandPalette() {
      lastFocusedElement = document.activeElement;
      resetCommandFilter();
      commandPalette.classList.add('active');
      commandPalette.setAttribute('aria-hidden', 'false');
      commandInput.focus();
    }

    function closeCommandPalette(restoreFocus) {
      if (restoreFocus === undefined) restoreFocus = true;
      commandPalette.classList.remove('active');
      commandPalette.setAttribute('aria-hidden', 'true');
      setActiveCommand(null);
      if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    function runCommand(action) {
      closeCommandPalette(false);
      executeCommand(action);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (commandPalette.classList.contains('active')) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
      if (e.key === 'Escape' && commandPalette.classList.contains('active')) {
        closeCommandPalette();
      }
    });

    commandPalette.addEventListener('click', function (e) {
      if (e.target === commandPalette) {
        closeCommandPalette();
      }
    });

    commandList.addEventListener('click', function (e) {
      var command = e.target.closest('li[data-action]');
      if (command && !command.hidden) {
        runCommand(command.getAttribute('data-action'));
      }
    });

    commandInput.addEventListener('keydown', function (e) {
      var activeElement = commandList.querySelector('.active');
      var visibleCommands = getVisibleCommands();
      var activeIndex = visibleCommands.indexOf(activeElement);
      var newActiveElement;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          newActiveElement = activeIndex >= 0
            ? visibleCommands[(activeIndex + 1) % visibleCommands.length]
            : visibleCommands[0];
          setActiveCommand(newActiveElement);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newActiveElement = activeIndex >= 0
            ? visibleCommands[(activeIndex - 1 + visibleCommands.length) % visibleCommands.length]
            : visibleCommands[visibleCommands.length - 1];
          setActiveCommand(newActiveElement);
          break;
        case 'Enter':
          e.preventDefault();
          if (activeElement && !activeElement.hidden) {
            runCommand(activeElement.getAttribute('data-action'));
          } else if (visibleCommands[0]) {
            runCommand(visibleCommands[0].getAttribute('data-action'));
          }
          break;
      }
    });

    commandInput.addEventListener('input', function () {
      var filter = commandInput.value.toLowerCase();
      commandItems.forEach(function (command) {
        var text = command.textContent.toLowerCase();
        command.hidden = !text.includes(filter);
      });
      var activeCmd = commandList.querySelector('.active');
      if (activeCmd && activeCmd.hidden) {
        setActiveCommand(getVisibleCommands()[0] || null);
      }
    });
  }

  function executeCommand(action) {
    var commandPalette = document.getElementById('commandPalette');
    if (commandPalette) {
      commandPalette.classList.remove('active');
      commandPalette.setAttribute('aria-hidden', 'true');
    }
    switch (action) {
      case 'home':
        scrollToSection('hero');
        break;
      case 'projects':
        scrollToSection('projects');
        break;
      case 'contact':
        scrollToSection('contact');
        break;
      case 'dark-mode':
        toggleTheme();
        break;
    }
  }

  function scrollToSection(sectionId) {
    var targetElement = document.getElementById(sectionId);
    if (targetElement) {
      window.scrollTo({
        top: getScrollTargetTop(targetElement),
        behavior: 'smooth'
      });
    }
  }

  /* ==========================================================================
     UI Components
     ========================================================================== */

  function initializeDarkModeToggle() {
    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.classList.add('dark-mode-toggle');
    setThemeToggleIcon(toggleButton, document.documentElement.getAttribute('data-theme'));
    toggleButton.addEventListener('click', toggleTheme);
    document.body.appendChild(toggleButton);
  }

  function initializeHoverEffects() {
    var backdrop = document.getElementById('videoPopupBackdrop');
    var popup = document.getElementById('videoPopup');
    var popupPlayer = document.getElementById('videoPopupPlayer');
    var popupTitle = document.getElementById('videoPopupTitle');
    var closeBtn = document.getElementById('videoPopupClose');
    if (!backdrop || !popup || !popupPlayer) return;

    var lastFocusedElement = null;

    function showPopup(card) {
      var src = card.dataset.video;
      var title = card.dataset.title || '';
      if (!src) return;
      lastFocusedElement = document.activeElement;

      var resolvedSrc;
      try {
        resolvedSrc = new URL(src, location.href).href;
      } catch (err) {
        resolvedSrc = src;
      }

      if (popupPlayer.src !== resolvedSrc) {
        popupPlayer.src = src;
      }
      if (popupTitle) popupTitle.textContent = title;
      backdrop.classList.add('visible');
      popup.classList.add('visible');
      popup.setAttribute('aria-hidden', 'false');
      popupPlayer.currentTime = 0;
      if (closeBtn) closeBtn.focus();

      var playPromise = popupPlayer.play();
      if (playPromise) {
        playPromise.catch(function () {});
      }
    }

    function hidePopup() {
      if (!popup.classList.contains('visible')) return;
      backdrop.classList.remove('visible');
      popup.classList.remove('visible');
      popup.setAttribute('aria-hidden', 'true');
      popupPlayer.pause();
      popupPlayer.removeAttribute('src');
      popupPlayer.load();
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    document.querySelectorAll('.btn-demo').forEach(function (btn) {
      var card = btn.closest('.project-card[data-video]');
      if (card) btn.addEventListener('click', function () { showPopup(card); });
    });

    backdrop.addEventListener('click', hidePopup);
    if (closeBtn) closeBtn.addEventListener('click', hidePopup);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hidePopup();
    });
  }

  function initializeNavScroll() {
    var nav = document.querySelector('.compact-nav');
    if (!nav) return;

    window.addEventListener('scroll', throttle(function () {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, 100));
  }

  /* ==========================================================================
     Contact Form
     ========================================================================== */

  function initializeContactForm() {
    var form = document.getElementById('contactForm');
    var result = document.getElementById('formResult');
    if (!form || !result) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.contact-submit');
      if (!submitBtn) return;

      var btnText = submitBtn.querySelector('.btn-text');
      var btnIcon = submitBtn.querySelector('.fa-paper-plane');
      var btnLoading = submitBtn.querySelector('.btn-loading');
      if (!btnText || !btnIcon || !btnLoading) return;

      // Sanitize and validate inputs
      var nameField = form.querySelector('#contact-name');
      var emailField = form.querySelector('#contact-email');
      var companyField = form.querySelector('#contact-company');
      var messageField = form.querySelector('#contact-message');

      var nameVal = nameField ? sanitizeInput(nameField.value) : '';
      var emailVal = emailField ? sanitizeInput(emailField.value) : '';
      var companyVal = companyField ? sanitizeInput(companyField.value) : '';
      var messageVal = messageField ? sanitizeInput(messageField.value) : '';

      if (!nameVal || nameVal.length < 2) {
        result.textContent = 'Please enter a valid name (at least 2 characters).';
        result.className = 'form-result error';
        return;
      }
      if (!isValidEmail(emailVal)) {
        result.textContent = 'Please enter a valid email address.';
        result.className = 'form-result error';
        return;
      }
      if (!messageVal || messageVal.length < 10) {
        result.textContent = 'Please enter a message (at least 10 characters).';
        result.className = 'form-result error';
        return;
      }

      // Update sanitized values back to form
      if (nameField) nameField.value = nameVal;
      if (emailField) emailField.value = emailVal;
      if (companyField) companyField.value = companyVal;
      if (messageField) messageField.value = messageVal;

      // Loading state
      btnText.style.display = 'none';
      btnIcon.style.display = 'none';
      btnLoading.style.display = 'inline';
      submitBtn.disabled = true;

      try {
        var formData = new FormData(form);
        var response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        var data = await response.json();

        if (data.success) {
          result.textContent = 'Message sent! I\'ll get back to you soon.';
          result.className = 'form-result success';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        result.textContent = 'Failed to send message. Please try emailing me directly.';
        result.className = 'form-result error';
      } finally {
        btnText.style.display = 'inline';
        btnIcon.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;

        setTimeout(function () {
          result.textContent = '';
          result.className = 'form-result';
        }, 5000);
      }
    });
  }

  /* ==========================================================================
     Easter Egg Functions
     ========================================================================== */

  function initializeEasterEgg() {
    var konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    var konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function activateEasterEgg() {
    document.body.classList.add('konami-activated');
    createConfetti();
    setTimeout(function () {
      document.body.classList.remove('konami-activated');
    }, 5000);
  }

  function createConfetti() {
    var confettiContainer = document.createElement('div');
    confettiContainer.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(confettiContainer);

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 100; i++) {
      var confetti = document.createElement('div');
      var hue = Math.floor(Math.random() * 360);
      var left = (Math.random() * 100).toFixed(2);
      var opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
      var rotation = Math.floor(Math.random() * 360);
      var duration = (Math.random() * 3 + 2).toFixed(2);
      confetti.style.cssText =
        'position:absolute;width:10px;height:10px;background-color:hsl(' + hue + ',100%,50%);' +
        'top:-10px;left:' + left + '%;opacity:' + opacity + ';transform:rotate(' + rotation + 'deg);' +
        'animation:confetti-fall ' + duration + 's linear forwards;';
      fragment.appendChild(confetti);
    }
    confettiContainer.appendChild(fragment);

    var style = document.createElement('style');
    style.textContent =
      '@keyframes confetti-fall{0%{transform:translateY(0) rotate(0deg);}100%{transform:translateY(100vh) rotate(720deg);}}';
    document.head.appendChild(style);

    setTimeout(function () {
      confettiContainer.remove();
      style.remove();
    }, 5000);
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    initializeParticles();
    initializeTextAnimations();
    initializeScrollEffects();
    initializeNavigation();
    initializeShowMore();
    initializeCommandPalette();
    initializeDarkModeToggle();
    initializeHoverEffects();
    initializeNavScroll();
    initializeContactForm();
    initializeEasterEgg();

    window.addEventListener('scroll', throttle(updateProgressBar, 50));
  });
})();
