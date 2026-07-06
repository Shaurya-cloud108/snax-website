/**
 * SNAX GAMING — OFFICIAL WEBSITE CORE JS
 * Author: Gemini Advanced Agent (Antigravity)
 * Handles layout interactions, page navigation, custom animations, and lightbox components.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Init core components
  initNavbar();
  initMobileMenu();
  initScrollAnimations();

  // Try fetching live statistics from YouTube API (falls back instantly if no API Key is saved)
  await loadHomeLiveStats();
  initStatCounters();

  initLightbox();
  initFaqAccordion();
  initContactForm();
  initHeroCarousel();
  initHorizontalTimeline();
  initVideoSwitcher();
  initJoysticks();
});

/* ==========================================
   1. Sticky Glass Navbar & Active Links
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (!navbar) return;

  // Set active link based on current page pathname
  const currentPath = window.location.pathname;
  const pageNameRaw = currentPath.split('/').pop() || 'index.html';
  const pageName = pageNameRaw.split('?')[0].split('#')[0];

  // Check if we are on the homepage
  const isHomePage = pageName === 'index.html' || pageName === '' || pageName === './';

  if (isHomePage) {
    // On Homepage: toggle scrolled background based on scroll position
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  } else {
    // On Subpages: navbar always has glassmorphism background, border & shadow
    navbar.classList.add('scrolled');
  }

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === pageName || (pageName === 'index.html' && linkHref === './') || (pageName === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================
   2. Mobile Hamburger Menu Drawer
   ========================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileDrawer) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileDrawer.classList.toggle('open');

    // Toggle body scrolling to prevent content movement in background
    if (mobileDrawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close drawer when link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================
   3. Scroll Reveal Animations (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // Element is 12% visible before triggering
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   4. Stat Counter Animations (Scroll triggered)
   ========================================== */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-num');

  if (stats.length === 0) return;

  const animateCounter = (element) => {
    const targetString = element.getAttribute('data-target');
    if (!targetString) return;

    // Extract numbers, signs (+, M, k)
    const targetValue = parseFloat(targetString.replace(/[^\d.]/g, ''));
    const isDecimal = targetString.includes('.');
    const suffix = targetString.replace(/[\d.]/g, ''); // Extract 'M+', '+', etc.

    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic progress
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeProgress * targetValue;

      if (isDecimal) {
        element.textContent = currentValue.toFixed(2) + suffix;
      } else {
        element.textContent = Math.floor(currentValue) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = targetString; // Ensure exact final text
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observerOptions = {
    threshold: 0.5
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  stats.forEach(stat => statsObserver.observe(stat));
}

/* ==========================================
   5. Interactive Lightbox (Gallery & Awards)
   ========================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('[data-lightbox]');

  if (galleryItems.length === 0) return;

  // Create Lightbox DOM structure if not exists
  let lightbox = document.getElementById('global-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'global-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content-wrapper">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img class="lightbox-img" src="" alt="Enlarged View">
        <div class="lightbox-caption"></div>
        <div class="lightbox-subcaption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxSubcaption = lightbox.querySelector('.lightbox-subcaption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const openLightbox = (e) => {
    const trigger = e.currentTarget;
    const imgSrc = trigger.getAttribute('data-lightbox-img') || trigger.src || trigger.querySelector('img')?.src;
    const title = trigger.getAttribute('data-lightbox-title') || '';
    const desc = trigger.getAttribute('data-lightbox-desc') || '';

    if (!imgSrc) return;

    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = title;
    lightboxSubcaption.textContent = desc;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
    setTimeout(() => {
      lightboxImg.src = ''; // Clear source after transition
    }, 400);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', openLightbox);
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // ESC Key close support
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================
   6. FAQ Accordion (Connect Page)
   ========================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  if (faqHeaders.length === 0) return;

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const isActive = parentItem.classList.contains('active');

      // Close all other FAQ items (accordion behavior)
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });
}

/* ==========================================
   7. Connect Page Form Submission (Simulation)
   ========================================== */
function initContactForm() {
  const form = document.getElementById('snax-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual loading response state on button
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'TRANSMITTING...';
    submitBtn.disabled = true;

    // Validate inputs (Basic)
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email-address');
    const topicSelect = document.getElementById('topic-select');
    const messageInput = document.getElementById('message-field');

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
      alert('Please fill out all required fields.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    // Simulate sending message over network (1.5 seconds)
    setTimeout(() => {
      // Create and trigger a premium overlay checkmark animation
      let overlay = form.querySelector('.submit-status-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'submit-status-overlay';
        overlay.innerHTML = `
          <div class="submit-status-content">
            <i class="fa-solid fa-circle-check"></i>
            <h3>Transmission Complete</h3>
            <p>Your message has been encrypted and sent to SNAX Gaming's dashboard.</p>
            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="closeFormOverlay(this)">SEND ANOTHER</button>
          </div>
        `;
        form.appendChild(overlay);
      }

      overlay.style.display = 'flex';

      // Clear input fields
      form.reset();

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Global window hook to dismiss contact success popup
window.closeFormOverlay = (btn) => {
  const overlay = btn.closest('.submit-status-overlay');
  if (overlay) overlay.style.display = 'none';
};

/* ==========================================
   8. Cinematic Hero Carousel (Home Page Hero)
   ========================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  const intervalTime = 5000; // Switch every 5 seconds

  const nextSlide = () => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  };

  // Set the timer
  let slideInterval = setInterval(nextSlide, intervalTime);

  // Parallax scrolling layout scale effect
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const activeSlide = document.querySelector('.carousel-slide.active');
    if (activeSlide) {
      const img = activeSlide.querySelector('.carousel-image');
      if (img) {
        img.style.transform = `translateY(${scrollPos * 0.15}px) scale(${1 + scrollPos * 0.0003})`;
      }
    }
  });
}

/* ==========================================
   9. YouTube API Live Stats Fetching (Home Page Fallback)
   ========================================== */
async function loadHomeLiveStats() {
  const elSubs = document.querySelector('#card-subs .stat-num');
  const elViews = document.querySelector('#card-views .stat-num');
  if (!elSubs || !elViews) return; // Not on the homepage, skip

  try {
    // Read from the static JSON file updated 3x daily by GitHub Actions (0 quota cost)
    const response = await fetch('data/channel_data.json?t=' + Math.floor(Date.now() / 300000));
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();

    if (data.home_stats) {
      const subsStr  = data.home_stats.subs_formatted  || elSubs.getAttribute('data-target');
      const viewsStr = data.home_stats.views_formatted || elViews.getAttribute('data-target');
      updateHomeStatsUI(subsStr, viewsStr);
      console.log(`✅ Home stats loaded from static file → Subs: ${subsStr} | Views: ${viewsStr}`);
    }
  } catch (err) {
    console.warn('⚠️ Could not load home stats from data file, using fallback:', err.message);
    // Fallback: keep whatever data-target is already set in the HTML
  }
}

function formatCompactNumber(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

function updateHomeStatsUI(subsStr, viewsStr) {
  const elSubs = document.querySelector('#card-subs .stat-num');
  const elViews = document.querySelector('#card-views .stat-num');
  if (elSubs) {
    elSubs.setAttribute('data-target', subsStr);
    elSubs.textContent = subsStr; // Directly set the value for instant display
  }
  if (elViews) {
    elViews.setAttribute('data-target', viewsStr);
    elViews.textContent = viewsStr; // Directly set the value for instant display
  }
  console.log(`✅ Live YouTube Stats loaded → Subs: ${subsStr} | Views: ${viewsStr}`);
}

/* ==========================================
   10. Interactive Horizontal Timeline Progression
   ========================================== */
function initHorizontalTimeline() {
  const container = document.querySelector('.timeline-horizontal-container');
  const progressLine = document.getElementById('h-timeline-progress');
  const nodes = document.querySelectorAll('.timeline-horizontal-node');

  if (!container || !progressLine || nodes.length === 0) return;

  let currentIndex = 1;
  const maxIndex = nodes.length;
  let intervalId = null;
  let isHovered = false;

  const updateTimeline = () => {
    const firstDot = document.querySelector('#node-1 .timeline-node-dot');
    const currentDot = document.querySelector(`#node-${currentIndex} .timeline-node-dot`);
    const timelineHorizontal = document.querySelector('.timeline-horizontal');

    if (firstDot && currentDot && timelineHorizontal) {
      const rectHorizontal = timelineHorizontal.getBoundingClientRect();
      const rectFirst = firstDot.getBoundingClientRect();
      const rectCurrent = currentDot.getBoundingClientRect();

      const startX = (rectFirst.left + rectFirst.width / 2) - rectHorizontal.left;
      const currentX = (rectCurrent.left + rectCurrent.width / 2) - rectHorizontal.left;

      progressLine.style.left = `${startX}px`;
      progressLine.style.width = `${currentX - startX}px`;
    }

    nodes.forEach(node => {
      const nodeNum = parseInt(node.id.replace('node-', ''));
      if (nodeNum <= currentIndex) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }

      if (nodeNum === currentIndex) {
        node.classList.add('current-focus');
      } else {
        node.classList.remove('current-focus');
      }
    });

    // Autoscroll to center current focus node (specifically when moving from node-6 to node-7)
    const currentNode = document.querySelector(`#node-${currentIndex}`);
    if (currentNode) {
      const containerWidth = container.clientWidth;
      const nodeOffsetLeft = currentNode.offsetLeft;
      const nodeWidth = currentNode.clientWidth;
      const scrollTarget = nodeOffsetLeft - (containerWidth / 2) + (nodeWidth / 2);

      container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
      });
    }
  };

  const startAutoplay = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (isHovered) return;

      currentIndex++;
      if (currentIndex > maxIndex) {
        currentIndex = 1;
      }
      updateTimeline();
    }, 2000);
  };

  nodes.forEach(node => {
    const card = node.querySelector('.timeline-node-card');
    if (card) {
      card.addEventListener('mouseenter', () => {
        isHovered = true;
        const targetIndex = parseInt(node.id.replace('node-', ''));
        if (targetIndex !== currentIndex) {
          currentIndex = targetIndex;
          updateTimeline();
        }
      });
      card.addEventListener('mouseleave', () => {
        isHovered = false;
      });
    }
  });

  window.addEventListener('resize', updateTimeline);

  // Initialize after short delay to ensure client bounding rects are loaded
  setTimeout(() => {
    updateTimeline();
    startAutoplay();
  }, 300);
}

function initVideoSwitcher() {
  const container = document.querySelector('.video-showcase-container');
  const mainIframe = document.getElementById('main-story-iframe');
  const buttons = document.querySelectorAll('.video-switch-btn');

  if (!mainIframe || buttons.length === 0) return;

  let currentIndex = 0;
  const maxIndex = buttons.length;
  let intervalId = null;
  let isHovered = false;

  const updateVideo = (index) => {
    currentIndex = index;

    buttons.forEach((b, idx) => {
      if (idx === currentIndex) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    const videoId = buttons[currentIndex].getAttribute('data-video-id');
    if (videoId) {
      mainIframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;
    }
  };

  const startAutoplay = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % maxIndex;
      updateVideo(currentIndex);
    }, 3500);
  };

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      updateVideo(idx);
      startAutoplay();
    });
  });

  // Connect Joy-Con Controller Buttons to Playlist Navigation
  const selectPrev = () => {
    currentIndex = (currentIndex - 1 + maxIndex) % maxIndex;
    updateVideo(currentIndex);
    startAutoplay();
  };

  const selectNext = () => {
    currentIndex = (currentIndex + 1) % maxIndex;
    updateVideo(currentIndex);
    startAutoplay();
  };

  // D-pad Navigation: UP/LEFT = Previous, DOWN/RIGHT = Next
  document.querySelectorAll('.joycon-dpad .up, .joycon-dpad .left').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectPrev();
    });
  });
  document.querySelectorAll('.joycon-dpad .down, .joycon-dpad .right').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNext();
    });
  });

  // ABXY Navigation: X/Y = Previous, B/A = Next
  document.querySelectorAll('.joycon-abxy .x, .joycon-abxy .y').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectPrev();
    });
  });
  document.querySelectorAll('.joycon-abxy .b, .joycon-abxy .a').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNext();
    });
  });

  startAutoplay();
}

/* ==========================================
   13. Nintendo Switch Movable Joysticks
   ========================================== */
function initJoysticks() {
  const analogs = document.querySelectorAll('.joycon-analog');

  analogs.forEach(analog => {
    const cap = analog.querySelector('.analog-cap');
    if (!cap) return;

    const handleDragStart = (e) => {
      e.preventDefault();

      const rect = analog.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxDist = 18; // Maximum pull distance in pixels

      const onDrag = (moveEvent) => {
        if (moveEvent.cancelable) moveEvent.preventDefault();

        const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxDist) {
          dx = (dx / distance) * maxDist;
          dy = (dy / distance) * maxDist;
        }

        cap.style.transition = 'none';
        cap.style.transform = `translate(${dx}px, ${dy}px)`;
      };

      const onRelease = () => {
        cap.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.4)';
        cap.style.transform = 'translate(0px, 0px)';

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onRelease);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', onRelease);
      };

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onRelease);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('touchend', onRelease);
    };

    analog.addEventListener('mousedown', handleDragStart);
    analog.addEventListener('touchstart', handleDragStart, { passive: false });
  });
}
