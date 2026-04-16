document.addEventListener('DOMContentLoaded', () => {
    // Script para la seccion de lugares
    const trackLugares = document.querySelector('.lugares-track');
    const container = document.querySelector('.lugares-container');

    if (trackLugares && container) {
        const originalContent = trackLugares.innerHTML;
        trackLugares.innerHTML = originalContent.repeat(9);

        const setTrackAnimation = () => {
            const trackWidth = trackLugares.scrollWidth;
            const containerWidth = container.offsetWidth || 1;
            const duration = (trackWidth / containerWidth) * 2; // Ajusta el multiplicador para controlar la velocidad

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                trackLugares.style.animation = 'none';
                return;
            }

            trackLugares.style.animation = `scroll ${duration}s linear infinite`;

            const previousStyle = document.getElementById('dynamic-scroll-keyframes');
            if (previousStyle) {
                previousStyle.remove();
            }

            const style = document.createElement('style');
            style.id = 'dynamic-scroll-keyframes';
            style.innerHTML = `
            @keyframes scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-${trackWidth / 3}px); }
            }`;
            document.head.appendChild(style);
        };

        setTrackAnimation();
        window.addEventListener('resize', setTrackAnimation);
    }

    // Script para el menu hamburguesa
    const toggle = document.querySelector('.menu-toggled');
    const nav = document.querySelector('.ppal-navigation');
    const navBackground = document.querySelector('.nav-background');

    const scrollToAnchorWithOffset = (selector) => {
        const target = document.querySelector(selector);
        if (!target) {
            return;
        }

        const headerOffset = navBackground ? navBackground.getBoundingClientRect().height : 0;
        const targetRect = target.getBoundingClientRect();
        const targetPosition = targetRect.top + window.scrollY;
        const availableViewport = Math.max(window.innerHeight - headerOffset, 0);
        const targetHeight = targetRect.height;

        // Secciones chicas: centradas. Secciones largas: alineadas cerca del inicio para mejor lectura.
        const centeredOffset = Math.max((availableViewport - Math.min(targetHeight, availableViewport)) / 2, 24);
        const sectionOffset = targetHeight > availableViewport ? 16 : centeredOffset;
        const visualBiasUp = 40;
        const lowerAnchors = new Set(['#servicios', '#faq']);
        const lowerSectionOffset = lowerAnchors.has(selector) ? 64 : 0;
        const scrollTop = Math.max(targetPosition - headerOffset - sectionOffset + visualBiasUp - lowerSectionOffset, 0);

        window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    };

    if (toggle && nav) {
        const navLinks = nav.querySelectorAll('a');

        const closeNav = () => {
            nav.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menu de navegacion');
        };

        const openNav = () => {
            nav.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Cerrar menu de navegacion');
        };

        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.contains('show');
            if (isOpen) {
                closeNav();
            } else {
                openNav();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');

                if (href && href.startsWith('#') && document.querySelector(href)) {
                    event.preventDefault();
                    closeNav();
                    requestAnimationFrame(() => {
                        scrollToAnchorWithOffset(href);
                    });
                    return;
                }

                closeNav();
            });
        });

        // Aplica el mismo desplazamiento a enlaces internos fuera del menu principal.
        const internalAnchorLinks = document.querySelectorAll('a[href^="#"]');

        internalAnchorLinks.forEach((link) => {
            if (nav.contains(link)) {
                return;
            }

            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (!href || !document.querySelector(href)) {
                    return;
                }

                event.preventDefault();
                scrollToAnchorWithOffset(href);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeNav();
            }
        });
    }

    // Animaciones de aparicion al hacer scroll
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }
});
