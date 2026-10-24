(function () {
  "use strict";
  var API = window.POUPEFRUTI_API_URL;
  var KEY = "poupefruti.painel.token";
  function token() { try { return sessionStorage.getItem(KEY); } catch (_) { return null; } }
  function clear() { try { sessionStorage.removeItem(KEY); } catch (_) {} }
  function render(nav, user) {
    var name = nav.querySelector("[data-pf-user]");
    var login = nav.querySelector("[data-pf-login]");
    var logout = nav.querySelector("[data-pf-logout]");
    var status = nav.querySelector("[data-pf-auth-status]");
    if (name) { name.textContent = user ? "Olá, " + (user.name || user.email) : ""; name.hidden = !user; }
    if (login) login.hidden = !!user;
    if (logout) logout.hidden = !user;
    if (status) status.hidden = true;
  }
  function mount(nav) {
    var saved = token();
    render(nav, null);
    if (!saved) return;
    fetch(API + "/api/v1/auth/me", { headers: { "Accept": "application/json", "Authorization": "Bearer " + saved } })
      .then(function (response) { if (!response.ok) { var error = new Error("session"); error.status = response.status; if (response.status === 401 || response.status === 403) clear(); throw error; } return response.json(); })
      .then(function (data) { render(nav, data.user); })
      .catch(function (error) {
        var status = nav.querySelector("[data-pf-auth-status]");
        if (!status) return;
        status.textContent = error && error.status === 401
          ? "Sua sessão expirou ou foi encerrada. Entre novamente."
          : error && error.status >= 500
            ? "Não foi possível verificar sua sessão por um erro do servidor."
            : error && error.status
              ? "Não foi possível validar sua sessão. Entre novamente."
              : "Falha de conexão ao verificar sua sessão.";
        status.hidden = false;
      });
    var button = nav.querySelector("[data-pf-logout]");
    if (button) button.addEventListener("click", function () {
      button.disabled = true;
      fetch(API + "/api/v1/auth/logout", { method: "POST", headers: { "Authorization": "Bearer " + saved } })
        .catch(function () {}).then(function () { clear(); render(nav, null); button.disabled = false; });
    });
  }
  document.querySelectorAll("[data-pf-auth-nav]").forEach(mount);
}());
