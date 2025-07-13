// ----------------------------------------------
// 🌐 Web Components personalizados
// ----------------------------------------------
import { CustomNavbar } from './components/CustomNavbar.mjs';
import { CustomFooter } from './components/CustomFooter.mjs';
import { ScrollToTop } from './components/ScrollToTop.mjs';

// ----------------------------------------------
// 🧰 Utilidades importadas desde utils.mjs
// ----------------------------------------------
import {
  sanitizeInput,
  showMessage,
  clearFields,
  clearFieldError,
  markFieldError,
  validateField,
  errorMessages
} from './utils/utils.mjs';

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

  let isFormValid = true;
  const formData = new FormData();

  clearFields(fields); // 🔄 Limpia errores visuales previos

  // 🔍 Validación campo a campo
  for (const field of fields) {
    const sanitizedValue = sanitizeInput(field.value);

    if (!sanitizedValue) {
      markFieldError(field, errorMessages.valueMissing);
      isFormValid = false;
      continue;
    }

    const validation = validateField({ ...field, value: sanitizedValue });

    if (!validation.isValid) {
      markFieldError(field, validation.errorMessage);
      isFormValid = false;
      continue;
    }

    formData.append(field.name, sanitizedValue);
  }

  // 🚫 Si hay errores, se cancela el envío
  if (!isFormValid) {
    showMessage('error', 'Por favor, corrige los errores del formulario.', form);
    return;
  }

  // 🚀 Envío de datos a FormSubmit
  try {
    const formDataObject = {};
    formData.forEach((value, key) => formDataObject[key] = value);

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
    showMessage('success', '¡Formulario enviado con éxito!', form);

  } catch (error) {
    console.error('Error:', error);
    showMessage('error', 'Error al enviar el formulario: ' + error.message, form);
  }
});

// ----------------------------------------------
// 🧠 Validación en tiempo real (input / blur)
// ----------------------------------------------
fields.forEach((field) => {
    const sanitizedValue = sanitizeInput(field.value);
  field.addEventListener('input', () => {
    field.classList.remove('shake-animation');

    if (!sanitizedValue) {
      clearFieldError(field);
      return;
    }

    const result = validateField({ ...field, value: sanitizedValue });

    if (!result.isValid) {
      markFieldError(field, result.errorMessage);
    } else {
      clearFieldError(field);
    }
  });

  field.addEventListener('blur', () => {
  

  const result = validateField({ ...field, value: sanitizedValue });

  if (!result.isValid) {
    markFieldError(field, result.errorMessage);
  } else {
    clearFieldError(field);
  }
});

});
