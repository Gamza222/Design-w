/* global window, document */
// Общий счётчик для всех HTML-страниц, включая статическую 404.
// defer + явные hit: один просмотр при загрузке и при каждом переходе React Router.
(function () {
  if (window.designSeichasTrackPage) return;

  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=113598335', 'ym');

  window.ym(113598335, 'init', {
    defer: true,
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });

  var previousPage;
  var previousUrl = document.referrer;
  window.designSeichasTrackPage = function () {
    // Якоря секций главной не являются новыми страницами. Query (включая UTM) сохраняем.
    var page = window.location.pathname + window.location.search;
    if (page === previousPage) return;
    window.ym(113598335, 'hit', window.location.href, {
      referer: previousUrl,
      title: document.title,
    });
    previousPage = page;
    previousUrl = window.location.href;
  };
  window.designSeichasTrackPage();
})();
