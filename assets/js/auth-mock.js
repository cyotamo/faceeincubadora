(function () {
  const STORAGE_KEY = 'incubadoraSession';

  function getSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function validateIdentifier(type, value) {
    if (type === 'estudante') {
      return /^\d{6,12}$/.test(value);
    }
    if (type === 'empresa') {
      return /^\d{9}$/.test(value);
    }
    return false;
  }

  function validatePin(pin) {
    return /^\d{4,6}$/.test(pin);
  }

  function createSession(type, identifier) {
    return {
      type,
      identifier,
      timestamp: new Date().toISOString()
    };
  }

  window.AuthMock = {
    getSession,
    setSession,
    clearSession,
    validateIdentifier,
    validatePin,
    createSession
  };
})();
