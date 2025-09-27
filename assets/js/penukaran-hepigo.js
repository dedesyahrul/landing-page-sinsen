document.addEventListener('DOMContentLoaded', function () {
    // Initialize Poin Carousel when content is shown
    let poinCarouselInitialized = false;
    let levelCarouselInitialized = false;

    function initializeCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const track = carousel;
        const slides = carousel.querySelectorAll('.penukaran-slide');
        const dotsContainer = document.querySelector('.penukaran-nav');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.penukaran-dot') : [];

        let currentIndex = 0;
        let startX;
        let startY;
        let isDragging = false;
        let startPos;
        let animationId;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let startTime;
        let isScrolling = false;
        let lastTouchTime = 0;
        const TOUCH_DELAY = 300;

        // Initialize
        function init() {
            updateCarousel();
            slides[0].classList.add('active');
        }

        // Update carousel position and state
        function updateCarousel(animation = true) {
            const translateX = -currentIndex * 100;

            if (animation) {
                track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                track.style.transition = 'none';
            }

            track.style.transform = `translateX(${translateX}%)`;

            // Update active states
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update dots if they exist
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }

        // Navigation functions
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Touch events
        function touchStart(event) {
            const now = new Date().getTime();
            if (now - lastTouchTime < TOUCH_DELAY) {
                return;
            }
            lastTouchTime = now;

            isDragging = true;
            isScrolling = false;
            startX = event.type === 'mousedown' ? event.pageX : event.touches[0].pageX;
            startY = event.type === 'mousedown' ? event.pageY : event.touches[0].pageY;
            startPos = currentTranslate;
            startTime = now;

            cancelAnimationFrame(animationId);
            track.style.transition = 'none';
        }

        function touchMove(event) {
            if (!isDragging) return;

            const currentX = event.type === 'mousemove' ? event.pageX : event.touches[0].pageX;
            const currentY = event.type === 'mousemove' ? event.pageY : event.touches[0].pageY;

            const diffX = currentX - startX;
            const diffY = currentY - startY;

            if (!isScrolling && Math.abs(diffY) > Math.abs(diffX)) {
                isScrolling = true;
                isDragging = false;
                return;
            }

            if (isScrolling) return;

            event.preventDefault();

            let resistance = 1;
            if ((currentIndex === 0 && diffX > 0) || (currentIndex === slides.length - 1 && diffX < 0)) {
                resistance = 0.25;
            }

            currentTranslate = startPos + diffX * resistance;

            const maxTranslate = 0;
            const minTranslate = -(slides.length - 1) * carousel.offsetWidth;
            currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);

            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        function touchEnd() {
            if (!isDragging) return;

            isDragging = false;
            isScrolling = false;

            const movedBy = currentTranslate - startPos;
            const threshold = carousel.offsetWidth * 0.2;

            const endTime = new Date().getTime();
            const timeElapsed = endTime - startTime;
            const velocity = Math.abs(movedBy) / timeElapsed;

            if (Math.abs(movedBy) < 10) {
                updateCarousel();
                return;
            }

            if ((velocity > 0.3 || Math.abs(movedBy) > threshold) && movedBy < 0 && currentIndex < slides.length - 1) {
                nextSlide();
            } else if ((velocity > 0.3 || Math.abs(movedBy) > threshold) && movedBy > 0 && currentIndex > 0) {
                prevSlide();
            } else {
                updateCarousel();
            }
        }

        // Event Listeners
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    dots.forEach((d, i) => {
                        d.classList.toggle('active', i === index);
                    });
                });
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Touch and mouse events
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('touchmove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('touchend', touchEnd);
        track.addEventListener('mouseleave', touchEnd);

        // Prevent context menu on long press
        track.addEventListener('contextmenu', (e) => e.preventDefault());

        // Initialize carousel
        init();

        // Add resize handler
        window.addEventListener('resize', () => {
            updateCarousel(false);
        });
    }

    // Toggle carousel function
    window.toggleCarousel = function (target) {
        // Get target content and button
        const targetContent = document.getElementById(target + 'Content');
        const targetButton = document.querySelector(`[data-target="${target}"]`);

        if (!targetContent || !targetButton) return;

        // Check if the clicked button is already active
        const isCurrentlyActive = targetButton.classList.contains('active');

        // Hide all carousel contents and remove active class from all buttons
        const allContents = document.querySelectorAll('.carousel-content');
        const allButtons = document.querySelectorAll('.penukaran-option');

        allContents.forEach((content) => {
            content.style.display = 'none';
            content.classList.remove('show');
        });

        allButtons.forEach((button) => {
            button.classList.remove('active');
        });

        // If the clicked button wasn't active, show its content
        if (!isCurrentlyActive) {
            targetContent.style.display = 'block';
            targetButton.classList.add('active');

            // Add small delay before adding show class for animation
            setTimeout(() => {
                targetContent.classList.add('show');
            }, 10);

            // Initialize carousel if needed
            if (target === 'hepigoPoin' && !poinCarouselInitialized) {
                initializeCarousel('poinCarousel');
                poinCarouselInitialized = true;
            } else if (target === 'kalkulasiLevel' && !levelCarouselInitialized) {
                levelCarouselInitialized = true;
            }
        }
    };

    // Add active state styling for buttons
    const style = document.createElement('style');
    style.textContent = `
        .penukaran-option.active {
            background: linear-gradient(135deg, #ff4d4d 0%, #e83e4c 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
        }
        .penukaran-option.active .option-icon {
            transform: translateX(3px);
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
});
