// Importación de Web Components personalizados (Navbar y Footer)
import { CustomNavbar } from './components/CustomNavbar.mjs';
import { CustomFooter } from './components/CustomFooter.mjs';

// Selecciona el formulario principal del DOM
const form = document.querySelector(".contact-form");

// Importación de funciones utilitarias desde utils.mjs
import {
    sanitizeInput,      // Elimina espacios, etiquetas HTML y caracteres peligrosos
    isValidEmail,       // Valida el formato del correo electrónico
    isValidName,        // Valida nombres (solo letras y espacios, entre 2 y 50 caracteres)
    errorMessages,      // Diccionario de mensajes de error reutilizables
    showMessage,        // Muestra mensajes visuales (éxito o error)
    clearFormErrors,    // Limpia todos los errores previos del formulario
    resetFormFields,    // Limpia los campos y el estado visual del formulario
    markFieldError      // Marca un campo con error visual y mensaje
} from './utils/utils.mjs';


// 📩 Manejo del envío del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    const fields = form.querySelectorAll("input, textarea"); // Selecciona los campos a validar
    let isFormValid = true;                                  // Bandera de validación
    const formData = new FormData();                         // Contenedor de los datos a enviar

    clearFormErrors(fields); // Limpia errores de envíos anteriores

    // 🔍 Validación individual de campos
    for (const field of fields) {
        const sanitizedValue = sanitizeInput(field.value); // Elimina entradas maliciosas o vacías

        // ❌ Campo vacío
        if (!sanitizedValue) {
            markFieldError(field, errorMessages.valueMissing);
            isFormValid = false;
            continue;
        }

        // ❌ Validación específica de nombre
        if (field.name === 'name' && !isValidName(sanitizedValue)) {
            markFieldError(field, errorMessages.invalidName);
            isFormValid = false;
            continue;
        }

        // ❌ Validación específica de email
        if (field.type === 'email' && !isValidEmail(sanitizedValue)) {
            markFieldError(field, errorMessages.typeMismatch);
            isFormValid = false;
            continue;
        }

        // ✅ Si es válido, añadir al FormData
        formData.append(field.name, sanitizedValue);
    }

    // 🚫 Si hay errores, mostrar mensaje general
    if (!isFormValid) {
        showMessage('error', 'Por favor, corrige los errores del formulario.');
        return;
    }

    // 🚀 Envío de datos mediante fetch a FormSubmit
    try {
        // Convierte FormData a objeto plano
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        // Enviar a FormSubmit usando AJAX
        const response = await fetch('https://formsubmit.co/ajax/TU_EMAIL@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });

        // ❌ Error en la respuesta
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la conexión');
        }

        // ✅ Todo ha ido bien
        const result = await response.json();
        console.log('Success:', result);

        resetFormFields(fields); // Limpia los campos tras enviar
        showMessage('success', '¡Formulario enviado con éxito!'); // Muestra confirmación

    } catch (error) {
        console.error('Error:', error);
        showMessage('error', 'Error al enviar el formulario: ' + error.message);
    }
});


// ✨ Eventos en tiempo real: animaciones y limpieza de errores al escribir
const fields = form.querySelectorAll("input, textarea");

fields.forEach((field) => {

    // ❌ Al validar automáticamente (cuando pierdes foco sin rellenar bien)
    field.addEventListener('invalid', (e) => {
        e.preventDefault(); // Evita el tooltip nativo del navegador
        field.classList.add('invalid');

        // Reinicia la animación de error visual (shake)
        field.classList.remove('shake-animation');
        void field.offsetWidth; // Forzar reflow para reiniciar animación
        field.classList.add('shake-animation');

        const error = field.parentElement.querySelector(".error");
        if (error) {
            const type = field.validity.typeMismatch ? 'typeMismatch' : 'valueMissing';
            error.textContent = errorMessages[type];
            error.style.visibility = "visible";
            error.style.opacity = 1;
        }
    });

    // ✅ Al escribir: elimina errores visuales y mensajes
    field.addEventListener('input', () => {
        field.classList.remove('invalid', 'shake-animation');
        const error = field.parentElement.querySelector(".error");
        if (error) {
            error.style.visibility = "hidden";
            error.style.opacity = 0;
        }
    });
});
