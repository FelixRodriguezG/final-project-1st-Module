# 🌐 Circle Agency - Portfolio Website

Proyecto web moderno con HTML, CSS, JavaScript y Web Components. Representa una agencia digital con navegación, proyectos, testimonios, formulario de contacto y suscripción a newsletter.

## 📁 Estructura del proyecto

```
📦 root
├── index.html
├── pages/
│   ├── contact.html
│   ├── project.html
│   └── 404.html
├── assets/
│   ├── css/
│   └── imágenes y logos
├── js/
│   ├── components/
│   ├── utils/
│   ├── index.js
│   ├── contact.js
│   └── projects.js
├── _redirects
└── README.md
```

## 🚀 Funcionalidades principales

- ✅ Web Components (`<custom-navbar>`, `<custom-footer>`, `<subscribe-box>`)
- ✅ Formulario de contacto con validación, sanitización y envío a FormSubmit
- ✅ Carga dinámica de proyectos desde API externa
- ✅ Vista de detalles de cada proyecto
- ✅ Página 404 personalizada
- ✅ Diseño responsive con animaciones

## 🧪 Tecnologías utilizadas

- HTML5 + CSS3
- JavaScript moderno (ES Modules)
- Web Components
- Fetch API
- FormSubmit (backend para formularios sin servidor)

## ⚙️ Instrucciones

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/circle-agency.git
   ```

2. Abre `index.html` en tu navegador o usa Live Server en VSCode.

3. (Opcional) Cambia el email del formulario en `contact.js` y `SubscribeBox.mjs`:
   ```js
   // contact.js
   const response = await fetch('https://formsubmit.co/ajax/TU_EMAIL@gmail.com', { ... })

   // SubscribeBox.mjs
   data-action="https://formsubmit.co/ajax/tu@email.com"
   ```

## 🌐 Despliegue en Netlify

1. Crea una cuenta en [Netlify](https://netlify.com)
2. Conecta tu repositorio GitHub
3. Usa estas opciones:
   - **Build Command**: *(dejar vacío)*
   - **Publish directory**: `/` (raíz)
4. Asegúrate de incluir el archivo `_redirects` para que la página 404 funcione correctamente.

## 📬 ¿Dudas?

Si tienes preguntas, sugerencias o simplemente quieres conectar, estaré encantado de leerte. Puedes contactarme usando el formulario en `contact.html` o a través de mis redes:

- [GitHub](https://github.com/tu-usuario)
- [LinkedIn](https://www.linkedin.com/in/tu-usuario)

¡Gracias por tu interés en el proyecto!


## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usar, modificar y distribuir el código libremente, siempre que incluyas el aviso de copyright original y la licencia en cualquier copia significativa del proyecto.

Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.
---

¡Gracias por visitar Circle Agency!
