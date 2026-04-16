document.addEventListener('DOMContentLoaded', () => {
    const preguntas = document.querySelectorAll('.contenedor-preguntas .contenedor-pregunta');

    if (preguntas.length === 0) {
        return;
    }

    preguntas.forEach((pregunta, index) => {
        const trigger = pregunta.querySelector('.pregunta');
        const respuesta = pregunta.querySelector('.respuesta');

        if (!trigger || !respuesta) {
            return;
        }

        const answerId = `respuesta-faq-${index + 1}`;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', answerId);
        respuesta.id = answerId;

        trigger.addEventListener('click', () => {
            const willOpen = !pregunta.classList.contains('activa');

            preguntas.forEach((elementoPreg) => {
                const elementoTrigger = elementoPreg.querySelector('.pregunta');
                elementoPreg.classList.remove('activa');
                if (elementoTrigger) {
                    elementoTrigger.setAttribute('aria-expanded', 'false');
                }
            });

            if (willOpen) {
                pregunta.classList.add('activa');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
});