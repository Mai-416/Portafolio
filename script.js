document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. MENÚ MÓVIL Y BARRA DE PROGRESO DE SCROLL
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollProgress = document.getElementById('scroll-progress');

  /* ==========================================================================
     CONTROL DE MODO CLARO / OSCURO (THEME TOGGLE)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Verificar preferencia guardada o del sistema operativo
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '☀️';
  }

  // Evento click para alternar temas
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);

      if (themeIcon) {
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
      }
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('show');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  }, { passive: true });

  /* ==========================================================================
     2. EFECTO MÁQUINA DE ESCRIBIR (TYPEWRITER)
     ========================================================================== */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Desarrollo de Software',
    'Redes & Cisco CCNA',
    'Administración Linux & Bash',
    'Bases de Datos Oracle & MySQL'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typewriterEl) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 1800; // Pausa al terminar de escribir
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 350;
    }

    setTimeout(typeEffect, speed);
  }
  typeEffect();

  /* ==========================================================================
     3. TERMINAL LINUX INTERACTIVA (maily@ucsg)
     ========================================================================== */
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  const commands = {
    help: 'Comandos disponibles: [whoami] [skills] [proyectos] [certificados] [contacto] [clear]',
    whoami: 'Tifany Maily Franco Acurio (Maily) — Estudiante de Ingeniería en Ciencias de la Computación en la UCSG (Guayaquil, Ecuador).',
    skills: 'Lenguajes: Java, JS, Python, C++, Bash | Redes: Linux WSL, CCNA, Packet Tracer | BD: Oracle SQL, MySQL, PL/SQL.',
    proyectos: '1) Sistema.sh (Automatización Bash) | 2) Análisis CVE-2026-53359 (Ubuntu) | 3) Modelos Financieros DuPont.',
    certificados: 'Desplázate a la sección #certificados para abrir o descargar mis PDFs de cursos y charlas.',
    contacto: 'GitHub: github.com/Mai-416 | Email: tifany.franco@cu.ucsg.edu.ec'
  };

  function runCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    const cmdLine = document.createElement('p');
    cmdLine.className = 'cmd-line';
    cmdLine.innerHTML = `<span class="prompt">maily@ucsg:~$</span> ${cmd}`;

    const responseLine = document.createElement('p');
    responseLine.className = 'cmd-response';
    responseLine.textContent = commands[cmd] || `bash: ${cmd}: comando no encontrado. Escribe 'help' para ver la lista.`;

    terminalOutput.appendChild(cmdLine);
    terminalOutput.appendChild(responseLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        runCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  cmdChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      runCommand(cmd);
    });
  });

  /* ==========================================================================
     4. FILTRO DE CERTIFICADOS Y VISOR MODAL DE PDF
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      certCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Modal PDF
  const pdfModal = document.getElementById('pdf-modal');
  const pdfIframe = document.getElementById('pdf-iframe');
  const pdfModalTitle = document.getElementById('pdf-modal-title');
  const pdfModalDownload = document.getElementById('pdf-modal-download');
  const pdfModalClose = document.getElementById('pdf-modal-close');
  const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');
  const previewBtns = document.querySelectorAll('.preview-pdf-btn');

  function openPdfModal(pdfUrl, title) {
    if (!pdfModal || !pdfIframe) return;
    pdfModalTitle.textContent = title;
    pdfIframe.src = pdfUrl;
    pdfModalDownload.href = pdfUrl;
    pdfModal.classList.add('open');
    pdfModal.setAttribute('aria-hidden', 'false');
  }

  function closePdfModal() {
    if (!pdfModal || !pdfIframe) return;
    pdfModal.classList.remove('open');
    pdfModal.setAttribute('aria-hidden', 'true');
    pdfIframe.src = '';
  }

  previewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pdfUrl = btn.getAttribute('data-pdf');
      const title = btn.getAttribute('data-title');
      openPdfModal(pdfUrl, title);
    });
  });

  if (pdfModalClose) pdfModalClose.addEventListener('click', closePdfModal);
  if (pdfModalBackdrop) pdfModalBackdrop.addEventListener('click', closePdfModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('open')) {
      closePdfModal();
    }
  });

  /* ==========================================================================
     5. EFECTO SPOTLIGHT EN TARJETAS Y COPIADO DE CORREO
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Botón para copiar correo institucional
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText.textContent.trim()).then(() => {
        copyEmailBtn.textContent = '¡Copiado!';
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copiar';
        }, 2500);
      });
    });
  }

  /* ==========================================================================
     6. INTERSECTION OBSERVER (ANIMACIONES AL HACER SCROLL) Y FORMULARIO
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Formulario de Contacto
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      formStatus.textContent = `¡Gracias, ${name}! Tu mensaje está listo para enviarse a tifany.franco@cu.ucsg.edu.ec.`;
      contactForm.reset();
      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);
    });
  }
});