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
    if (name) { name.textContent = user ? "Olá, " + (user.name || user.email) : ""; name.hidden = !user; }
    if (login) login.hidden = !!user;
    if (logout) logout.hidden = !user;
  }
  function mount(nav) {
    var saved = token();
    render(nav, null);
    if (!saved) return;
    fetch(API + "/api/v1/auth/me", { headers: { "Accept": "application/json", "Authorization": "Bearer " + saved } })
      .then(function (response) { if (!response.ok) { if (response.status === 401 || response.status === 403) clear(); throw new Error("session"); } return response.json(); })
      .then(function (data) { render(nav, data.user); })
      .catch(function () {});
    var button = nav.querySelector("[data-pf-logout]");
    if (button) button.addEventListener("click", function () {
      button.disabled = true;
      fetch(API + "/api/v1/auth/logout", { method: "POST", headers: { "Authorization": "Bearer " + saved } })
        .catch(function () {}).then(function () { clear(); render(nav, null); button.disabled = false; });
    });
  }
  document.querySelectorAll("[data-pf-auth-nav]").forEach(mount);
}());
