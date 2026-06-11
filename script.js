// Smooth Scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Navbar on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow and blur when scrolling
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
        navbar.style.background = 'rgba(13, 17, 23, 0.98)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Enhanced Intersection Observer for Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Observe sections with stagger effect
document.querySelectorAll('section').forEach((section, index) => {
    section.classList.add('fade-in');
    fadeInObserver.observe(section);
});

// Animate cards on scroll
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('card-visible');
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .skill-category, .stat').forEach(card => {
    card.classList.add('card-hidden');
    cardObserver.observe(card);
});

// ===== Professional Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formName = document.getElementById('formName');
    const formEmail = document.getElementById('formEmail');
    const formMessage = document.getElementById('formMessage');
    const charCountElement = document.querySelector('.char-current');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const formStatus = document.querySelector('.form-status');

    let isSubmitting = false;

    // Validation functions
    const validators = {
        name: (value) => value.trim().length >= 2,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: (value) => value.trim().length >= 10
    };

    // Field state tracking
    const fieldStates = {
        name: false,
        email: false,
        message: false
    };

    // Validate individual field
    function validateField(input, validatorKey, showErrors = false) {
        const formGroup = input.closest('.form-group');
        const value = input.value;
        
        // Clear previous states
        formGroup.classList.remove('error', 'valid');
        
        // Don't validate empty fields unless showing errors
        if (!value) {
            fieldStates[validatorKey] = false;
            updateSubmitButton();
            return false;
        }
        
        const isValid = validators[validatorKey](value);
        fieldStates[validatorKey] = isValid;
        
        // Show either error or valid state
        if (showErrors || isValid) {
            formGroup.classList.add(isValid ? 'valid' : 'error');
        }
        
        updateSubmitButton();
        return isValid;
    }

    // Update submit button state
    function updateSubmitButton() {
        const allValid = fieldStates.name && fieldStates.email && fieldStates.message;
        submitBtn.disabled = !allValid || isSubmitting;
    }

    // Character counter
    function updateCharCounter() {
        const count = formMessage.value.length;
        const maxLength = 500;
        charCountElement.textContent = count;
        
        const counter = document.querySelector('.char-counter');
        if (count > maxLength - 50) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    // Add input event listeners
    formName.addEventListener('input', () => {
        validateField(formName, 'name', formName.value.length > 0);
    });

    formName.addEventListener('blur', () => {
        if (formName.value) {
            validateField(formName, 'name', true);
        }
    });

    formEmail.addEventListener('input', () => {
        validateField(formEmail, 'email', formEmail.value.length > 0);
    });

    formEmail.addEventListener('blur', () => {
        if (formEmail.value) {
            validateField(formEmail, 'email', true);
        }
    });

    formMessage.addEventListener('input', () => {
        validateField(formMessage, 'message', formMessage.value.length > 0);
        updateCharCounter();
    });

    formMessage.addEventListener('blur', () => {
        if (formMessage.value) {
            validateField(formMessage, 'message', true);
        }
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isSubmitting) return;
        
        // Validate all fields with error display
        const nameValid = validateField(formName, 'name', true);
        const emailValid = validateField(formEmail, 'email', true);
        const messageValid = validateField(formMessage, 'message', true);
        
        if (!nameValid || !emailValid || !messageValid) {
            return;
        }
        
        // Get form values
        const name = formName.value.trim();
        const email = formEmail.value.trim();
        const message = formMessage.value.trim();
        
        // Set submitting state
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        
        const btnContent = submitBtn.querySelector('.btn-content');
        btnContent.innerHTML = '<span class="spinner"></span> Enviando…';
        
        // Hide any previous status
        formStatus.className = 'form-status';
        formStatus.textContent = '';
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            formStatus.className = 'form-status success';
            formStatus.innerHTML = '<i class=\"fas fa-check-circle\"></i> ¡Mensaje enviado! Te contactaré pronto.';
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('valid', 'error');
                });
                
                fieldStates.name = false;
                fieldStates.email = false;
                fieldStates.message = false;
                
                updateCharCounter();
                
                formStatus.className = 'form-status';
                formStatus.textContent = '';
                
                btnContent.textContent = 'Enviar Mensaje';
                isSubmitting = false;
                submitBtn.setAttribute('aria-busy', 'false');
                updateSubmitButton();
            }, 4000);
            
        } catch (error) {
            // Error state
            formStatus.className = 'form-status error';
            formStatus.innerHTML = '<i class=\"fas fa-exclamation-circle\"></i> Error al enviar. Intenta nuevamente.';
            
            btnContent.textContent = 'Enviar Mensaje';
            isSubmitting = false;
            submitBtn.setAttribute('aria-busy', 'false');
            updateSubmitButton();
        }
    });
}

