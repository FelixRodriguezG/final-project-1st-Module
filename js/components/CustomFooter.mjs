class CustomFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const logo = this.dataset.logo || '';
        const links = this.safeParse(this.dataset.links) || [];

        const logoHTML = /\.(png|jpe?g|svg|webp)$/.test(logo)
            ? `<img src="${logo}" alt="Logo">`
            : `<span>${logo}</span>`;

        const style = /*css*/ `
        .footer-container {
            box-sizing: border-box;
            background-color: var(--color-bg);
            height: 250px;
            width: 100%;
            padding-inline: clamp(1rem, 4vw, 10rem);
            max-width: var(--desktop, 1200px);
            margin-top: 170px;
            margin-inline: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-neutral-medium);
            font-family: sans-serif;
            padding-bottom: 2rem;
        }
        .footer-content {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .logo img {
            height: 30px;
        }
        .footer-logo {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        .footer-logo span {
            display: block;
        }
        .footer-list {
            display: flex;
            width: 400px;
            height: 100%;
            flex-wrap: wrap;
            list-style: none;
            padding: 0;
            margin: 0;
            gap: 1rem;
        }
        .footer-list li {
            flex-basis: calc(30% - 0.5rem);
            flex-grow: 1;
        }
        .footer-list li a {
            flex-basis: calc(50% - 0.5rem);
            color: var(--color-neutral-medium);
            text-decoration: none;
            transition: color 0.3s;
            white-space: nowrap; 
        }
        .footer-list a:hover {
            color: var(--color-primary);
        }

        .footer-list a:focus {    
            outline: 4px solid #fff;
            outline-offset: 5px;
        }
        @media (width <= 800px) {
            .footer-content {
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }
            .footer-logo {
                flex-direction: column;
                align-items: center;
            }
            .footer-logo p {
                display: flex;
            }
        }
        @media (width <= 400px) {
            .footer-container {
                padding-bottom: 2rem;
                margin-top:50px;
            }
            .footer-list {
                width: 300px;
            }
        }
        `;

        const template = document.createElement('template');
        template.innerHTML = /* html */ `
            <style>${style}</style>
            <footer class="footer-container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <div class="logo">
                            <a href="/">${logoHTML}</a>
                        </div>
                        <p>2972 Westheimer Rd. Santa Ana,<span>Illinois 85486</span></p>
                    </div>
                    <aside class="footer-links">
                        <ul class="footer-list">
                            ${links.map((link) => `<li><a href="${link.href}">${link.text}</a></li>`).join('')}
                        </ul>
                    </aside>
                </div>
            </footer>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    safeParse(str) {
        try {
            return JSON.parse(str);
        } catch {
            return null;
        }
    }
}

customElements.define('custom-footer', CustomFooter);
export { CustomFooter };
