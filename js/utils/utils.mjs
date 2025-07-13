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

function isValidPhone(phone) {
  return /^[+]?\d{9,13}$/.test(phone);
}

/**
 * Valida si un nombre es válido (letras y espacios, 2-50 caracteres)
 */
function isValidName(name) {
  const cleaned = sanitizeInput(name.trim().toLowerCase());

  if (cleaned.includes("ironhack")) return "ironhackError";

  const isValid = /^[a-záéíóúñ\s]{2,50}$/i.test(cleaned);
  return isValid ? true : "invalidName";
}

/**
 * Valida si un mensaje cumple con los requisitos
 */
function isValidMessage(message) {
    return message.length >= 10 && message.length <= 500;
}

/**
 * Diccionario reutilizable de mensajes de error
*/
const errorMessages = {
    ironhackError: "Error de Ironhack, no puedes incluir este nombre",    
    typeMismatch: "Por favor, introduce un formato válido",
    valueMissing: "Este campo es obligatorio",
    invalidName: "Solo se permiten letras y espacios (2-50 caracteres)",
    invalidPhone: "El teléfono debe tener entre 9 y 13 dígitos",
    messageTooShort: "El mensaje debe tener al menos 10 caracteres",
    messageTooLong: "El mensaje no puede exceder los 500 caracteres"
};

const fieldValidations = {
    name: {
        validator: isValidName,
        errorType: 'invalidName'
    },
    email: {
        validator: isValidEmail,
        errorType: 'typeMismatch'
    },
    phone: {
        validator: isValidPhone,
        errorType: 'invalidPhone'
    },
    message: {
        validator: isValidMessage,
        errorType: 'messageTooShort',
        getLongError: (value) => value.length < 10 ? 
            errorMessages.messageTooShort : 
            errorMessages.messageTooLong
    }
};
// ----------------------------------------------
// ✅ UI - MENSAJES Y ERRORES
// ----------------------------------------------

/**
 * Muestra un mensaje visual (éxito o error) en el formulario
 * @param {string} type - 'success' o 'error'
 * @param {string} text - contenido del mensaje
 * @param {HTMLFormElement} form - elemento formulario donde mostrar el mensaje
 */
function showMessage(type, text, form) {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());

    const message = document.createElement('div');
    message.className = `${type}-message`;
    message.textContent = text;
    form.appendChild(message);

    setTimeout(() => message.remove(), 4000);
}

/**
 * Limpia los errores visuales de un conjunto de campos
 */
/**
 * Limpia errores visuales de los campos y opcionalmente los resetea
 * @param {HTMLElement[]} fields - Campos a limpiar
 * @param {boolean} resetValues - Si true, también vacía los campos
 */
function clearFields(fields, resetValues = false) {
  fields.forEach(field => {
    if (resetValues) field.value = '';

    field.classList.remove('invalid', 'shake-animation');

    const error = field.parentElement.querySelector('.error');
    if (error) {
      error.textContent = '';
      error.style.visibility = 'hidden';
      error.style.opacity = 0;
    }
  });
}
function validateField(field) {
  const sanitized = sanitizeInput(field.value);

  if (!sanitized) {
    return {
      isValid: false,
      errorMessage: errorMessages.valueMissing
    };
  }

  const validation = fieldValidations[field.name];
  if (!validation) return { isValid: true };

  const result = validation.validator(sanitized);

  // ⚠️ Si devuelve una string personalizada (como "ironhackError")
  if (typeof result === "string") {
    return {
      isValid: false,
      errorMessage: errorMessages[result] || "Campo inválido"
    };
  }

  // ❌ Si devuelve false pero no es string
  if (!result) {
    const errorMessage = validation.getLongError
      ? validation.getLongError(sanitized)
      : errorMessages[validation.errorType] || "Campo inválido";

    return { isValid: false, errorMessage };
  }

  return { isValid: true };
}




function clearFieldError(field) {
    const error = field.parentElement.querySelector(".error");
    if (error) {
        error.textContent = "";
        error.style.visibility = "hidden";
        error.style.opacity = 0;
    }
    field.classList.remove("invalid", "shake-animation");
}


/**
 * Marca visualmente un campo como inválido con mensaje y animación
 * @param {HTMLElement} field - El campo de entrada (input/textarea)
 * @param {string} message - Mensaje de error a mostrar
 */
function markFieldError(field, message) {
    const error = field.previousElementSibling;
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
  showMessage,
  clearFields,
  clearFieldError,
  markFieldError,
  validateField,
  errorMessages
};
