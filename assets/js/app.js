(function () {
  function isAppPage() {
    return window.location.pathname.includes('/app/');
  }

  function isLoginPage() {
    return window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('login.html');
  }

  function redirectToLogin() {
    window.location.href = 'login.html';
  }

  function guardReservedRoutes() {
    if (!isAppPage() || isLoginPage()) {
      return;
    }

    const session = window.AuthMock && window.AuthMock.getSession();
    if (!session) {
      redirectToLogin();
    }
  }

  function bindReservedLinks() {
    const links = document.querySelectorAll('[data-requires-auth="true"]');
    links.forEach((link) => {
      link.addEventListener('click', function (event) {
        const session = window.AuthMock && window.AuthMock.getSession();
        if (!session) {
          event.preventDefault();
          window.alert('Área reservada. Faça login para continuar.');
          window.location.href = link.getAttribute('href').includes('/app/') ? 'app/login.html' : 'login.html';
        }
      });
    });
  }

  function hydrateProfile() {
    const box = document.getElementById('profileInfo');
    if (!box || !window.AuthMock) {
      return;
    }

    const session = window.AuthMock.getSession();
    if (!session) {
      box.textContent = 'Sem sessão activa.';
      return;
    }

    const tipo = session.type === 'estudante' ? 'Estudante' : 'Empresa assistida';
    box.innerHTML = `<strong>Tipo:</strong> ${tipo}<br><strong>Identificador:</strong> ${session.identifier}<br><small>Último acesso: ${new Date(session.timestamp).toLocaleString('pt-PT')}</small>`;
  }

  function bindLogout() {
    const button = document.querySelectorAll('[data-logout]');
    if (!button.length || !window.AuthMock) {
      return;
    }

    button.forEach((item) => {
      item.addEventListener('click', function () {
        window.AuthMock.clearSession();
        window.location.href = 'login.html';
      });
    });
  }

  function bindLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form || !window.AuthMock) {
      return;
    }

    const typeField = document.getElementById('tipoUtilizador');
    const idLabel = document.getElementById('identifierLabel');
    const idField = document.getElementById('identificador');

    function updateLabel() {
      const t = typeField.value;
      if (t === 'empresa') {
        idLabel.textContent = 'NUIT';
        idField.placeholder = 'Ex.: 400123456';
      } else {
        idLabel.textContent = 'Número de Estudante';
        idField.placeholder = 'Ex.: 20234567';
      }
    }

    updateLabel();
    typeField.addEventListener('change', updateLabel);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const tipo = typeField.value;
      const identificador = idField.value.trim();
      const pin = document.getElementById('pin').value.trim();
      const err = document.getElementById('loginError');

      err.textContent = '';

      if (!window.AuthMock.validateIdentifier(tipo, identificador)) {
        err.textContent = tipo === 'empresa'
          ? 'NUIT inválido. Deve conter 9 dígitos.'
          : 'Número de Estudante inválido. Use entre 6 e 12 dígitos.';
        return;
      }

      if (!window.AuthMock.validatePin(pin)) {
        err.textContent = 'PIN inválido. Use entre 4 e 6 dígitos.';
        return;
      }

      const session = window.AuthMock.createSession(tipo, identificador);
      window.AuthMock.setSession(session);
      window.location.href = 'dashboard.html';
    });
  }

  function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      window.alert('Mensagem registada (protótipo). Responderemos brevemente.');
      form.reset();
    });
  }

  function bindSubmissionForm() {
    const form = document.getElementById('submissionForm');
    if (!form) {
      return;
    }

    const success = document.getElementById('submissionSuccess');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const requiredFields = form.querySelectorAll('[data-required="true"]');
      let valid = true;

      requiredFields.forEach((field) => {
        const errorEl = field.parentElement.querySelector('.error');
        if (errorEl) {
          errorEl.textContent = '';
        }

        if (!field.value.trim()) {
          valid = false;
          if (errorEl) {
            errorEl.textContent = 'Campo obrigatório.';
          }
        }
      });

      const email = form.querySelector('#contactoEmail');
      const emailError = email.parentElement.querySelector('.error');
      if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
        valid = false;
        emailError.textContent = 'Email inválido.';
      }

      if (!valid) {
        success.classList.add('hidden');
        return;
      }

      success.classList.remove('hidden');
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    guardReservedRoutes();
    bindReservedLinks();
    hydrateProfile();
    bindLogout();
    bindLoginForm();
    bindContactForm();
    bindSubmissionForm();
  });
})();
