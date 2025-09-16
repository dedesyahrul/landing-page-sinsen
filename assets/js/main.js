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

    // DOM Elements
    const header = document.querySelector('.header-nav');
    const navbar = document.querySelector('.navbar');
    const logoBar = document.querySelector('.logo-bar');
    const topInfoBar = document.querySelector('.top-info-bar');

    // Scroll Variables
    let lastScrollTop = 0;
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
        contentSections.forEach((section) => section.classList.remove('active'));

        // Add active class to clicked link and corresponding section
        const activeLink = document.querySelector(`[href="#${targetId}"]`);
        const activeSection = document.getElementById(targetId);

        if (activeLink && activeSection) {
            activeLink.classList.add('active');
            activeSection.classList.add('active');
        }
    }

    // Add click event listeners to sidebar links
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            switchContent(targetId);
        });
    });

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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
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
