document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carrusel-track');
    const cards = document.querySelectorAll('.card-obra');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const carousel = document.querySelector('.carrusel');

    if (!track || cards.length === 0 || !prevBtn || !nextBtn || !carousel) {
        return;
    }

    let offset = 0;
    let autoplayId = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const getCardMetrics = () => {
        const cardWidth = cards[0].offsetWidth;
        const cardStyles = window.getComputedStyle(cards[0]);
        const cardGap = parseFloat(cardStyles.marginLeft) + parseFloat(cardStyles.marginRight);
        const trackStyles = window.getComputedStyle(track);
        const trackGap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');

        return {
            cardWidth,
            step: cardWidth + cardGap + trackGap,
            gap: cardGap + trackGap
        };
    };

    const getVisibleCards = () => {
        const { step, gap } = getCardMetrics();
        const visible = Math.floor((carousel.offsetWidth + gap) / step);
        return Math.max(1, visible);
    };

    const getMaxOffset = () => Math.max(0, cards.length - getVisibleCards());

    const render = () => {
        track.style.transform = `translateX(-${offset * getCardMetrics().step}px)`;
    };

    const moveCarousel = (direction) => {
        const maxOffset = getMaxOffset();

        if (direction === 'next') {
            offset = offset < maxOffset ? offset + 1 : 0;
        } else {
            offset = offset > 0 ? offset - 1 : maxOffset;
        }

        render();
    };

    const stopAutoplay = () => {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    };

    const startAutoplay = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        stopAutoplay();
        autoplayId = setInterval(() => moveCarousel('next'), 3500);
    };

    prevBtn.addEventListener('click', () => moveCarousel('prev'));
    nextBtn.addEventListener('click', () => moveCarousel('next'));

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    carousel.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) < 35) {
            return;
        }

        moveCarousel(diff > 0 ? 'next' : 'prev');
    }, { passive: true });

    window.addEventListener('resize', () => {
        offset = Math.min(offset, getMaxOffset());
        render();
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startAutoplay();
            } else {
                stopAutoplay();
            }
        });
    }, { threshold: 0.35 });

    observer.observe(carousel);
    startAutoplay();
});