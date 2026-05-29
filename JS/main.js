function initCountdown() {
    const countdownContainer = document.querySelector('.countdown-container');
    const countdownEls = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    if (!countdownEls.days || !countdownEls.hours || !countdownEls.minutes || !countdownEls.seconds) {
        return;
    }

    const eventDate = new Date(2026, 9, 10, 0, 0, 0);

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = eventDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            if (countdownContainer) {
                countdownContainer.classList.add('countdown-arrived');
                countdownContainer.innerHTML = '<p>The day has arrived!!</p>';
            }
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

const SONG_CATEGORIES = new Set([
    'Best Amapiano song of the year',
    'Best RnB song of the year',
    'Best Motswako song of the year',
    'Best Gospel/ Clap and Tap song of the year',
    'Best Hip hop song of the year'
]);

function resetDynamicFields() {
    const songFields = document.querySelectorAll('[data-dynamic-song]');
    const portfolioField = document.getElementById('dynamicDetails');

    songFields.forEach((field) => {
        field.value = '';
        field.required = false;
        field.setAttribute('aria-required', 'false');
    });

    if (portfolioField) {
        portfolioField.value = '';
        portfolioField.required = false;
        portfolioField.setAttribute('aria-required', 'false');
    }
}

function updateDynamicCategoryFields() {
    const hiddenInput = document.getElementById('selectedCategory');
    const dynamicContainer = document.getElementById('dynamicFieldContainer');
    const songFieldsContainer = document.getElementById('songDynamicFields');
    const portfolioFieldContainer = document.getElementById('portfolioDynamicField');
    const portfolioField = document.getElementById('dynamicDetails');
    const songFields = document.querySelectorAll('[data-dynamic-song]');

    const selectedCategory = hiddenInput?.value?.trim() || '';
    const isSongCategory = SONG_CATEGORIES.has(selectedCategory);

    if (!dynamicContainer || !songFieldsContainer || !portfolioFieldContainer || !portfolioField) {
        return;
    }

    if (!selectedCategory) {
        dynamicContainer.classList.remove('active');
        songFieldsContainer.classList.remove('active');
        portfolioFieldContainer.classList.remove('active');
        resetDynamicFields();
        return;
    }

    dynamicContainer.classList.add('active');
    songFieldsContainer.classList.toggle('active', isSongCategory);
    portfolioFieldContainer.classList.toggle('active', !isSongCategory);

    songFields.forEach((field) => {
        const required = isSongCategory;
        field.required = required;
        field.setAttribute('aria-required', String(required));
    });

    portfolioField.required = false;
    portfolioField.setAttribute('aria-required', 'false');

    if (isSongCategory) {
        portfolioField.value = '';
    } else {
        songFields.forEach((field) => {
            field.value = '';
        });
    }
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
        const artistNameInput = document.getElementById('artistName');
        const artistName = artistNameInput?.value?.trim() || 'there';

        const formData = new FormData(form);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Securely...';
        status.className = 'form-status loading';
        status.textContent = 'Your submission is being verified securely.';

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.className = 'form-status success';
                status.textContent = `Thank you, ${artistName}. Your submission has been securely received. Our team will review it and be in touch within the next few days.`;
                form.reset();
                if (hiddenInput) hiddenInput.value = '';
                if (label) label.textContent = 'No category selected';
                updateDynamicCategoryFields();
            } else {
                status.className = 'form-status error';
                status.textContent = 'Oops, we could not complete your submission right now. Please check your details and try again.';
            }
        }).catch(error => {
            status.className = 'form-status error';
            status.textContent = 'Submission error. Please check your connection and try again.';
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit My Nomination';
        });
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

    hiddenInput.addEventListener('change', updateDynamicCategoryFields);
    updateDynamicCategoryFields();
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
        musicArtists: {
            label: 'Music & Artists',
            copy: 'Celebrate the voices, crews, and culture-shapers redefining local sound and stage presence.',
            items: [
                'Best traditional group of the year',
                'Best hip hop artist of the year',
                'Best RnB artist of the year',
                'Best Gospel artist of the year',
                'Best Clap and Tap group of the year',
                'Best Pop artist of the year',
                'Best Amapiano artist of the year',
                'Best Motswako artist of the year'
            ]
        },
        tracksSonic: {
            label: 'Tracks & Sonic Wave',
            copy: 'Recognise the records, selectors, and sonic moments that move the room and shape the culture.',
            items: [
                'Best Amapiano song of the year',
                'Best RnB song of the year',
                'Best Motswako song of the year',
                'Best Gospel/ Clap and Tap song of the year',
                'Best Hip hop song of the year',
                'Best DJ of the year',
                'Best female dj of the year'
            ]
        },
        creativeArts: {
            label: 'Creative Arts & Media',
            copy: 'Highlight the storytellers, visual creators, and performance specialists with strong local influence.',
            items: [
                'Best Poet of the year',
                'Best Graphic designer of the year',
                'Best Photographer of the year',
                'Best Visual artist of the year',
                'Best MC of the year',
                'Best Content creator/ Influencer of the year',
                'Best Comedian of the year'
            ]
        },
        businessLifestyle: {
            label: 'Business & Lifestyle',
            copy: 'Showcase the entrepreneurs and lifestyle leaders carving out impact through brand, hustle, and style.',
            items: [
                'Best Hustler/entrepreneur of the year',
                'Best clothing brand of the year'
            ]
        },
        other: {
            label: 'Other Categories',
            copy: 'A focused space for standout categories that still deserve premium recognition.',
            items: [
                'Best Foodlet of the year'
            ]
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
                musicArtists: 'fa-music',
                tracksSonic: 'fa-wave-square',
                creativeArts: 'fa-palette',
                businessLifestyle: 'fa-briefcase',
                other: 'fa-circle-question'
            };

            Object.keys(categories).forEach(key => {
                const group = categories[key];
                const countLabel = group.items.length === 1 ? 'category' : 'categories';
                const card = document.createElement('article');
                card.className = 'luxury-sub-card';
                card.innerHTML = `
                    <i class="fa-solid ${icons[key]} gold-text" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <span>${group.label}</span>
                    <small class="gold-text">Explore ${group.items.length} ${countLabel}</small>
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
                    formInput.dispatchEvent(new Event('change', { bubbles: true }));

                    updateDynamicCategoryFields();

                    closeOverlay();
                    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

function initGalleryMarquee() {
    const track = document.getElementById('galleryMarqueeTrack');
    const prevBtn = document.getElementById('galleryScrollPrev');
    const nextBtn = document.getElementById('galleryScrollNext');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.gallery-marquee-card');
    if (cards.length === 0) return;

    // Move controls inside the shell for absolute positioning on the sides
    const shell = track.parentElement;
    if (shell) {
        shell.appendChild(prevBtn);
        shell.appendChild(nextBtn);
    }

    let cardStep = 0;
    let offset = 0;
    let autoPaused = false;
    let resumeTimer = null;
    let animationFrame = null;

    const measureStep = () => {
        const gap = parseFloat(getComputedStyle(track).gap || '16') || 16;
        const card = cards[0];
        cardStep = Math.ceil(card.getBoundingClientRect().width + gap);
    };

    const getWrapWidth = () => track.scrollWidth / 2;

    const syncTransform = () => {
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const pauseAuto = () => {
        autoPaused = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
            autoPaused = false;
        }, 4200);
    };

    const moveBy = (direction) => {
        if (!cardStep) {
            measureStep();
        }

        const wrapWidth = getWrapWidth();
        offset += direction * cardStep;

        if (offset > 0) {
            offset = -wrapWidth + 1;
        }

        if (offset < -wrapWidth) {
            offset = 0;
        }

        syncTransform();
        pauseAuto();
    };

    const frameLoop = () => {
        if (!autoPaused) {
            offset -= 0.85;
            const wrapWidth = getWrapWidth();

            if (offset <= -wrapWidth) {
                offset = 0;
            }

            syncTransform();
        }

        animationFrame = requestAnimationFrame(frameLoop);
    };

    prevBtn.addEventListener('click', () => moveBy(1));
    nextBtn.addEventListener('click', () => moveBy(-1));

    window.addEventListener('resize', () => {
        measureStep();
        syncTransform();
    });

    measureStep();
    syncTransform();
    animationFrame = requestAnimationFrame(frameLoop);
}

function initGalleryPreview() {
    const overlay = document.getElementById('galleryPreviewOverlay');
    const closeBtn = document.getElementById('galleryPreviewClose');
    const previewImage = document.getElementById('galleryPreviewImage');
    const previewTitle = document.getElementById('galleryPreviewTitle');
    const cards = document.querySelectorAll('.gallery-marquee-card');

    if (!overlay || !closeBtn || !previewImage || !previewTitle || cards.length === 0) {
        return;
    }

    const closePreview = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('gallery-preview-open');
    };

    const openPreview = (card) => {
        previewImage.src = card.dataset.preview || '';
        previewTitle.textContent = 'Way Up Local Awards';
        previewImage.alt = 'Expanded Way Up Local Awards preview';
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('gallery-preview-open');
    };

    cards.forEach((card) => {
        card.addEventListener('click', () => openPreview(card));
    });

    closeBtn.addEventListener('click', closePreview);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closePreview();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlay.classList.contains('active')) {
            closePreview();
        }
    });
}

function initWinnersCarousel() {
    const winners = [
        {
            category: 'Best MC of the year',
            name: 'Malome AJ',
            description: 'Commanding the stage with presence, polish, and unforgettable crowd energy.',
            image: 'Images/malome.jpg',
            alt: 'Malome AJ'
        },
        {
            category: 'Best photographer of the year',
            name: 'Tamati ya chillis',
            description: 'Capturing the season with sharp eyes, rich detail, and a signature visual voice.',
            image: 'Images/tamati.jpg',
            alt: 'Tamati ya chillis'
        },
        {
            category: 'Best Male DJ of the year',
            name: 'Vino Torric',
            description: 'Setting the tempo with premium mixes and dance-floor confidence.',
            image: 'Images/vino t.jpg',
            alt: 'Vino Torric'
        },
        {
            category: 'Best Female DJ of the year',
            name: 'Mizzy Mellow',
            description: 'Bringing elegance, rhythm, and a standout sound to every set.',
            image: 'Images/mizzy.jpg',
            alt: 'Mizzy Mellow'
        },
        {
            category: 'Best Foodoutlet of the year',
            name: 'Food by Buffalo',
            description: 'Serving flavour, consistency, and the kind of local love people remember.',
            image: 'Images/amo.jpg',
            alt: 'Food by Buffalo'
        },
        {
            category: 'Best Pop Artist of the year',
            name: 'Teekay Music',
            description: 'A standout pop voice bringing melody, presence, and fresh local star power.',
            image: 'Images/teko.jpg',
            alt: 'Teekay Music'
        },
        {
            category: 'Kasi Life Time Achievement Award',
            name: 'NEO KGOSI',
            description: 'Honoured for lasting impact, community legacy, and a life of meaningful contribution.',
            image: 'Images/neiza.jpg',
            alt: 'NEO KGOSI'
        },
        {
            category: 'Best Community Hero',
            name: 'MOHAU TUTUBALA',
            description: 'Recognised for service, courage, and dedication to uplifting the community.',
            image: 'Images/mohau.jpg',
            alt: 'MOHAU TUTUBALA'
        },
        {
            category: 'Male Fashion Icon of the year',
            name: 'Krish Sihle',
            description: 'Celebrated for sharp style, confidence, and an unmistakable fashion identity.',
            image: 'Images/krish.jpg',
            alt: 'Krish Sihle'
        },
        {
            category: 'Best Influencer of the year',
            name: 'Temoso Gabs',
            description: 'Leading conversations with personality, reach, and a strong connection to the audience.',
            image: 'Images/gabs.jpg',
            alt: 'Temoso Gabs'
        },
        {
            category: 'Best Hip Hop Song of the year',
            name: 'Collin Omen - Wow',
            description: 'Awarded for "Wow", a hip hop track with presence, energy, and memorable impact.',
            image: 'Images/collin.jpg',
            alt: 'Collin Omen'
        },
        {
            category: 'Best Female Fashion Icon',
            name: 'Mozandada',
            description: 'Recognised for style, confidence, and a standout fashion presence.',
            image: 'Images/mozandada.jpg',
            alt: 'Mozandada'
        },
        {
            category: 'Best Nail Art Tech',
            name: 'Glam Goddess',
            description: 'Celebrated for detail, creativity, and polished nail artistry.',
            image: 'Images/glam goddess.jpg',
            alt: 'Glam Goddess'
        }
    ];

    const openBtn = document.getElementById('openWinnersModal');
    const modal = document.getElementById('winnersModal');
    const closeBtn = document.getElementById('closeWinnersModal');
    const prevBtn = document.getElementById('winnerPrev');
    const nextBtn = document.getElementById('winnerNext');
    const image = document.getElementById('winnerModalImage');
    const category = document.getElementById('winnerModalCategory');
    const name = document.getElementById('winnerModalName');
    const description = document.getElementById('winnerModalDescription');
    const counter = document.getElementById('winnerCounter');

    if (!openBtn || !modal || !closeBtn || !prevBtn || !nextBtn || !image || !category || !name || !description || !counter) {
        return;
    }

    let currentIndex = 0;

    const renderWinner = () => {
        const winner = winners[currentIndex];

        image.style.animation = 'none';
        image.offsetHeight;
        image.style.animation = '';

        image.src = winner.image;
        image.alt = winner.alt;
        category.textContent = winner.category;
        name.textContent = winner.name;
        description.textContent = winner.description;
        counter.textContent = `${currentIndex + 1} / ${winners.length}`;
    };

    const openModal = () => {
        renderWinner();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('winners-modal-open');
        nextBtn.focus();
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('winners-modal-open');
        openBtn.focus();
    };

    const moveWinner = (direction) => {
        currentIndex = (currentIndex + direction + winners.length) % winners.length;
        renderWinner();
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => moveWinner(-1));
    nextBtn.addEventListener('click', () => moveWinner(1));

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('active')) {
            return;
        }

        if (event.key === 'Escape') {
            closeModal();
        }

        if (event.key === 'ArrowLeft') {
            moveWinner(-1);
        }

        if (event.key === 'ArrowRight') {
            moveWinner(1);
        }
    });
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
    initGalleryMarquee();
    initGalleryPreview();
    initWinnersCarousel();
});
