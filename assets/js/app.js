(function () {
  function path() { return window.location.pathname; }
  function isAppPage() { return path().includes('/app/'); }
  function isLoginPage() { return path().endsWith('/app/login.html') || path().endsWith('login.html'); }
  function isValidationPage() { return path().endsWith('/app/validacao.html') || path().endsWith('validacao.html'); }

  function applyTheme(theme) {
    const root = document.documentElement;
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    root.setAttribute('data-theme', resolved);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-label', `Tema actual: ${theme}. Alterar tema`);
  }

  function initTheme() {
    const saved = localStorage.getItem('theme') || 'system';
    applyTheme(saved);
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const current = localStorage.getItem('theme') || 'system';
      const next = current === 'system' ? 'dark' : current === 'dark' ? 'light' : 'system';
      localStorage.setItem('theme', next);
      applyTheme(next);
      toast(`Tema alterado para ${next}.`, 'success');
    });
  }

  function requireAuth() {
    if (!isAppPage() || isLoginPage()) return;
    if (!window.AuthMock.getSession()) {
      window.location.href = 'login.html';
      return;
    }

    if (isValidationPage() && !window.AuthMock.isDemoAdmin()) {
      window.location.href = 'dashboard.html';
    }
  }

  function setupDemoAdminFlag() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('admin') === '1' && window.AuthMock) {
      window.AuthMock.setDemoAdmin(true);
      toast('Modo demonstração activo.', 'success');
    }
  }

  function bindReservedLinks() {
    document.querySelectorAll('[data-requires-auth="true"]').forEach((link) => {
      link.addEventListener('click', function (event) {
        if (!window.AuthMock.getSession()) {
          event.preventDefault();
          toast('Área reservada. Faça login para continuar.', 'error');
          window.location.href = link.getAttribute('href').includes('/app/') ? 'app/login.html' : 'login.html';
        }
      });
    });
  }

  function hydrateProfile() {
    const box = document.getElementById('profileInfo');
    const session = window.AuthMock.getSession();
    if (!box || !session) return;
    box.innerHTML = `<strong>Tipo:</strong> ${session.tipo === 'estudante' ? 'Estudante' : 'Empresa'}<br><strong>Identificador:</strong> ${session.id}<br><small>Último acesso: ${new Date(session.timestamp).toLocaleString('pt-PT')}</small>`;
  }

  function bindLogout() {
    document.querySelectorAll('[data-logout]').forEach((btn) => btn.addEventListener('click', function () {
      window.AuthMock.clearSession();
      window.location.href = 'login.html';
    }));
  }

  function bindLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const p = new URLSearchParams(window.location.search);
    const created = document.getElementById('createdMessage');
    if (created && p.get('created') === '1') {
      created.classList.remove('hidden');
    }

    const typeField = document.getElementById('tipoUtilizador');
    const idLabel = document.getElementById('identifierLabel');
    const idField = document.getElementById('identificador');
    const err = document.getElementById('loginError');
    const pendingPanel = document.getElementById('pendingState');

    function updateLabel() {
      if (typeField.value === 'empresa') {
        idLabel.textContent = 'NUIT';
        idField.placeholder = 'Ex.: 400123456';
      } else {
        idLabel.textContent = 'Número de Estudante';
        idField.placeholder = 'Ex.: 20234567';
      }
    }

    function hidePending() {
      if (pendingPanel) pendingPanel.classList.add('hidden');
    }

    updateLabel();
    typeField.addEventListener('change', updateLabel);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hidePending();
      err.textContent = '';

      const tipo = typeField.value;
      const identificador = idField.value.trim();
      const pin = document.getElementById('pin').value.trim();

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

      const user = window.AuthMock.findUser(tipo, identificador);
      if (!user) {
        err.textContent = 'Conta não encontrada. Faça inscrição.';
        return;
      }

      if (!window.AuthMock.verifyPin(user, pin)) {
        err.textContent = 'PIN incorrecto.';
        return;
      }

      if (user.status === 'PENDENTE') {
        if (pendingPanel) {
          pendingPanel.classList.remove('hidden');
          pendingPanel.querySelector('[data-user]').textContent = user.id;
        }
        return;
      }

      if (user.status === 'RECUSADO') {
        err.textContent = 'Conta recusada. Contacte a Incubadora para rever a inscrição.';
        return;
      }

      window.AuthMock.setSession(window.AuthMock.createSession(user));
      window.location.href = 'dashboard.html';
    });
  }

  function bindRegistrationForm() {
    const form = document.getElementById('inscricaoForm');
    if (!form) return;

    document.querySelectorAll('[data-tab-target]').forEach((tab) => {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-tab-target');
        document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.add('hidden'));
        tab.classList.add('active');
        document.getElementById(target).classList.remove('hidden');
        document.getElementById('tipoRegisto').value = target === 'tabEmpresa' ? 'empresa' : 'estudante';
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const out = document.getElementById('inscricaoFeedback');
      out.textContent = '';

      const tipo = document.getElementById('tipoRegisto').value;
      const terms = document.getElementById('termos').checked;
      if (!terms) {
        out.textContent = 'Deve concordar com os termos para continuar.';
        return;
      }

      let id;
      let nome;
      let email;
      let telefone;
      let pin;
      let pin2;
      let representante;

      if (tipo === 'estudante') {
        id = document.getElementById('estudanteNumero').value.trim();
        nome = document.getElementById('estudanteNome').value.trim();
        email = document.getElementById('estudanteEmail').value.trim();
        telefone = document.getElementById('estudanteTelefone').value.trim();
        pin = document.getElementById('estudantePin').value.trim();
        pin2 = document.getElementById('estudantePin2').value.trim();
      } else {
        id = document.getElementById('empresaNuit').value.trim();
        nome = document.getElementById('empresaNome').value.trim();
        representante = document.getElementById('empresaRepresentante').value.trim();
        email = document.getElementById('empresaEmail').value.trim();
        telefone = document.getElementById('empresaTelefone').value.trim();
        pin = document.getElementById('empresaPin').value.trim();
        pin2 = document.getElementById('empresaPin2').value.trim();
      }

      if (!window.AuthMock.validateIdentifier(tipo, id)) {
        out.textContent = tipo === 'empresa'
          ? 'NUIT inválido. Deve conter 9 dígitos.'
          : 'Número de estudante inválido. Deve conter 6–12 dígitos.';
        return;
      }
      if (!nome || !email || !telefone) {
        out.textContent = 'Preencha todos os campos obrigatórios.';
        return;
      }
      if (tipo === 'empresa' && !representante) {
        out.textContent = 'Indique o nome do representante.';
        return;
      }
      if (!window.AuthMock.validatePhone(telefone)) {
        out.textContent = 'Telefone inválido. Use formato local ou +258.';
        return;
      }
      if (!window.AuthMock.validatePin(pin)) {
        out.textContent = 'PIN inválido. Use 4–6 dígitos.';
        return;
      }
      if (pin !== pin2) {
        out.textContent = 'PIN e confirmação não coincidem.';
        return;
      }

      const result = window.AuthMock.registerUser({
        tipo,
        id,
        nome,
        email,
        telefone,
        pin,
        representante
      });

      if (!result.ok) {
        out.textContent = result.message;
        return;
      }

      toast('Inscrição submetida com sucesso.', 'success');
      window.location.href = 'login.html?created=1';
    });
  }

  function bindValidationPage() {
    const table = document.getElementById('pendingUsersTable');
    if (!table) return;

    const body = table.querySelector('tbody');

    function render() {
      const pending = window.AuthMock.getUsers().filter((u) => u.status === 'PENDENTE');
      body.innerHTML = pending.length ? '' : '<tr><td colspan="6">Sem utilizadores pendentes.</td></tr>';

      pending.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${user.nome}</td><td>${user.tipo}</td><td>${user.id}</td><td>${user.email}</td><td>${new Date(user.createdAt).toLocaleDateString('pt-PT')}</td><td><button class="btn btn-primary" data-approve>Aprovar</button> <button class="btn btn-outline" data-reject>Recusar</button></td>`;
        tr.querySelector('[data-approve]').addEventListener('click', function () {
          window.AuthMock.approveUser(user.tipo, user.id);
          toast('Utilizador aprovado.', 'success');
          render();
        });
        tr.querySelector('[data-reject]').addEventListener('click', function () {
          window.AuthMock.rejectUser(user.tipo, user.id);
          toast('Utilizador recusado.', 'error');
          render();
        });
        body.appendChild(tr);
      });
    }

    render();
  }

  function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (event) { event.preventDefault(); toast('Mensagem registada (protótipo).', 'success'); form.reset(); });
  }

  function bindSubmissionForm() {
    const form = document.getElementById('submissionForm');
    if (!form) return;
    const success = document.getElementById('submissionSuccess');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll('[data-required="true"]').forEach((field) => {
        const err = field.parentElement.querySelector('.error'); if (err) err.textContent = '';
        if (!field.value.trim()) { valid = false; if (err) err.textContent = 'Campo obrigatório.'; }
      });
      if (!valid) return;
      success.classList.remove('hidden'); toast('Submissão registada.', 'success'); form.reset();
    });
  }

  function resultsPageUrl() {
    if (isAppPage()) return 'pesquisa.html';
    if (path().includes('/public/')) return 'pesquisa.html';
    return 'public/pesquisa.html';
  }

  function resolveUrl(url) {
    if (url.startsWith('http')) return url;
    if (isAppPage() && url.startsWith('app/')) return url.replace('app/', '');
    if (isAppPage() && url.startsWith('public/')) return '../' + url;
    if (path().includes('/public/') && url.startsWith('public/')) return '../' + url;
    if (path().includes('/public/') && url.startsWith('app/')) return '../' + url;
    return url;
  }

  function highlight(text, q) { return text.replace(new RegExp(`(${q})`, 'ig'), '<mark>$1</mark>'); }

  function setupSearch() {
    const input = document.getElementById('globalSearchInput');
    const list = document.getElementById('searchDropdown');
    if (!input || !list || !window.SearchIndex) return;
    const source = isAppPage() ? window.SearchIndex.appIndex : window.SearchIndex.publicIndex;

    function closeDrop() { list.classList.add('hidden'); list.innerHTML = ''; }

    function run(term) {
      const q = term.trim().toLowerCase();
      if (!q) return [];
      return source.filter((item) => `${item.title} ${item.keywords} ${item.excerpt}`.toLowerCase().includes(q)).slice(0, 8);
    }

    function render(items, q) {
      if (!items.length) return closeDrop();
      list.innerHTML = '';
      items.forEach((item) => {
        const a = document.createElement('a');
        a.className = 'search-result';
        a.href = resolveUrl(item.url);
        a.innerHTML = `<strong>${item.title}</strong><small>${item.section}</small><span>${highlight(item.excerpt, q)}</span>`;
        list.appendChild(a);
      });
      const all = document.createElement('a');
      all.className = 'search-result all-results';
      all.href = `${resultsPageUrl()}?q=${encodeURIComponent(q)}`;
      all.textContent = 'Ver todos os resultados';
      list.appendChild(all);
      list.classList.remove('hidden');
    }

    input.addEventListener('input', function () { render(run(input.value), input.value.trim()); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrop();
      if (e.key === 'Enter') window.location.href = `${resultsPageUrl()}?q=${encodeURIComponent(input.value.trim())}`;
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search-box')) closeDrop(); });
  }

  function setupSearchResultsPage() {
    const wrap = document.getElementById('searchResults');
    if (!wrap || !window.SearchIndex) return;
    if (isAppPage() && !window.AuthMock.getSession()) { window.location.href = 'login.html'; return; }
    const q = new URLSearchParams(window.location.search).get('q') || '';
    const source = isAppPage() ? window.SearchIndex.appIndex : window.SearchIndex.publicIndex;
    document.getElementById('queryLabel').textContent = q || '—';
    const results = source.filter((item) => `${item.title} ${item.keywords} ${item.excerpt}`.toLowerCase().includes(q.toLowerCase()));
    wrap.innerHTML = results.length ? '' : '<p>Sem resultados encontrados.</p>';
    results.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `<h3><a href="${resolveUrl(item.url)}">${item.title}</a></h3><p>${highlight(item.excerpt, q)}</p><small>${item.section}</small>`;
      wrap.appendChild(card);
    });
  }

  function toast(msg, type) {
    const box = document.getElementById('toastContainer');
    if (!box) return;
    const el = document.createElement('div');
    el.className = `toast ${type || 'success'}`;
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
  window.toast = toast;

  function bindModal() {
    document.querySelectorAll('[data-modal-close]').forEach((btn) => btn.addEventListener('click', function () {
      btn.closest('.modal').classList.add('hidden');
    }));
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.querySelectorAll('.modal').forEach((m) => m.classList.add('hidden'));
    });
  }

  function toggleValidationLink() {
    const link = document.getElementById('menuValidacao');
    if (!link) return;
    link.classList.toggle('hidden', !window.AuthMock.isDemoAdmin());
  }

  function toggleDemoBadge() {
    const badge = document.getElementById('demoBadge');
    if (!badge) return;
    badge.classList.toggle('hidden', !window.AuthMock.isDemoAdmin());
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupDemoAdminFlag();
    requireAuth();
    initTheme();
    bindReservedLinks();
    bindLogout();
    bindLoginForm();
    bindRegistrationForm();
    bindValidationPage();
    bindContactForm();
    bindSubmissionForm();
    hydrateProfile();
    setupSearch();
    setupSearchResultsPage();
    bindModal();
    toggleValidationLink();
    toggleDemoBadge();
  });
})();
