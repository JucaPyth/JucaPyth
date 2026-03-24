/**
 * ════════════════════════════════════════════════════════════════
 * MULTITECKNO SOLUCIONES TÉCNICAS — app.js
 * Funcionalidades:
 *   1. Menú móvil (hamburger)
 *   2. Scroll suave + cierre del menú al hacer clic en un enlace
 *   3. Botón flotante de WhatsApp (mostrar/ocultar al hacer scroll)
 *   4. Año automático en el footer
 *   5. Animación de aparición al hacer scroll (Intersection Observer)
 *   6. Envío del formulario de contacto (demo / listo para Formspree)
 *   7. Highlight de la sección activa en el menú de navegación
 * ════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────────
     1. MENÚ MÓVIL — Hamburger toggle
     ────────────────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      navMobile.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      navMobile.setAttribute('aria-hidden',   String(!isOpen));
    });

    // Cerrar el menú al hacer clic en cualquier enlace interno
    navMobile.querySelectorAll('.nav-mobile__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        navMobile.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
      });
    });

    // Cerrar menú si el usuario hace clic fuera de él
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        hamburger.classList.remove('is-open');
        navMobile.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
      }
    });
  }


  /* ──────────────────────────────────────────────────────────────
     2. BOTÓN FLOTANTE WHATSAPP
        - Se oculta los primeros 80px (página en el inicio)
        - Aparece suavemente al hacer scroll hacia abajo
     ────────────────────────────────────────────────────────────── */
  const waFloat = document.getElementById('wa-float');

  if (waFloat) {
    // Ocultar inicialmente
    waFloat.style.opacity   = '0';
    waFloat.style.transform = 'translateY(20px) scale(0.9)';
    waFloat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    waFloat.style.pointerEvents = 'none';

    const toggleWaFloat = () => {
      const scrolled = window.scrollY > 80;
      waFloat.style.opacity       = scrolled ? '1' : '0';
      waFloat.style.transform     = scrolled ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)';
      waFloat.style.pointerEvents = scrolled ? 'auto' : 'none';
    };

    window.addEventListener('scroll', toggleWaFloat, { passive: true });
    toggleWaFloat(); // Comprobar estado al cargar
  }


  /* ──────────────────────────────────────────────────────────────
     3. AÑO AUTOMÁTICO EN EL FOOTER
     ────────────────────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ──────────────────────────────────────────────────────────────
     4. ANIMACIONES DE SCROLL — Intersection Observer
        Añade la clase .reveal a los elementos que quieras animar
        y .is-visible cuando entran en pantalla.
     ────────────────────────────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.svc-card, .why-item, .trust-item, .testimonial, .gallery__item, .equip-banner'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    // Añadir clase reveal a todos los elementos animables
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger: pequeño retraso escalonado por columna/fila
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Solo animar una vez
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // Fallback: mostrar todo si el navegador no soporta IntersectionObserver
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }


  /* ──────────────────────────────────────────────────────────────
     5. HEADER — Sombra al hacer scroll
     ────────────────────────────────────────────────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,.35)'
        : '0 2px 16px rgba(0,0,0,.25)';
    }, { passive: true });
  }


  /* ──────────────────────────────────────────────────────────────
     6. HIGHLIGHT DE SECCIÓN ACTIVA EN NAV
        (marca el enlace del menú según la sección visible)
     ────────────────────────────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id], div[id="nosotros"]');
  const navLinks    = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.style.color       = link.getAttribute('href') === `#${id}` ? 'var(--c-green)' : '';
              link.style.borderColor = link.getAttribute('href') === `#${id}` ? 'var(--c-green)' : 'transparent';
            });
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach(s => sectionObserver.observe(s));
  }


  /* ──────────────────────────────────────────────────────────────
     7. FORMULARIO DE CONTACTO
     ────────────────────────────────────────────────────────────────
     OPCIONES PARA HACERLO REAL:
     A) Formspree (gratis, fácil):
        - Ve a https://formspree.io → crea una cuenta → nuevo formulario
        - Copia tu endpoint (ej: https://formspree.io/f/xyzabc123)
        - Reemplaza FORMSPREE_URL abajo con tu endpoint real
     B) EmailJS (gratis):
        - Ve a https://www.emailjs.com
        - Sigue la guía de configuración y reemplaza la lógica abajo
     ────────────────────────────────────────────────────────────── */

  const FORMSPREE_URL = 'https://formspree.io/f/TU_ID_AQUI'; // ← Reemplaza con tu ID de Formspree

  const contactForm   = document.getElementById('contact-form');
  const formSuccess   = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      // Estado de carga
      submitBtn.disabled     = true;
      submitBtn.textContent  = 'Enviando…';

      const formData = new FormData(contactForm);

      try {
        // ── Opción A: Formspree ──
        // Descomenta y configura si usas Formspree:
        /*
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error('Error al enviar');
        */

        // ── Demo (sin backend) — Simula envío exitoso ──
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simula latencia

        // Éxito
        contactForm.reset();
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { formSuccess.hidden = true; }, 6000);
        }

        // Alternativa: redirigir a WhatsApp con los datos del formulario
        // Descomenta las siguientes líneas si prefieres esto:
        /*
        const name    = formData.get('name');
        const service = formData.get('service');
        const msg     = formData.get('message');
        const waText  = encodeURIComponent(`Hola Multiteckno, soy ${name}. Necesito servicio de ${service}: ${msg}`);
        window.open(`https://wa.me/573043906621?text=${waText}`, '_blank', 'noopener');
        */

      } catch (err) {
        console.error('Error al enviar formulario:', err);
        alert('Hubo un problema al enviar tu mensaje. Por favor llámanos directamente: 304 390 6621');
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = originalText;
      }
    });
  }


  /* ──────────────────────────────────────────────────────────────
     8. NÚMERO DE TELÉFONO — formato amigable al pasar hover
        (pequeño feedback visual en los links de teléfono)
     ────────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.title = 'Toca para llamar directamente';
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
    el.title = 'Abrir chat en WhatsApp';
  });


  /* ──────────────────────────────────────────────────────────────
     9. GALERÍA — Modal de imagen ampliada (opcional)
        Descomenta si agregas fotos reales.
        Cómo usar: añade clase .gallery__item--real y un <img> dentro.
     ────────────────────────────────────────────────────────────── */
  /*
  document.querySelectorAll('.gallery__item--real').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.85);
        display:flex; align-items:center; justify-content:center; cursor:zoom-out;
      `;
      const bigImg = img.cloneNode();
      bigImg.style.cssText = 'max-width:90vw; max-height:90vh; border-radius:8px;';
      overlay.appendChild(bigImg);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
  */


  // ── Log de carga exitosa en consola (solo desarrollo) ──
  console.log('%c✅ MULTITECKNO | app.js cargado correctamente', 'color:#4CAF50;font-weight:bold;font-size:14px;');

}); // Fin DOMContentLoaded
