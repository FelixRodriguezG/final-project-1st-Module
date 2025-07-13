const template = document.createElement('template');
// Paso 1: Define el contenido HTML y CSS del botón scroll-top
template.innerHTML = /*html*/`
  <style>
    .scroll-top {
      position: fixed;
      bottom: 5rem;
      right: 5rem;
      background: var(--color-primary, #001aff);
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      border: none;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: float 2.5s cubic-bezier(0.68, 1.45, 1, 1) infinite;
    }

    .scroll-top.visible {
      opacity: 1;
      visibility: visible;
    }

    .scroll-top:hover {
      transform: translateY(-3px);
      background: var(--color-primary-accent, #0015d3);
      animation-play-state: paused
    }

    .arrow {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 12px solid white;
    }

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      20% {
        transform: translateY(-5px);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
      80% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(0);
      }
    }
  </style>

  <button class="scroll-top" aria-label="Go to top" title="Go to top">
    <span class="arrow" aria-hidden="true"></span>
  </button>
`;

// Paso 2: El template se usará para crear el contenido del shadow DOM en el componente ScrollToTop

class ScrollToTop extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector('.scroll-top');
    
    // Mostrar/ocultar botón basado en scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    });

    // Scroll suave al hacer clic
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

customElements.define('scroll-top', ScrollToTop);
export { ScrollToTop };