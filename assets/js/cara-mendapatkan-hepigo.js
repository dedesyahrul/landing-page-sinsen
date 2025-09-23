document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.content-carousel');
    const track = document.querySelector('.content-track');
    const slides = document.querySelectorAll('.content-slide');
    const dots = document.querySelectorAll('.content-dot');
    // Removed navigation buttons

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
    const TOUCH_DELAY = 300; // Delay antara touch events dalam ms

    // Initialize
    function init() {
        // Set initial state
        updateCarousel();

        // Removed navigation button initialization

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

        // Removed arrow visibility update
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
            return; // Ignore touches that are too close together
        }
        lastTouchTime = now;

        isDragging = true;
        isScrolling = false;
        startX = event.type === 'mousedown' ? event.pageX : event.touches[0].pageX;
        startY = event.type === 'mousedown' ? event.pageY : event.touches[0].pageY;
        startPos = currentTranslate;
        startTime = now;

        // Stop any ongoing animation
        cancelAnimationFrame(animationId);

        // Remove transition during drag
        track.style.transition = 'none';
    }

    function touchMove(event) {
        if (!isDragging) return;

        const currentX = event.type === 'mousemove' ? event.pageX : event.touches[0].pageX;
        const currentY = event.type === 'mousemove' ? event.pageY : event.touches[0].pageY;

        // Hitung perpindahan X dan Y
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // Deteksi arah scroll pada awal gerakan
        if (!isScrolling && Math.abs(diffY) > Math.abs(diffX)) {
            isScrolling = true;
            isDragging = false;
            return;
        }

        // Jika sedang scroll vertikal, hentikan slide
        if (isScrolling) return;

        // Prevent default hanya jika gerakan horizontal
        event.preventDefault();

        // Tambahkan resistance saat di ujung carousel
        let resistance = 1;
        if ((currentIndex === 0 && diffX > 0) || (currentIndex === slides.length - 1 && diffX < 0)) {
            resistance = 0.25; // Lebih sulit untuk di-drag di ujung
        }

        currentTranslate = startPos + diffX * resistance;

        // Limit the drag to the next/previous slide only
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
        const threshold = carousel.offsetWidth * 0.2; // Turunkan threshold ke 20%

        // Tambahkan minimum velocity untuk swipe
        const endTime = new Date().getTime();
        const timeElapsed = endTime - startTime;
        const velocity = Math.abs(movedBy) / timeElapsed;

        // Jika gerakan terlalu kecil, kembali ke posisi awal
        if (Math.abs(movedBy) < 10) {
            updateCarousel();
            return;
        }

        // Jika velocity tinggi (swipe cepat) atau threshold tercapai
        if ((velocity > 0.3 || Math.abs(movedBy) > threshold) && movedBy < 0 && currentIndex < slides.length - 1) {
            nextSlide();
        } else if ((velocity > 0.3 || Math.abs(movedBy) > threshold) && movedBy > 0 && currentIndex > 0) {
            prevSlide();
        } else {
            // Animasi kembali ke posisi awal jika tidak memenuhi threshold
            updateCarousel();
        }
    }

    // Event Listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Removed navigation button event listeners

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

    // Removed autoplay functionality for manual navigation only
});
