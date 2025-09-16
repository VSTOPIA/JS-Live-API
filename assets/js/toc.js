(function () {
  function slugify(text) {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function buildToc(container) {
    var headings = container.querySelectorAll('h2, h3');
    if (!headings.length) return null;

    var nav = document.createElement('nav');
    nav.className = 'toc-nav';

    var title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = 'On this page';
    nav.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'toc-list';

    var currentH2List = null;

    headings.forEach(function (h) {
      if (!h.id) {
        var id = slugify(h.textContent || 'section');
        // ensure unique
        var base = id, i = 2;
        while (document.getElementById(id)) {
          id = base + '-' + i++;
        }
        h.id = id;
      }

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;

      if (h.tagName.toLowerCase() === 'h2') {
        li.className = 'toc-item level-2';
        a.className = 'toc-link';
        currentH2List = document.createElement('ul');
        currentH2List.className = 'toc-sublist';

        li.appendChild(a);
        li.appendChild(currentH2List);
        list.appendChild(li);
      } else {
        li.className = 'toc-item level-3';
        a.className = 'toc-link';
        if (!currentH2List) {
          // if an h3 appears before any h2, put it at root
          list.appendChild(li);
          li.appendChild(a);
        } else {
          li.appendChild(a);
          currentH2List.appendChild(li);
        }
      }
    });

    nav.appendChild(list);
    return nav;
  }

  function init() {
    var content = document.querySelector('.page-content');
    if (!content) {
      content = document.querySelector('main#content, main');
    }
    if (!content) return;

    var toc = buildToc(content);
    if (!toc) return;

    // Layout wrappers
    var layout = document.createElement('div');
    layout.className = 'toc-layout';

    var aside = document.createElement('aside');
    aside.className = 'toc-sidebar';
    aside.appendChild(toc);

    var mainWrap = document.createElement('div');
    mainWrap.className = 'toc-main';

    // Insert layout before content
    content.parentNode.insertBefore(layout, content);
    layout.appendChild(aside);
    layout.appendChild(mainWrap);
    mainWrap.appendChild(content);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


