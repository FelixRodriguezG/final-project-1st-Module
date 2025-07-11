// ----------------------------------------------
// ✅ SANITIZACIÓN
// ----------------------------------------------

/**
 * Sanitiza una entrada de texto eliminando espacios extra, HTML y caracteres peligrosos
 */
function sanitizeInput(input) {
  if (!input) return '';
  return input.toString()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/<[^>]*>?/g, '')
    .replace(/[&<>"'`=\/]/g, '');
}

// ----------------------------------------------
// ✅ VALIDACIÓN
// ----------------------------------------------

/**
 * Valida si un email tiene formato correcto
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida si un nombre es válido (letras y espacios, 2-50 caracteres)
 */
function isValidName(name) {
  return /^[a-záéíóúñ\s]{2,50}$/i.test(name);
}

/**
 * Diccionario reutilizable de mensajes de error
 */
const errorMessages = {
  typeMismatch: "Por favor, introduce un formato válido",
  valueMissing: "Este campo es obligatorio",
  invalidName: "Solo se permiten letras y espacios (2-50 caracteres)"
};

// ----------------------------------------------
// ✅ UI - MENSAJES Y ERRORES
// ----------------------------------------------

/**
 * Muestra un mensaje visual (éxito o error) en el formulario
 * @param {string} type - 'success' o 'error'
 * @param {string} text - contenido del mensaje
 */
function showMessage(type, text) {
  const existingMessages = document.querySelectorAll('.error-message, .success-message');
  existingMessages.forEach(msg => msg.remove());

  const message = document.createElement('div');
  message.className = `${type}-message`;
  message.textContent = text;
  form.appendChild(message); // ⚠️ `form` debe de estar definido en tu scope global

  setTimeout(() => message.remove(), 4000);
}

/**
 * Limpia los errores visuales de un conjunto de campos
 */
function clearFormErrors(fields) {
  fields.forEach(field => {
    const error = field.parentElement.querySelector(".error");
    if (error) {
      error.textContent = "";
      error.style.visibility = "hidden";
      error.style.opacity = 0;
    }
    field.classList.remove("invalid", "shake-animation");
  });
}

/**
 * Resetea los campos y limpia los errores visuales
 */
function resetFormFields(fields) {
  fields.forEach(field => {
    field.value = '';
    field.classList.remove('invalid', 'shake-animation');
    const error = field.parentElement.querySelector(".error");
    if (error) {
      error.textContent = "";
      error.style.visibility = "hidden";
      error.style.opacity = 0;
    }
  });
}

/**
 * Marca visualmente un campo como inválido con mensaje y animación
 */
function markFieldError(field, message) {
  const error = field.parentElement.querySelector('.error');
  field.classList.add('invalid', 'shake-animation');
  if (error) {
    error.textContent = message;
    error.style.visibility = 'visible';
    error.style.opacity = 1;
  }
}

// ----------------------------------------------
// ✅ EXPORTACIÓN UNIFICADA
// ----------------------------------------------
export {
  sanitizeInput,
  isValidEmail,
  isValidName,
  errorMessages,
  showMessage,
  clearFormErrors,
  resetFormFields,
  markFieldError
};
