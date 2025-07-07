class CustomNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
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
          display: flex;
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

        /* Versión Desktop por defecto */
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
        }

        .links a:hover {
          color: var(--color-primary---default, #072ac8);
        }

        .links a.active {
          color: var(--color-primary---default, #072ac8);
          font-weight: var(--font-weight---bold);
          position: relative;
        }

        /* Opcional: añadir una línea debajo del link activo */
        .links a.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-primary---default, #072ac8);
        }

        .cta {
          display: block;
        }

        .cta .btn {
          background: var(--color-primary---default, #072ac8);
          color: white;
          font-weight: var(--font-weight---bold);
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .cta .btn:hover {
          background: var(--color-secondary---accent, #0022cc);
          color: var(--color-primary---default, #072ac8);;
        }

        /* Ocultar elementos móviles en desktop */
        .menu-toggle {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        /* Estilos móviles */
        @media (max-width: 768px) {
          .links, .cta {
            display: none;
          }

          .menu-toggle {
            display: block;
            font-size: 2rem;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-neutral---dark, #292e47);
          }

          .mobile-menu {
            display: none;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 2rem;
            background: var(--color-neutral---light, #f5f6fc);
            border-top: 1px solid rgba(0,0,0,0.1);
          }

          .mobile-menu.show {
            display: flex;
          }

          .mobile-menu a {
            color: var(--color-neutral---dark, #292e47);
            text-decoration: none;
            width: fit-content;
            font-weight: 500;
            padding: 0.5rem 0;
          }
          .mobile-menu a.active {
            color: var(--color-primary---default, #072ac8);
            font-weight: var(--font-weight---bold);
            position: relative;
          }

          .mobile-menu a.active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--color-primary---default, #072ac8);
          }

          .mobile-menu .btn {
            background: var(--color-primary---default, #072ac8);
            color: white;
            padding: 0.75rem 1.5rem;
            width: fit-content;
            text-align: center;
            border-radius: 4px;
          }
        }
      </style>

      <nav>
        <div class="logo"><a href="/">${logoHTML}</a></div>

        <div class="links">
          ${links.map((link, index) =>
      `<a href="${link.href}" class="${index === 0 ? 'active' : ''}">${link.text}</a>`)
        .join('')}
        </div>

        <div class="cta">
          ${btn ? `<a href="${btn.href}" class="btn">${btn.text}</a>` : ''}
        </div>

        <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false">&#9776;</button>
      </nav>

      <div class="mobile-menu">
        ${links.map((link, index) =>
          `<a href="${link.href}" class="${index === 0 ? 'active' : ''}">${link.text}</a>`
        ).join('')}
        ${btn ? `<a href="${btn.href}" class="btn">${btn.text}</a>` : ''}
      </div>
    `;

    // Funcionalidad del menú móvil y links activos
    const toggleBtn = this.shadowRoot.querySelector('.menu-toggle');
    const mobileMenu = this.shadowRoot.querySelector('.mobile-menu');
    const allLinks = this.shadowRoot.querySelectorAll('.links a, .mobile-menu a');

    // Manejo de links activos
    allLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        allLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        mobileMenu.classList.remove('show');
      });
    });

    // Toggle menú móvil
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('show');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }
}

customElements.define('custom-navbar', CustomNavbar);
export { CustomNavbar };