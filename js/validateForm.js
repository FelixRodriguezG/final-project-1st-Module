// ----------------------------------------------
// 🌐 Web Components personalizados
// ----------------------------------------------
import { CustomNavbar } from './components/CustomNavbar.mjs';
import { CustomFooter } from './components/CustomFooter.mjs';
import { ScrollToTop } from './components/ScrollToTop.mjs';

import {
    sanitizeInput,
    validateField,
    markFieldError,
    submitMessage,
    clearFields,
    errorFeedback
} from './utils/sanitize-validate.js';

// ----------------------------------------------
// 📄 Selección del formulario
// ----------------------------------------------
const form = document.querySelector(".contact-form");
const fields = form.querySelectorAll("input, textarea");

// ----------------------------------------------
// 📩 Manejo del envío del formulario
// ----------------------------------------------

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFields(fields);

    let isFormValid = true;
    const formData = new FormData();

    // 🔍 Validación campo a campo
    for (const field of fields) {
        // 🧼 Sanitiza el valor del campo => evita attacks XSS
        const sanitizedValue = sanitizeInput(field.value);
        // 🚫 Si el valor está vacío, marca error y continúa al siguiente campo

        if(!sanitizedValue) {
            markFieldError(field, errorFeedback.valueMissing);
            isFormValid = false;
            continue;
        
        }
        // 🧠 Valida el campo según su tipo y reglas específicas
        // (ej. email, teléfono, etc.)
        // Si la validación falla, marca el error y continúa al siguiente campo

        const validation = validateField({ name: field.name, value: sanitizedValue });

        if (!validation.isValid) {
            markFieldError(field, validation.errorMessage);
            isFormValid = false;
            continue;
        }
        // ✅ Si el campo es válido, lo añade a los datos del formulario
        // y aplica clases de estilo para indicar que es válido
        field.classList.remove('invalid');
        field.classList.add('valid');   

        formData.append(field.name, sanitizedValue);
    }

    // 🚫 Si hay errores, se cancela el envío
    if (!isFormValid) {
        submitMessage('error', 'Por favor, corrige los errores del formulario.', form);
        return;
    }

    // 🚀 Envío de datos a FormSubmit
    try {
        const formDataObject = {};
        formData.forEach((value, key) => formDataObject[ key ] = value);

        const response = await fetch('https://formsubmit.co/ajax/TU_EMAIL@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la conexión');
        }

        const result = await response.json();
        console.log('Success:', result);

        clearFields(fields, true); // 🧼 Limpia campos tras el envío
        submitMessage('success', '¡Formulario enviado con éxito!', form);

    } catch (error) {
        console.error('Error:', error);
        submitMessage('error', 'Error al enviar el formulario: ' + error.message, form);
    }
});