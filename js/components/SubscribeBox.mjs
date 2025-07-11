const style = /*CSS*/
  `
    .subscribe-container {
      text-align: center;
      position: relative;
      width:100%;
      margin: 0 auto;
      max-width: 1200px !important;
      height: 500px !important;
      margin: 0 auto;
      background-color: var(--color-secondary, #ffe600);
      position: relative;
      display: flex;
      flex-direction:column;
      justify-content:center;
      gap:3rem;
  
    }
  
    ::slotted(h2) {
      font-size: clamp(1.5rem, 2vw, var(--font-size-h2));
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
  
    ::slotted(p) {
      margin-bottom: 2rem;
      color: #222;
      font-size: 1rem;
    }
  
    form {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .input-icon {
      display: flex;
      align-items: center;
      width: clamp(200px, 40%, 480px);
      padding: 0.5rem 1rem;
      background: white;
      height: 48px;
    }
    
    .input-icon input {
      width: 100%;
      border: none;
      outline: none;
      padding: 0.5rem;
      font-size: 1rem;
    }
    
    .newsletter__icon {
      width: 24px;
      height: 24px;
      margin-right: 0.5rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
    }
  
    .subscribe-btn {
      background-color: #001aff;
      color: white;
      padding: 0 1.5rem;
      border: none;
      cursor: pointer;
      font-weight: var(--font-weight-bold, 700);
      font-size: var(--font-size-sm, 1rem);
      transition: 
      background-color 0.2s ease,
      color 0.2s ease;
    }
  
    .subscribe-btn:hover {
      background-color: var(--color-primary-hovery, #a2d6f9);
      color: var(--color-secondary-hover, #001aff);
    }
  
    .error-message {
      position:absolute;
      color: red;
      font-size: 1rem;
      bottom: 15%;
      left: 40%;
      transform: translate(-50%, -50%); 
    }
  
    .modal {
      position: fixed;
      inset: 0;
      background-color: rgba(0,0,0,0.5);
      display: none;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold, 700);
    }
  
    .modal.active {
      display: flex;
    }
  
    .modal-content {
      text-align: center;
      background: var(--color-secondary, #ffe600);
      padding: 2rem;
      font-size: var(--font-size-h2, 1.5rem);
      max-width: 550px;
      width: 100%;
    }
  
    .modal-content button {
      font-size: var(--font-size-md, 1.2rem);
      margin-top: 1rem;
      background-color: #001aff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

  
`;
const template = document.createElement('template');
template.innerHTML = /*html*/
  `
  <style>${style}</style>
  <div class="subscribe-container">
    <slot name="title"><h2>Subscribe</h2></slot>
    <slot name="subtitle"><p>Get updates to your inbox</p></slot>
    <form novalidate>
      <label class="input-icon">
        <span class="icon-slot"></span>
        <span class="sr-only">Email</span>
        <input type="email" name="email" placeholder="Enter your email" required />
      </label>
      <button type="submit" class="subscribe-btn">Subscribe</button>
    </form>
    <div class="error-message" aria-live="polite"></div>
  </div>

  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-content">
      <p>Thank you for subscribing! 😀</p>
      <button type="button" class="close-modal">Close</button>
    </div>
  </div>
`;

class SubscribeBox extends HTMLElement {
  constructor() {
    super();
    // Crea el Shadow DOM (modo abierto) y clona el contenido del template dentro.
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Referencias shadowDOM
    const form = this.shadowRoot.querySelector('form');
    const error = this.shadowRoot.querySelector('.error-message');
    const modal = this.shadowRoot.querySelector('.modal');
    const closeBtn = this.shadowRoot.querySelector('.close-modal');
    const input = this.shadowRoot.querySelector('input[type="email"]');

    // Obtener atributos data
    const bg = this.getAttribute('data-bg') ?? '#ffe600';
    const btnText = this.getAttribute('data-btn-text') ?? 'Subscribe';
    const action = this.getAttribute('data-action') ?? 'https://';
    const icon = this.getAttribute('data-icon');

    // Y los aplicamos aquí
    this.style.backgroundColor = bg;
    this.shadowRoot.querySelector('.subscribe-btn').textContent = btnText;
    form.setAttribute('action', action);

    const iconSlot = this.shadowRoot.querySelector('.icon-slot');
    if (icon) {
      iconSlot.innerHTML = `<img src="${icon}" alt="" class="newsletter__icon" aria-hidden="true" />`;
    }
    form.insertAdjacentHTML('beforeend', `
  <input type="hidden" name="_subject" value="📥 Nueva suscripción por email">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_captcha" value="false">
`);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.textContent = '';

      const email = input.value.trim()

      if (!this.validateEmail(email)) {
        error.textContent = 'Please enter a valid email address.';
        this.clearErrorAfterDelay(error);
        input.value = ""
        return;
      }

      try {
        const formData = new FormData();
        formData.append("email", email);
        const response = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: formData
        })

        if (response.ok) {
          modal.classList.add('active');
          form.reset();
        } else {
          error.textContent = 'There was an error. Please try again'
          this.clearErrorAfterDelay(error);
        }
      } catch (error) {
        error.textContent = 'Could not connect. Try again later.'
        this.clearErrorAfterDelay(error);
      } finally {
        input.value = "";
      }


    })

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    })
  }
  clearErrorAfterDelay(errorElement, delay = 1000) {
    setTimeout(() => {
      errorElement.textContent = '';
    }, delay);
  }
  validateEmail(email) {
    // Expresión regular corregida sin backslashes extras
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

customElements.define('subscribe-box', SubscribeBox);
export { SubscribeBox };