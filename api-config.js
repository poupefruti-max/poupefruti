/* API local durante desenvolvimento; API hospedada nos demais domínios. */
(function () {
  "use strict";
  if (window.POUPEFRUTI_API_URL) return;
  var host = window.location.hostname;
  window.POUPEFRUTI_API_URL = host === "localhost" || host === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://poupefrutiapi.onrender.com";
}());
