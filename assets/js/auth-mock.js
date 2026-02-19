(function () {
  const SESSION_KEY = 'incubadoraSession';
  const USERS_KEY = 'incubadora_users';
  const DEMO_ADMIN_KEY = 'demoAdmin';

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function getSession() {
    return safeParse(localStorage.getItem(SESSION_KEY), null);
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function normalizeType(type) {
    return type === 'empresa' ? 'empresa' : 'estudante';
  }

  function validateIdentifier(type, value) {
    return normalizeType(type) === 'estudante' ? /^\d{6,12}$/.test(value) : /^\d{9}$/.test(value);
  }

  function validatePhone(phone) {
    return /^(\+258)?\d{8,12}$/.test((phone || '').replace(/\s+/g, ''));
  }

  function validatePin(pin) {
    return /^\d{4,6}$/.test(pin);
  }

  function encodePin(pin) {
    return btoa(pin);
  }

  function getUsers() {
    return safeParse(localStorage.getItem(USERS_KEY), []);
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUser(tipo, id) {
    const t = normalizeType(tipo);
    return getUsers().find((user) => user.tipo === t && user.id === id);
  }

  function registerUser(payload) {
    const users = getUsers();
    const tipo = normalizeType(payload.tipo);
    const id = payload.id;

    if (users.some((user) => user.tipo === tipo && user.id === id)) {
      return { ok: false, message: 'Já existe uma conta com este identificador.' };
    }

    const user = {
      id,
      tipo,
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone,
      pinHash: encodePin(payload.pin),
      status: 'PENDENTE',
      createdAt: new Date().toISOString()
    };

    if (payload.representante) user.representante = payload.representante;

    users.push(user);
    saveUsers(users);
    return { ok: true, user };
  }

  function updateStatus(tipo, id, status) {
    const users = getUsers();
    const user = users.find((item) => item.tipo === normalizeType(tipo) && item.id === id);
    if (!user) return false;
    user.status = status;
    user.reviewedAt = new Date().toISOString();
    saveUsers(users);
    return true;
  }

  function approveUser(tipo, id) {
    return updateStatus(tipo, id, 'APROVADO');
  }

  function rejectUser(tipo, id) {
    return updateStatus(tipo, id, 'RECUSADO');
  }

  function verifyPin(user, pin) {
    return user && user.pinHash === encodePin(pin);
  }

  function createSession(user) {
    return {
      tipo: user.tipo,
      id: user.id,
      nome: user.nome,
      status: user.status,
      timestamp: new Date().toISOString()
    };
  }

  function setDemoAdmin(enabled) {
    localStorage.setItem(DEMO_ADMIN_KEY, enabled ? 'true' : 'false');
  }

  function isDemoAdmin() {
    return localStorage.getItem(DEMO_ADMIN_KEY) === 'true';
  }

  window.AuthMock = {
    getSession,
    setSession,
    clearSession,
    validateIdentifier,
    validatePhone,
    validatePin,
    getUsers,
    findUser,
    registerUser,
    approveUser,
    rejectUser,
    verifyPin,
    createSession,
    setDemoAdmin,
    isDemoAdmin
  };
})();