// Animated Counter for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            animateCounter(stats[0], 50);
            animateCounter(stats[1], 3);
            animateCounter(stats[2], 15);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Enhanced Project Cards with 3D tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Parallax effect for hero section
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const hero = document.querySelector('.hero');
            const scrolled = window.pageYOffset;
            
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.4}px)`;
                hero.style.opacity = 1 - (scrolled / 600);
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// Add floating animation to social links
document.querySelectorAll('.social-links a').forEach((link, index) => {
    link.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// Functional project carousel
const carouselTrack = document.querySelector('.carousel-track');
if (carouselTrack) {
    const slides = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentCarouselIndex = 0;

    const setCarouselPosition = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
        carouselTrack.style.transform = `translateX(-${currentCarouselIndex * (slideWidth + gap)}px)`;
    };

    const updateDots = () => {
        dotsContainer?.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentCarouselIndex);
        });
    };

    const goToSlide = (index) => {
        currentCarouselIndex = (index + slides.length) % slides.length;
        setCarouselPosition();
        updateDots();
    };

    const createDots = () => {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Proyecto ${index + 1}`);
            dot.dataset.index = index;
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
    };

    createDots();
    setCarouselPosition();

    prevButton?.addEventListener('click', () => goToSlide(currentCarouselIndex - 1));
    nextButton?.addEventListener('click', () => goToSlide(currentCarouselIndex + 1));

    dotsContainer?.addEventListener('click', (event) => {
        const dot = event.target.closest('.carousel-dot');
        if (!dot) return;
        goToSlide(Number(dot.dataset.index));
    });

    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner?.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            nextButton?.click();
        }
        if (event.key === 'ArrowLeft') {
            prevButton?.click();
        }
    });

    window.addEventListener('resize', setCarouselPosition);
}

    // ===== Project modal behavior =====
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        const modalImage = projectModal.querySelector('.modal-image img');
        const modalTitle = projectModal.querySelector('.modal-title');
        const modalText = projectModal.querySelector('.modal-text');
        const modalClose = projectModal.querySelector('.modal-close');
        const modalBackdrop = projectModal.querySelector('.modal-backdrop');

        const openModal = (src, title, desc) => {
            if (!projectModal) return;
            if (modalImage) {
                modalImage.src = src || '';
                modalImage.alt = title || '';
            }
            if (modalTitle) modalTitle.textContent = title || '';
            if (modalText) modalText.textContent = desc || '';
            projectModal.classList.add('open');
            projectModal.setAttribute('aria-hidden', 'false');
            // prevent background scrolling while modal is open
            document.body.classList.add('modal-open');
            if (modalClose) modalClose.focus();
        };

        const closeModal = () => {
            if (!projectModal) return;
            projectModal.classList.remove('open');
            projectModal.setAttribute('aria-hidden', 'true');
            // restore page scroll
            document.body.classList.remove('modal-open');
            if (modalImage) modalImage.src = '';
        };

        // Attach click handlers to slides
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        carouselSlides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                // avoid clicks on controls
                const img = slide.querySelector('img');
                const src = img ? img.src : '';
                const title = slide.dataset.title || (img ? img.alt : '');
                const desc = slide.dataset.desc || '';
                openModal(src, title, desc);
            });
        });

        modalClose?.addEventListener('click', closeModal);
        modalBackdrop?.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('open')) {
                closeModal();
            }
        });
    }
