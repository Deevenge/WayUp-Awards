function initCountdown() {
    const countdownEls = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    if (!countdownEls.days || !countdownEls.hours || !countdownEls.minutes || !countdownEls.seconds) {
        return;
    }

    const eventDate = new Date();
    eventDate.setMonth(eventDate.getMonth() + 6);

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = eventDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            countdownEls.days.textContent = '00';
            countdownEls.hours.textContent = '00';
            countdownEls.minutes.textContent = '00';
            countdownEls.seconds.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownEls.days.textContent = String(days).padStart(2, '0');
        countdownEls.hours.textContent = String(hours).padStart(2, '0');
        countdownEls.minutes.textContent = String(minutes).padStart(2, '0');
        countdownEls.seconds.textContent = String(seconds).padStart(2, '0');
    };

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach((item) => {
        const header = item.querySelector('.accordion-header');

        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            items.forEach((otherItem) => otherItem.classList.remove('open'));

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
}

function initFormHandler() {
    const form = document.getElementById('nominationForm');
    const status = document.getElementById('formStatus');

    if (!form || !status) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const hiddenInput = document.getElementById('selectedCategory');
        const label = document.getElementById('selectedCategoryLabel');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Securely...';
        status.textContent = 'Your submission is being verified securely.';

        setTimeout(() => {
            form.reset();
            if (hiddenInput) hiddenInput.value = '';
            if (label) label.textContent = 'No category selected';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit My Application';
            status.textContent = 'Thank you! Your submission has been securely received and verified.';
        }, 1500);
    });
}

function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    const closeNav = () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const openNav = () => {
        navLinks.classList.add('open');
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
    };

    navToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = navLinks.classList.contains('open');

        if (isOpen) {
            closeNav();
        } else {
            openNav();
        }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            closeNav();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
            closeNav();
        }
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.main-header');

    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 24);
    });
}

function initFormCategoryPicker() {
    const hiddenInput = document.getElementById('selectedCategory');
    const label = document.getElementById('selectedCategoryLabel');

    if (!hiddenInput || !label) return;

    hiddenInput.value = '';
    label.textContent = 'No category selected';
}

function initLuxuryOverlay() {
    const overlay = document.getElementById('luxuryOverlay');
    const backBtn = document.getElementById('overlayBackBtn');
    const closeBtn = document.getElementById('overlayCloseBtn');
    const openBtn = document.getElementById('openCategoryOverlayBtn');
    const groupTriggers = document.querySelectorAll('.group-trigger');
    const subGrid = document.getElementById('overlaySubGrid');
    const title = document.getElementById('overlayTitle');
    const eyebrow = document.getElementById('overlayEyebrow');
    const copy = document.getElementById('overlayCopy');
    const formInput = document.getElementById('selectedCategory');
    const label = document.getElementById('selectedCategoryLabel');

    if (!overlay || !subGrid || !title || !eyebrow || !copy || !formInput || !label) return;

    const categories = {
        music: {
            label: 'Music & Arts',
            copy: 'Explore the local soundscape with refined categories for artists, producers, and new voices.',
            items: ['Best Local Artist', 'Best Local DJ', 'Song of the Year', 'Rising Star Award', 'Best Music Group']
        },
        business: {
            label: 'Entrepreneurship',
            copy: 'Highlight small businesses, founders, and modern innovators creating standout community impact.',
            items: ['Best Small Business', 'Best Restaurant', 'Best Local Fashion Brand', 'Best Nail Tech', 'Best Entrepreneur']
        },
        social: {
            label: 'Social Media',
            copy: 'Celebrate the digital storytellers, creators, and influencers shaping the culture online.',
            items: ['Best Vlogger', 'Influencer of the Year', 'TikTok Creator Award', 'Podcast of the Year']
        },
        community: {
            label: 'Community',
            copy: 'Recognise community builders, teachers, and organisers creating real local change.',
            items: ['Best Teacher', 'Community Leader', 'Humanitarian Award']
        },
        lifestyle: {
            label: 'Lifestyle',
            copy: 'Showcase style, beauty, wellness, and cultural presence across everyday living.',
            items: ['Best Makeup Artist', 'Hair Stylist of the Year', 'Best Photographer', 'Cultural Icon Award']
        }
    };

    const formElement = document.getElementById('nominationForm');
    let activeGroup = null;

    const renderOverlay = (groupId = null) => {
        subGrid.innerHTML = '';

        if (!groupId) {
            // Root View: Show Parent Categories
            activeGroup = null;
            eyebrow.textContent = 'Explore Categories';
            title.textContent = 'Choose a parent group';
            copy.textContent = 'Tap a broad category to open its refined sub-category list.';
            if (backBtn) backBtn.style.visibility = 'hidden';

            const icons = {
                music: 'fa-music',
                business: 'fa-briefcase',
                social: 'fa-hashtag',
                community: 'fa-hand-holding-heart',
                lifestyle: 'fa-gem'
            };

            Object.keys(categories).forEach(key => {
                const group = categories[key];
                const card = document.createElement('article');
                card.className = 'luxury-sub-card';
                card.innerHTML = `
                    <i class="fa-solid ${icons[key]} gold-text" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <span>${group.label}</span>
                    <small class="gold-text">Explore ${group.items.length} categories</small>
                `;
                card.addEventListener('click', () => renderOverlay(key));
                subGrid.appendChild(card);
            });
        } else {
            // Sub-category View: Show items for the selected group
            const group = categories[groupId] || categories.music;
            activeGroup = groupId;
            eyebrow.textContent = group.label;
            title.textContent = `Explore ${group.label}`;
            copy.textContent = group.copy;
            if (backBtn) backBtn.style.visibility = 'visible';

            group.items.forEach((item) => {
                const card = document.createElement('article');
                card.className = 'luxury-sub-card';
                card.innerHTML = `<span>${item}</span><small class="gold-text">Tap to select</small>`;
                card.addEventListener('click', () => {
                    formInput.value = item;
                    label.textContent = item;
                    closeOverlay();
                    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
                subGrid.appendChild(card);
            });
        }
    };

    const openOverlay = (groupId) => {
        renderOverlay(groupId);
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overlay-open');
    };

    const closeOverlay = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('overlay-open');
    };

    if (openBtn) {
        openBtn.addEventListener('click', () => openOverlay(null));
    }

    groupTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openOverlay(trigger.dataset.group || 'music');
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => renderOverlay(null));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
    }

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeOverlay();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing once the animation has triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

function initHeroSlideshow() {
    const container = document.querySelector('.showcase-image-slideshow');
    if (!container) return;

    const images = container.querySelectorAll('img');
    if (images.length === 0) return;

    // Set initial background for the blurred effect
    container.style.setProperty('--bg-image', `url('${images[0].src}')`);

    if (images.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
        // Update the blurred background to match the active image
        container.style.setProperty('--bg-image', `url('${images[currentIndex].src}')`);
    }, 4000); // Transitions every 4 seconds
}

window.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initAccordion();
    initFormHandler();
    initNavToggle();
    initHeaderScroll();
    initLuxuryOverlay();
    initFormCategoryPicker();
    initScrollAnimations();
    initHeroSlideshow();
});
