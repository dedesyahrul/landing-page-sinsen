// Initialize AOS Animation
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: function () {
            return window.innerWidth < 768;
        },
    });

    // Mobile Navigation Handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    let lastScrollTop = 0;
    let isNavbarVisible = true;
    let hideNavbarTimeout;
    let lastTouchY = 0;
    let touchStartY = 0;

    // Handle touch gestures for navbar
    if (navbarCollapse) {
        navbarCollapse.addEventListener(
            'touchstart',
            (e) => {
                touchStartY = e.touches[0].clientY;
                lastTouchY = touchStartY;
            },
            { passive: true }
        );

        navbarCollapse.addEventListener(
            'touchmove',
            (e) => {
                const touchY = e.touches[0].clientY;
                const deltaY = touchY - lastTouchY;

                // Prevent overscroll
                if (deltaY > 0 && navbarCollapse.scrollTop <= 0) {
                    e.preventDefault();
                }
                if (
                    deltaY < 0 &&
                    navbarCollapse.scrollTop + navbarCollapse.clientHeight >= navbarCollapse.scrollHeight
                ) {
                    e.preventDefault();
                }

                lastTouchY = touchY;
            },
            { passive: false }
        );
    }

    // Auto-hide navbar on scroll with smooth animation
    function handleNavbarVisibility() {
        const st = window.pageYOffset || document.documentElement.scrollTop;

        if (st > lastScrollTop && st > 100) {
            // Scrolling down - hide navbar with fade out
            if (isNavbarVisible) {
                navbarToggler.style.transform = 'translateY(20px) scale(0.9)';
                navbarToggler.style.opacity = '0';
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
                setTimeout(() => {
                    navbarToggler.style.transform = 'translateY(100px) scale(0.9)';
                }, 300);
                isNavbarVisible = false;
            }
        } else {
            // Scrolling up - show navbar with fade in
            if (!isNavbarVisible) {
                navbarToggler.style.transform = 'translateY(20px) scale(0.9)';
                navbarToggler.style.opacity = '0';
                setTimeout(() => {
                    navbarToggler.style.transform = 'translateY(0) scale(1)';
                    navbarToggler.style.opacity = '1';
                }, 50);
                isNavbarVisible = true;
            }
        }

        lastScrollTop = st;
    }

    // Add smooth transitions
    if (navbarToggler) {
        navbarToggler.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Enhanced hide navbar function with smooth animation
    function hideNavbarAfterScroll() {
        clearTimeout(hideNavbarTimeout);
        hideNavbarTimeout = setTimeout(() => {
            if (window.innerWidth < 992 && window.pageYOffset > 100 && !navbarCollapse.classList.contains('show')) {
                navbarToggler.style.transform = 'translateY(20px) scale(0.9)';
                navbarToggler.style.opacity = '0';
                setTimeout(() => {
                    navbarToggler.style.transform = 'translateY(100px) scale(0.9)';
                }, 300);
                isNavbarVisible = false;
            }
        }, 3000);
    }

    // Add click ripple effect
    navbarToggler.addEventListener('click', function (e) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => ripple.remove(), 600);
    });

    // Close navbar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && !e.target.closest('.navbar') && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });

    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        if (window.innerWidth < 992) {
            handleNavbarVisibility();
            hideNavbarAfterScroll();
        }
    });

    // DOM Elements
    const header = document.querySelector('.header-nav');
    const navbar = document.querySelector('.navbar');
    const logoBar = document.querySelector('.logo-bar');
    const topInfoBar = document.querySelector('.top-info-bar');

    // Scroll Variables
    let isScrollingDown = false;
    let scrollTimeout;
    let ticking = false;

    // Function to handle scroll effects with smooth hide/show
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;

        // Determine scroll direction
        isScrollingDown = scrollDelta > 0;

        // Add classes based on scroll position and direction
        if (scrollTop > 100) {
            header.classList.add('scrolled');

            if (isScrollingDown) {
                header.classList.add('nav-up');
                if (topInfoBar) {
                    topInfoBar.style.marginTop = `-${topInfoBar.offsetHeight}px`;
                }
                // Slight delay before hiding for smoother transition
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (isScrollingDown) {
                        header.classList.add('nav-hidden');
                    }
                }, 150);
            } else {
                header.classList.remove('nav-up', 'nav-hidden');
                if (topInfoBar) {
                    topInfoBar.style.marginTop = '0';
                }
            }

            // Update visual effects based on scroll
            const shadowIntensity = Math.min(scrollTop / 200, 0.15);
            const backgroundOpacity = Math.min(scrollTop / 100, 0.98);

            if (navbar) {
                navbar.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, ${shadowIntensity})`;
            }
            header.style.backgroundColor = `rgba(255, 255, 255, ${backgroundOpacity})`;
        } else {
            header.classList.remove('scrolled', 'nav-up', 'nav-hidden');
            if (navbar) {
                navbar.style.boxShadow = 'none';
            }
            header.style.backgroundColor = '#ffffff';
            if (topInfoBar) {
                topInfoBar.style.marginTop = '0';
            }
        }

        // Update shadow and background intensity based on scroll position
        if (logoBar) {
            logoBar.style.borderBottom = `1px solid rgba(0, 0, 0, ${Math.min(scrollTop / 200, 0.15) * 0.3})`;
        }

        lastScrollTop = scrollTop;
    }

    // Add scroll event listener with throttling
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initialize Hepigo Info Section
    const sidebarLinks = document.querySelectorAll('.hepigo-sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    function switchContent(targetId) {
        // Remove active class from all links and sections
        sidebarLinks.forEach((link) => link.classList.remove('active'));
        contentSections.forEach((section) => {
            section.classList.remove('active');
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        });

        // Add active class to clicked link and corresponding section
        const activeLink = document.querySelector(`[href="#${targetId}"]`);
        const activeSection = document.getElementById(targetId);

        if (activeLink && activeSection) {
            activeLink.classList.add('active');
            activeSection.classList.add('active');

            // Trigger animation after a small delay
            setTimeout(() => {
                activeSection.style.opacity = '1';
                activeSection.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // Add click event listeners to sidebar links
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            switchContent(targetId);

            // Scroll into view on mobile
            if (window.innerWidth < 992) {
                const section = document.getElementById(targetId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Initialize content sections with transition styles
    contentSections.forEach((section) => {
        section.style.transition = 'all 0.3s ease-in-out';
        if (!section.classList.contains('active')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        }
    });

    // Initialize App Steps Carousel
    function initAppStepsCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentSlide = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Update dots
        function updateDots() {
            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Go to specific slide
        function goToSlide(index) {
            currentSlide = index;
            const slideWidth = slides[0].offsetWidth;
            currentTranslate = -slideWidth * currentSlide;
            prevTranslate = currentTranslate;
            setSlidePosition();
            updateDots();
        }

        // Set slide position
        function setSlidePosition() {
            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        // Touch events
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchmove', touchMove);
        track.addEventListener('touchend', touchEnd);

        function touchStart(event) {
            isDragging = true;
            startPos = event.touches[0].clientX;
            track.style.transition = 'none';
        }

        function touchMove(event) {
            if (!isDragging) return;
            const currentPosition = event.touches[0].clientX;
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
            setSlidePosition();
        }

        function touchEnd() {
            isDragging = false;
            track.style.transition = 'transform 0.3s ease';
            const slideWidth = slides[0].offsetWidth;
            const threshold = slideWidth / 4;
            const diff = currentTranslate - prevTranslate;

            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentSlide > 0) {
                    currentSlide--;
                } else if (diff < 0 && currentSlide < slides.length - 1) {
                    currentSlide++;
                }
            }

            currentTranslate = -slideWidth * currentSlide;
            prevTranslate = currentTranslate;
            setSlidePosition();
            updateDots();
        }

        // Auto advance slides
        let autoAdvanceInterval;

        function startAutoAdvance() {
            autoAdvanceInterval = setInterval(() => {
                if (currentSlide < slides.length - 1) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(0);
                }
            }, 5000);
        }

        function stopAutoAdvance() {
            clearInterval(autoAdvanceInterval);
        }

        // Start auto advance and handle visibility changes
        startAutoAdvance();
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoAdvance();
            } else {
                startAutoAdvance();
            }
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                goToSlide(currentSlide);
            }, 100);
        });
    }

    // Initialize carousel if it exists
    if (document.querySelector('.app-steps-carousel')) {
        initAppStepsCarousel();
    }

    // Initialize AOS with responsive settings
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 50,
        delay: 100,
        disable: function () {
            // Disable AOS on mobile for better performance
            return window.innerWidth < 768;
        },
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // Enhanced dropdown and mobile interactions
    function initializeDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        const isMobile = window.innerWidth < 992;

        function setupDesktopBehavior(dropdown) {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.querySelector('.dropdown-menu')?.classList.add('show');
            });
            dropdown.addEventListener('mouseleave', () => {
                dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
            });
        }

        function setupMobileBehavior(dropdown) {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other dropdowns
                    dropdowns.forEach((other) => {
                        if (other !== dropdown) {
                            other.querySelector('.dropdown-menu')?.classList.remove('show');
                        }
                    });

                    menu.classList.toggle('show');
                });
            }
        }

        // Setup behavior based on device type
        dropdowns.forEach((dropdown) => {
            if (isMobile) {
                setupMobileBehavior(dropdown);
            } else {
                setupDesktopBehavior(dropdown);
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item.dropdown')) {
                dropdowns.forEach((dropdown) => {
                    dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
                });
            }
        });
    }

    // Initialize dropdowns
    initializeDropdowns();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeDropdowns();
        }, 250);
    });

    // Mobile optimizations
    function optimizeForMobile() {
        const isMobileView = window.innerWidth < 768;
        const animationDurations = {
            mobile: { coin: '8s', giftBox: '4s' },
            desktop: { coin: '6s', giftBox: '6s' },
        };

        const durations = isMobileView ? animationDurations.mobile : animationDurations.desktop;

        document.querySelectorAll('.coin').forEach((coin) => {
            coin.style.animationDuration = durations.coin;
        });

        document.querySelectorAll('.gift-box').forEach((gift) => {
            gift.style.animationDuration = durations.giftBox;
        });

        // Adjust AOS animations for mobile
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Initialize mobile optimizations
    optimizeForMobile();

    // Handle window resize for mobile optimizations
    let mobileOptimizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(mobileOptimizeTimeout);
        mobileOptimizeTimeout = setTimeout(optimizeForMobile, 250);
    });

    // Touch interactions for mobile devices
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.nav-link, .btn, .card');

        touchElements.forEach((element) => {
            element.addEventListener(
                'touchstart',
                () => {
                    element.style.transform = 'scale(0.98)';
                },
                { passive: true }
            );

            element.addEventListener(
                'touchend',
                () => {
                    element.style.transform = 'scale(1)';
                },
                { passive: true }
            );

            element.addEventListener(
                'touchcancel',
                () => {
                    element.style.transform = 'scale(1)';
                },
                { passive: true }
            );
        });
    }
});
