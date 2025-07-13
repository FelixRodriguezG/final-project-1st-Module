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
// ---------------------------------------------

// ----------------------------------------------
// ✅ VALIDACIÓN
// ----------------------------------------------
// Validcion de formato correcto de los campos del formulario => devuelve un booleano
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[+]?\d{9,13}$/.test(phone);
const isValidName = (name) =>  /^[a-záéíóúñ\s]{2,50}$/i.test(name);

// Diccionario reutilizable de mensajes de error
const errorFeedback = {
    ironhackError: "Error de Ironhack, no puedes incluir este nombre",
    typeMismatch: "Por favor, introduce un formato válido",
    valueMissing: "Este campo es obligatorio",
    invalidName: "Solo se permiten letras y espacios (2-50 caracteres)",
    invalidPhone: "El teléfono debe tener entre 9 y 13 dígitos",
    messageTooShort: "El mensaje debe tener al menos 10 caracteres",
    messageTooLong: "El mensaje no puede tener más de 500 caracteres",
};

// Muestra un mensaje de error junto al campo correspondiente
const showErrorMessage = (errorElement, message) => {   
   if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('showError');
    } else {
        console.error('Error element not found in the form');
    }
}

const markFieldError = (field, message) => {
    const errorElement = document.getElementById(`${field.name}-description`);
if (!errorElement) {
    console.warn("Error element not found for field:", field.name);
    return;
  }

    field.classList.remove('valid');
    field.classList.add('invalid', 'shake-animation');
    showErrorMessage(errorElement, message);
    setTimeout(() => {
        field.classList.remove('shake-animation');
    }, 500); 
}


const validateField = ({ name, value }) => {
  switch (name) {
    case 'email':
      return isValidEmail(value)
        ? { isValid: true }
        : { isValid: false, errorMessage: errorFeedback.typeMismatch };
    case 'phone':
      return isValidPhone(value)
        ? { isValid: true }
        : { isValid: false, errorMessage: errorFeedback.invalidPhone };
    case 'name':
      if (value.toLowerCase().includes('ironhack')) {
        return { isValid: false, errorMessage: errorFeedback.ironhackError };
      }
      return isValidName(value)
        ? { isValid: true }
        : { isValid: false, errorMessage: errorFeedback.invalidName };
    case 'message':
      if (value.length < 10) {
        return { isValid: false, errorMessage: errorFeedback.messageTooShort };
      } else if (value.length > 500) {
        return { isValid: false, errorMessage: errorFeedback.messageTooLong }; // FIX
      }
      return { isValid: true };
    default:
      throw new Error('Invalid field name');
  }
};


// Marca un campo como erróneo y muestra el mensaje correspondiente
function submitMessage(type, text, form) {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
    const btn= form.querySelector('button[type="submit"]');

    const message = document.createElement('div');
    message.className = `${type}-message`;
    message.textContent = text;
    btn.parentNode.insertBefore(message, btn);

    setTimeout(() => message.remove(), 100000);
}

function clearFields(fields, resetValues = false) {
  fields.forEach(field => {
    if (resetValues) field.value = '';

    field.classList.remove('invalid', 'shake-animation', 'valid', 'showError');
    const error = field.parentElement.querySelector('.error');
    if (error) {
      initializeFormMessages(error, field);
      error.classList.remove('showError');
    }
  });
}

function initializeFormMessages(error, field) {
   if(field === 'email') {
       error.textContent = 'Enter a valid email';
   }
    else if(field === 'phone') {
         error.textContent = 'Enter a valid phone number';
    }
    else if(field === 'name') {
         error.textContent = 'Full name is required';
    }
    else if(field === 'message') {
         error.textContent = 'Message is required';
    }
    else {
         error.textContent = '';
    }
}

export {
    sanitizeInput,
    validateField,
    markFieldError,
    submitMessage,
    clearFields,
    initializeFormMessages,
    errorFeedback
};

