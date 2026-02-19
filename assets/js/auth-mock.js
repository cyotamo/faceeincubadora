(function () {
  const SESSION_KEY = 'incubadoraSession';
  const USERS_KEY = 'incubadora_users';
  const DEMO_ADMIN_KEY = 'demoAdmin';

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function validateIdentifier(type, value) {
    return type === 'estudante' ? /^\d{6,12}$/.test(value) : /^\d{9}$/.test(value);
  }

  function validatePhone(phone) {
    return /^(\+258)?\d{8,12}$/.test(phone.replace(/\s+/g, ''));
  }

  function validatePin(pin) {
    return /^\d{4,6}$/.test(pin);
  }

  function getUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUser(type, identifier) {
    return getUsers().find((u) => u.type === type && u.identifier === identifier);
  }

  function registerUser(payload) {
    const users = getUsers();
    if (users.some((u) => u.type === payload.type && u.identifier === payload.identifier)) {
      return { ok: false, message: 'Já existe uma conta com este identificador.' };
    }

    users.push({ ...payload, status: 'PENDENTE', createdAt: new Date().toISOString() });
    saveUsers(users);
    return { ok: true };
  }

  function approveUser(type, identifier) {
    const users = getUsers();
    const user = users.find((u) => u.type === type && u.identifier === identifier);
    if (!user) return false;
    user.status = 'APROVADO';
    user.reviewedAt = new Date().toISOString();
    saveUsers(users);
    return true;
  }

  function rejectUser(type, identifier) {
    const users = getUsers();
    const user = users.find((u) => u.type === type && u.identifier === identifier);
    if (!user) return false;
    user.status = 'RECUSADO';
    user.reviewedAt = new Date().toISOString();
    saveUsers(users);
    return true;
  }

  function createSession(type, identifier, status) {
    return { type, identifier, status: status || 'APROVADO', timestamp: new Date().toISOString() };
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
    createSession,
    setDemoAdmin,
    isDemoAdmin
  };
})();
