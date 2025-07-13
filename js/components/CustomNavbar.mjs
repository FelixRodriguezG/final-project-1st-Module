class CustomNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const logo = this.dataset.logo || '';
    let links = [];
    let btn = null;

    try {
      links = JSON.parse(this.dataset.links || '[]');
      btn = this.dataset.btn ? JSON.parse(this.dataset.btn) : null;
    } catch (e) {
      console.warn('Error al parsear los datos del navbar', e);
    }

    const logoHTML = /\.(png|jpe?g|svg|webp)$/.test(logo)
      ? `<img src="${logo}" alt="Logo">`
      : `<span>${logo}</span>`;

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        nav {
          position: relative; 
          display: flex;
          z-index: 10;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: var(--color-neutral---light, #f5f6fc);
        }

        .logo {
          font-weight: bold;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .logo img {
          height: 30px;
        }

        .links {
          display: flex;
          gap: 2rem;
        }

        .links a {
          color: var(--color-neutral---medium, #292e47);
          text-decoration: none;
          font-size: var(--font-size-text---sm);
          font-weight: var(--font-weight---bold);
          transition: color 0.3s ease;
          position: relative;
        }

        .links a:hover,
        .mobile-menu a:hover {
          color: var(--color-primary---default, #072ac8);
        }

        /* 🔹 Estilo para enlace activo (solo enlaces normales, no botones) */
        .links a.active:not(.btn),
        .mobile-menu a.active:not(.btn) {
          color: var(--color-primary---default, #072ac8);
          font-weight: var(--font-weight---bold);
        }

        .links a.active:not(.btn)::after,
        .mobile-menu a.active:not(.btn)::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-primary---default, #072ac8);
        }

        .cta .btn,
        .mobile-menu .btn {
          background: var(--color-primary---default, #072ac8);
          color: white;
          font-weight: var(--font-weight---bold);
          border: 2px solid var(--color-primary---default, #072ac8);
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background: transparent;
          color: var(--color-primary---default, #072ac8);
        }

        .btn:active {
          background: var(--color-primary-accent, #43d2ff);
          border: 2px solid var(--color-primary---default, #072ac8);
          color: var(--color-primary---default, #072ac8);
        }

        .menu-toggle {
          display: none;
          font-size: 2rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .menu-toggle.open {
        transform: rotate(90deg);
        font-size: 3rem; /* o 3rem si la quieres aún más grande */
        }     

        .mobile-menu {
        position: fixed;
        top: 100px; /* Ajusta si tu navbar es más alto */
        left: 0;
        right: 0;
        z-index: 999;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 2rem;
        background: var(--color-neutral---light, #f5f6fc);
        border-top: 1px solid rgba(0, 0, 0, 0.1);      
        opacity: 0;
        transform: translateY(-10px);
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
        }

        .mobile-menu.show {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
        pointer-events: auto;
        }

        .mobile-menu a {
          color: var(--color-neutral---dark, #292e47);
          text-decoration: none;
          width: fit-content;
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
        }

        @media (max-width: 768px) {
          .links, .cta {
            display: none;
          }

          .menu-toggle {
            display: block;
            color: var(--color-neutral---dark, #292e47);
          }
        }
      </style>

      <nav role="navigation" aria-label="Menú principal">
        <div class="logo" tabindex="0"><a href="/">${logoHTML}</a></div>

        <div class="links">
          ${links.map(link => `<a href="${link.href}">${link.text}</a>`).join('')}
        </div>

        <div class="cta">
          ${btn ? `<a href="${btn.href}" class="btn" tabindex="0">${btn.text}</a>` : ''}
        </div>

        <button class="menu-toggle" aria-label="Abrir menú" aria-controls="mobile-menu" aria-expanded="false">&#9776;</button>
      </nav>

      <div id="mobile-menu" class="mobile-menu">
        ${links.map(link => `<a href="${link.href}">${link.text}</a>`).join('')}
        ${btn ? `<a href="${btn.href}" class="btn" tabindex="0">${btn.text}</a>` : ''}
      </div>
    `;

    const toggleBtn = this.shadowRoot.querySelector('.menu-toggle');
    const mobileMenu = this.shadowRoot.querySelector('.mobile-menu');
    const allLinks = this.shadowRoot.querySelectorAll('.links a, .mobile-menu a');

    // ✅ Enlace activo según la URL
    const currentPath = window.location.pathname;
    allLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath && !link.classList.contains('btn')) {
        link.classList.add('active');
      }
    });

    // ✅ Clic en enlaces
    allLinks.forEach(linkElement => {
      linkElement.addEventListener('click', (event) => {
        const hrefClicado = event.target.getAttribute('href');

        allLinks.forEach(otherLink => {
          const hrefActual = otherLink.getAttribute('href');

          if (hrefActual === hrefClicado && !otherLink.classList.contains('btn')) {
            otherLink.classList.add('active');
          } else {
            otherLink.classList.remove('active');
          }
        });

        // 🔒 Cierra el menú móvil
        mobileMenu.classList.remove('show');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', false);
        toggleBtn.innerHTML = '&#9776;';
      });
    });

    // ✅ Toggle del menú
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('show');
      toggleBtn.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // ❌ Cierra si haces clic fuera
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        mobileMenu.classList.remove('show');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', false);
        toggleBtn.innerHTML = '&#9776;';
      }
    });

    // ❌ Cierra con ESC
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileMenu.classList.remove('show');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', false);
        toggleBtn.innerHTML = '&#9776;';
      }
    });

    // ✅ Cierra el menú si se redimensiona a pantalla grande
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        mobileMenu.classList.remove('show');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', false);
        toggleBtn.innerHTML = '&#9776;';
      }
    })
  }


}

customElements.define('custom-navbar', CustomNavbar);
export { CustomNavbar };
