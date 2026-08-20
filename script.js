/* ==========================================
   JVP CREATIVE DESIGN & ARCHITECTURE
   Interactive Web Functionality & Dynamics
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky & Scrolled Navbar --- */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        highlightActiveNavLink();
    });

    /* --- 2. Active Nav Link Highlighting --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* --- 3. Mobile Sidebar Navigation --- */
    const menuToggle   = document.getElementById('menuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose  = document.getElementById('sidebarClose');
    const sidebarLinks  = document.querySelectorAll('.sidebar-link');

    function openSidebar() {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggle && mobileSidebar) {
        menuToggle.addEventListener('click', openSidebar);
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        sidebarLinks.forEach(link => {
            link.addEventListener('click', closeSidebar);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSidebar();
        });
    }

    /* --- 4. Portfolio Filter System --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInCard 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* --- 5. Number Counter Animation --- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (!target) return;

            let count = 0;
            const increment = target / 40;
            const plus = stat.querySelector('.plus') ? stat.querySelector('.plus').outerHTML : '';

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    stat.innerHTML = Math.ceil(count) + plus;
                    setTimeout(updateCount, 30);
                } else {
                    stat.innerHTML = target + plus;
                }
            };

            updateCount();
        });
    }

    // Trigger counter on load or scroll
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animateCounters();
                animated = true;
            }
        }, { threshold: 0.5 });

        observer.observe(heroSection);
    }

    /* --- 6. Copy to Clipboard System --- */
    const copyButtons = document.querySelectorAll('.card-btn-copy');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const copyTextSpan = btn.querySelector('.copy-text');
                const originalText = copyTextSpan ? copyTextSpan.innerText : 'COPY';

                btn.classList.add('copied');
                if (copyTextSpan) copyTextSpan.innerText = 'COPIED!';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (copyTextSpan) copyTextSpan.innerText = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    /* --- 7. Portfolio Lightbox --- */
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg     = document.getElementById('lightboxImg');
    const lightboxClose   = document.getElementById('lightboxClose');
    const lightboxPrev    = document.getElementById('lightboxPrev');
    const lightboxNext    = document.getElementById('lightboxNext');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle   = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxCounter = document.getElementById('lightboxCounter');

    // Collect all visible portfolio cards into a navigable array
    let lightboxItems = [];
    let currentIndex  = 0;

    function buildLightboxItems() {
        lightboxItems = [];
        document.querySelectorAll('.portfolio-card').forEach(card => {
            if (card.style.display === 'none') return;
            const img      = card.querySelector('.card-media img');
            const category = card.querySelector('.card-category');
            const title    = card.querySelector('.card-title');
            const desc     = card.querySelector('.card-desc');
            if (img) {
                lightboxItems.push({
                    src:      img.src,
                    alt:      img.alt,
                    category: category ? category.innerText : '',
                    title:    title    ? title.innerText    : '',
                    location: desc     ? desc.innerText     : ''
                });
            }
        });
    }

    function openLightbox(index) {
        buildLightboxItems();
        currentIndex = index;
        showLightboxItem(currentIndex);
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showLightboxItem(index) {
        const item = lightboxItems[index];
        if (!item) return;

        // Fade transition
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src           = item.src;
            lightboxImg.alt           = item.alt;
            lightboxCategory.innerText = item.category;
            lightboxTitle.innerText   = item.title;
            lightboxLocation.innerText = item.location;
            lightboxCounter.innerText  = `${index + 1} / ${lightboxItems.length}`;
            lightboxImg.style.opacity = '1';
        }, 150);

        // Show/hide arrows
        lightboxPrev.style.opacity = index === 0 ? '0.3' : '1';
        lightboxPrev.style.pointerEvents = index === 0 ? 'none' : 'auto';
        lightboxNext.style.opacity = index === lightboxItems.length - 1 ? '0.3' : '1';
        lightboxNext.style.pointerEvents = index === lightboxItems.length - 1 ? 'none' : 'auto';
    }

    // Attach click to each card
    document.querySelectorAll('.portfolio-card').forEach((card, i) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            buildLightboxItems();
            // Find correct index among currently visible cards
            const visibleCards = [...document.querySelectorAll('.portfolio-card')]
                .filter(c => c.style.display !== 'none');
            const visibleIndex = visibleCards.indexOf(card);
            openLightbox(visibleIndex >= 0 ? visibleIndex : i);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Click outside image to close
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            showLightboxItem(currentIndex);
        }
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < lightboxItems.length - 1) {
            currentIndex++;
            showLightboxItem(currentIndex);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (e.key === 'Escape')       closeLightbox();
        if (e.key === 'ArrowLeft'  && currentIndex > 0)                        { currentIndex--; showLightboxItem(currentIndex); }
        if (e.key === 'ArrowRight' && currentIndex < lightboxItems.length - 1) { currentIndex++; showLightboxItem(currentIndex); }
    });

    // Touch/swipe support
    let touchStartX = 0;
    lightboxOverlay.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightboxOverlay.addEventListener('touchend',   (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) < 50) return;
        if (diff > 0 && currentIndex < lightboxItems.length - 1) { currentIndex++; showLightboxItem(currentIndex); }
        if (diff < 0 && currentIndex > 0)                        { currentIndex--; showLightboxItem(currentIndex); }
    });
});
