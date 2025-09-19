document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.content-carousel');
    const track = document.querySelector('.content-track');
    const slides = document.querySelectorAll('.content-slide');
    const dots = document.querySelectorAll('.content-dot');
    const prevButton = document.querySelector('.content-nav-arrow.prev');
    const nextButton = document.querySelector('.content-nav-arrow.next');

    let currentIndex = 0;
    let startX;
    let isDragging = false;
    let startPos;
    let animationId;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Initialize
    function init() {
        // Set initial state
        updateCarousel();

        // Hide prev button initially
        prevButton.style.display = 'none';

        // Add active class to first slide
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

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update arrow visibility
        prevButton.style.display = currentIndex === 0 ? 'none' : 'flex';
        nextButton.style.display = currentIndex === slides.length - 1 ? 'none' : 'flex';
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
        isDragging = true;
        startX = event.type === 'mousedown' ? event.pageX : event.touches[0].pageX;
        startPos = currentTranslate;

        // Stop any ongoing animation
        cancelAnimationFrame(animationId);

        // Remove transition during drag
        track.style.transition = 'none';
    }

    function touchMove(event) {
        if (!isDragging) return;

        const currentX = event.type === 'mousemove' ? event.pageX : event.touches[0].pageX;
        const diff = currentX - startX;
        currentTranslate = startPos + diff;

        // Limit the drag to the next/previous slide only
        const maxTranslate = 0;
        const minTranslate = -(slides.length - 1) * carousel.offsetWidth;
        currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);

        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        isDragging = false;
        const movedBy = currentTranslate - startPos;

        // If moved enough negative, next slide
        if (movedBy < -100 && currentIndex < slides.length - 1) {
            nextSlide();
        }
        // If moved enough positive, prev slide
        else if (movedBy > 100 && currentIndex > 0) {
            prevSlide();
        }
        // If not moved enough, revert to current slide
        else {
            updateCarousel();
        }
    }

    // Event Listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

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

    // Optional: Auto-play functionality
    let autoplayInterval;
    const AUTOPLAY_DELAY = 5000;

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                nextSlide();
            } else {
                goToSlide(0);
            }
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Start autoplay and handle pause on hover/touch
    startAutoplay();

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay);
    carousel.addEventListener('touchend', startAutoplay);
});
