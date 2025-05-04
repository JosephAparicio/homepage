// DOM elements
const themeToggle = document.querySelector('.theme-toggle');
const animateItems = document.querySelectorAll('.animate-item');
const navLinks = document.querySelectorAll('.nav-item');
const flipCard = document.querySelector('.flip-card');
const countdownEl = document.getElementById('countdown');
const deactivateBtn = document.getElementById('deactivate-bomb');
const explosionContainer = document.getElementById('explosion-container');

// Variables for bomb functionality
let countdownValue = 10;
let countdownInterval = null;
let bombActivated = false;

// Check for saved theme preference or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Move toggle ball position according to current theme
if (savedTheme === 'dark') {
  document.querySelector('.toggle-ball').style.transform = 'translateX(30px)';
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Update theme attribute
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Save theme preference
  localStorage.setItem('theme', newTheme);
});

// Scroll animation
function checkScroll() {
  animateItems.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;
    const itemBottom = item.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    
    // Check if item is in viewport
    if (itemTop < windowHeight - 100 && itemBottom > 0) {
      item.classList.add('animate');
    }
  });
}

// Initial check for elements in viewport
checkScroll();

// Check for elements in viewport on scroll
window.addEventListener('scroll', checkScroll);

// Smooth scroll for navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Get the target section id from the href
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    // Calculate position to scroll to (with offset for the fixed navbar)
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    
    // Smooth scroll to target
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// Mobile menu toggle (responsive design enhancement)
function setupMobileMenu() {
  // Create mobile menu button
  const mobileMenuBtn = document.createElement('div');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  
  // Add to navbar when screen is small
  const navContainer = document.querySelector('.nav-container');
  
  // Only add if viewport is mobile size
  if (window.innerWidth <= 900) {
    navContainer.insertBefore(mobileMenuBtn, document.querySelector('.theme-toggle'));
    
    // Toggle mobile menu on click
    mobileMenuBtn.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('show-mobile');
    });
  }
}

// Setup mobile menu on load if needed
window.addEventListener('load', setupMobileMenu);

// Update mobile menu on resize
window.addEventListener('resize', () => {
  const existingBtn = document.querySelector('.mobile-menu-btn');
  if (window.innerWidth <= 900) {
    if (!existingBtn) setupMobileMenu();
  } else {
    if (existingBtn) existingBtn.remove();
    document.querySelector('.nav-links').classList.remove('show-mobile');
  }
});

// Add "active" class to current section in navbar
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section[id]');
  const navHeight = document.querySelector('.navbar').offsetHeight;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Bomb activation and countdown functionality
flipCard.addEventListener('mouseenter', () => {
  if (!bombActivated) {
    flipCard.classList.add('active');
    bombActivated = true;
    
    // Start the countdown
    startCountdown();
    
    // Activate the deactivation button
    deactivateBtn.classList.add('active');
  }
});

// Start the countdown
function startCountdown() {
  // Set initial value
  countdownValue = 10;
  countdownEl.textContent = countdownValue;
  
  // Start the interval
  countdownInterval = setInterval(() => {
    countdownValue--;
    countdownEl.textContent = countdownValue;
    
    // If countdown reaches 0, trigger explosion
    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
      explodeWebsite();
    }
  }, 1000);
}

// Wait for tsParticles to load
async function waitForTsParticles() {
  return new Promise((resolve) => {
    if (typeof tsParticles !== 'undefined') {
      resolve();
    } else {
      window.addEventListener('load', () => {
        if (typeof tsParticles !== 'undefined') {
          resolve();
        } else {
          console.error('tsParticles failed to load');
        }
      });
    }
  });
}

// Initialize tsParticles
async function initTsParticles() {
  try {
    await waitForTsParticles();
    
    await tsParticles.load("explosion-container", {
      particles: {
        number: {
          value: 200,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: ["#FF5733", "#FFC300", "#FF2E00", "#FF8300"]
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 1,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0,
            sync: false
          }
        },
        size: {
          value: 15,
          random: true,
          anim: {
            enable: true,
            speed: 10,
            size_min: 1,
            sync: false
          }
        },
        line_linked: {
          enable: false
        },
        move: {
          enable: true,
          speed: 8,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false
          },
          onclick: {
            enable: false
          },
          resize: true
        }
      },
      retina_detect: true
    });
  } catch (error) {
    console.error('Error initializing tsParticles:', error);
  }
}

// Explosion effect for the website
async function explodeWebsite() {
  try {
    // Initialize the particles for explosion effect
    await initTsParticles();
    
    // Create DOM explosion effect - break content into pieces that fly away
    document.body.style.overflow = "hidden";
    
    // Hide content with explosion animation
    const contentElements = document.querySelectorAll('section, footer, header');
    contentElements.forEach((el, index) => {
      el.style.transition = 'transform 1.5s cubic-bezier(.17,.67,.83,.67), opacity 1.5s';
      el.style.transformOrigin = 'center center';
      
      // Random direction and rotation for elements
      const randomX = (Math.random() - 0.5) * 2000;
      const randomY = (Math.random() - 0.5) * 2000;
      const randomRotate = (Math.random() - 0.5) * 720;
      
      // Apply with delay based on index for cascade effect
      setTimeout(() => {
        el.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(0.5)`;
        el.style.opacity = "0";
      }, index * 150);
    });
  } catch (error) {
    console.error('Error during website explosion:', error);
  }
}

// Bomb deactivation functionality
deactivateBtn.addEventListener('click', (e) => {
  // Only work if bomb is activated
  if (bombActivated) {
    e.preventDefault();
    
    // Stop the countdown
    clearInterval(countdownInterval);
    
    // Reset the countdown display
    countdownValue = 0;
    countdownEl.textContent = "DESACTIVADA";
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.background = 'rgba(0, 128, 0, 0.8)';
    successMessage.style.color = 'white';
    successMessage.style.padding = '20px';
    successMessage.style.borderRadius = '10px';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.zIndex = '2000';
    successMessage.style.textAlign = 'center';
    successMessage.innerHTML = '<i class="fas fa-check-circle" style="font-size: 30px; margin-bottom: 10px;"></i><br>¡BOMBA DESACTIVADA CON ÉXITO!';
    
    document.body.appendChild(successMessage);
    
    // Remove the success message after 3 seconds
    setTimeout(() => {
      document.body.removeChild(successMessage);
      
      // Reset the UI
      flipCard.classList.remove('active');
      deactivateBtn.classList.remove('active');
      bombActivated = false;
    }, 3000);
  }
});