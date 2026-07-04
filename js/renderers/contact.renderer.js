const ContactRenderer = (() => {
  let isSubmitting = false;

  const SELECTORS = {
    form: '#contactForm',
    name: '#formName',
    email: '#formEmail',
    subject: '#formSubject',
    message: '#formMessage',
    submit: '.contact__submit',
    errors: '.form-error',
  };

  function getEl(sel) {
    return document.querySelector(sel);
  }

  function getInput(sel) {
    const el = getEl(sel);
    return el;
  }

  function clearErrors() {
    document.querySelectorAll('.form-input').forEach((input) => {
      input.classList.remove('error', 'success');
      input.setAttribute('aria-invalid', 'false');
    });
  }

  function showFieldError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    input.setAttribute('aria-invalid', 'true');
    const errorSpan = input.parentElement.querySelector('.form-error');
    if (errorSpan && message) {
      errorSpan.textContent = message;
    }
  }

  function showFieldSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    input.setAttribute('aria-invalid', 'false');
    const errorSpan = input.parentElement.querySelector('.form-error');
    if (errorSpan) {
      errorSpan.textContent = input.getAttribute('data-default-error') || '';
    }
  }

  function storeDefaultErrors() {
    document.querySelectorAll('.form-error').forEach((el) => {
      if (!el.parentElement.querySelector('.form-input').getAttribute('data-default-error')) {
        el.parentElement.querySelector('.form-input').setAttribute('data-default-error', el.textContent);
      }
    });
  }

  function validateField(input) {
    const value = input.value.trim();
    const id = input.id;

    if (id === 'formName') {
      if (!value) return 'Please enter your name';
      if (value.length > 100) return 'Name must be under 100 characters';
      return null;
    }

    if (id === 'formEmail') {
      if (!value) return 'Please enter your email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email';
      return null;
    }

    if (id === 'formSubject') {
      if (!value) return 'Please enter a subject';
      if (value.length > 200) return 'Subject must be under 200 characters';
      return null;
    }

    if (id === 'formMessage') {
      if (!value) return 'Please enter your message';
      if (value.length < 10) return 'Message must be at least 10 characters';
      if (value.length > 5000) return 'Message must be under 5000 characters';
      return null;
    }

    return null;
  }

  function validateForm() {
    clearErrors();
    let isValid = true;
    const firstError = [];

    const fields = ['formName', 'formEmail', 'formSubject', 'formMessage'];
    fields.forEach((id) => {
      const input = getInput(`#${id}`);
      if (!input) return;
      const error = validateField(input);
      if (error) {
        showFieldError(input, error);
        isValid = false;
        if (firstError.length === 0) firstError.push(input);
      } else {
        showFieldSuccess(input);
      }
    });

    if (firstError.length > 0) {
      firstError[0].focus();
    }

    return isValid;
  }

  function setSubmitting(state) {
    isSubmitting = state;
    const btn = getEl(SELECTORS.submit);
    if (!btn) return;
    btn.disabled = state;
    btn.classList.toggle('contact__submit--loading', state);
    const textSpan = btn.querySelector('span');
    if (textSpan) {
      textSpan.textContent = state ? 'Sending...' : 'Send Message';
    }
  }

  function createToast() {
    let toast = document.getElementById('contact-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'contact-toast';
      toast.setAttribute('role', 'alert');
      toast.style.cssText =
        'position:fixed;bottom:24px;right:24px;z-index:10000;padding:16px 24px;border-radius:12px;font-size:0.9rem;font-weight:500;max-width:400px;transform:translateY(120%);opacity:0;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 8px 32px rgba(0,0,0,0.15);pointer-events:none';
      document.body.appendChild(toast);
    }
    return toast;
  }

  function showToast(message, type) {
    const toast = createToast();
    toast.textContent = message;
    toast.style.background =
      type === 'success'
        ? 'linear-gradient(135deg, #059669, #10b981)'
        : 'linear-gradient(135deg, #dc2626, #ef4444)';
    toast.style.color = '#ffffff';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateY(120%)';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }, 5000);
  }

  function resetForm() {
    const form = getEl(SELECTORS.form);
    if (!form) return;
    form.reset();
    clearErrors();
  }

  function handleApiError(err) {
    if (err && err.details && Array.isArray(err.details)) {
      err.details.forEach((detail) => {
        const fieldMap = { name: 'formName', email: 'formEmail', subject: 'formSubject', message: 'formMessage' };
        const inputId = fieldMap[detail.field];
        if (inputId) {
          const input = getInput(`#${inputId}`);
          if (input) showFieldError(input, detail.message);
        }
      });
      showToast('Please fix the highlighted errors.', 'error');
    } else if (err && err.code === 429) {
      showToast(err.message || 'Too many requests. Please try again later.', 'error');
    } else if (err && err.code === 'OFFLINE') {
      showToast('You appear to be offline. Please check your connection.', 'error');
    } else {
      showToast(err?.message || 'Something went wrong. Please try again.', 'error');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!navigator.onLine) {
      showToast('You appear to be offline. Please check your connection.', 'error');
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);

    const formData = {
      name: getInput(SELECTORS.name)?.value.trim() || '',
      email: getInput(SELECTORS.email)?.value.trim() || '',
      subject: getInput(SELECTORS.subject)?.value.trim() || '',
      message: getInput(SELECTORS.message)?.value.trim() || '',
    };

    try {
      await ContactService.send(formData);
      showToast('Message sent successfully!', 'success');
      resetForm();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  }

  function init() {
    const form = getEl(SELECTORS.form);
    if (!form) return;

    storeDefaultErrors();

    form.addEventListener('submit', handleSubmit);

    document.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim()) {
          const error = validateField(input);
          if (error) {
            showFieldError(input, error);
          } else {
            showFieldSuccess(input);
          }
        }
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          const error = validateField(input);
          if (error) {
            showFieldError(input, error);
          } else {
            showFieldSuccess(input);
          }
        }
      });
    });
  }

  return { init };
})();
