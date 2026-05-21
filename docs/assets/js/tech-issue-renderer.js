function renderTechIssuePage(pageData) {
  const root = document.getElementById('root');
  if (!root) return;

  // Clear existing content safely.
  root.innerHTML = '';

  const el = (tag, { className, text, attrs } = {}) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };

  // Proper section > container wrapper so Bulma spacing / max-width apply.
  const wrapper = el('section', { className: 'section' });
  const container = el('div', { className: 'container' });
  wrapper.appendChild(container);

  const doc = el('div', { className: 'doc' });

  const section = (tight = false) => el('section', { className: `doc-section${tight ? ' doc-section--tight' : ''}` });

  // Header
  {
    const s = section(false);
    s.appendChild(el('p', { className: 'heading', text: pageData.header.eyebrow }));
    s.appendChild(el('h1', { className: 'title', text: pageData.header.title }));
    s.appendChild(el('p', { className: 'subtitle', text: pageData.header.description }));
    doc.appendChild(s);
  }

  // Synonyms
  {
    const s = section(true);
    s.appendChild(el('p', { className: 'heading', text: 'Common synonyms' }));
    const tags = el('div', { className: 'tags' });
    pageData.synonyms.forEach((syn) => tags.appendChild(el('span', { className: 'tag is-light', text: syn })));
    s.appendChild(tags);
    doc.appendChild(s);
  }

  // Questions
  {
    const s = section(true);
    s.appendChild(el('p', { className: 'heading', text: 'How interviewers phrase this' }));
    const content = el('div', { className: 'content' });
    pageData.questions.forEach((q) => content.appendChild(el('blockquote', { text: q })));
    s.appendChild(content);
    doc.appendChild(s);
  }

  // Layers
  const layerSection = section(true);
  layerSection.appendChild(el('p', { className: 'heading', text: 'Layer-by-layer breakdown' }));

  const buttonRow = el('div', { className: 'buttons has-addons is-flex-wrap-wrap', attrs: { role: 'tablist' } });
  layerSection.appendChild(buttonRow);

  const layerPanels = [];

  function buildInfoMessage(title, items) {
    const article = el('article', { className: 'message is-info' });
    const header = el('div', { className: 'message-header' });
    header.appendChild(el('p', { text: title }));
    const body = el('div', { className: 'message-body' });
    const content = el('div', { className: 'content' });
    const ul = el('ul');
    items.forEach((it) => ul.appendChild(el('li', { text: it })));
    content.appendChild(ul);
    body.appendChild(content);
    article.appendChild(header);
    article.appendChild(body);
    return article;
  }

  pageData.layers.forEach((layer, index) => {
    const btn = el('button', {
      className: `button is-small${index === 0 ? ' is-selected' : ''}`,
      text: layer.name,
      attrs: {
        type: 'button',
        'data-layer-button': 'true',
        'data-layer-index': String(index),
        role: 'tab',
        'aria-selected': index === 0 ? 'true' : 'false',
      },
    });
    buttonRow.appendChild(btn);

    const panel = el('div', {
      className: `panel panel--tight${index === 0 ? '' : ' is-hidden'}`,
      attrs: { 'data-layer': 'true', 'data-layer-index': String(index) },
    });
    const panelBody = el('div', { className: 'panel__body' });
    panelBody.appendChild(el('h2', { className: 'title is-4', text: layer.title }));
    panelBody.appendChild(el('p', { className: 'subtitle is-6', text: layer.description }));

    const cols = el('div', { className: 'columns is-multiline' });
    const colHalf = (child) => {
      const col = el('div', { className: 'column is-half' });
      col.appendChild(child);
      return col;
    };

    cols.appendChild(colHalf(buildInfoMessage('Observable symptoms', layer.symptoms)));
    cols.appendChild(colHalf(buildInfoMessage('Root causes', layer.causes)));
    cols.appendChild(colHalf(buildInfoMessage('System effects', layer.effects)));
    cols.appendChild(colHalf(buildInfoMessage('Mitigations', layer.mitigations)));

    panelBody.appendChild(cols);

    panelBody.appendChild(el('p', { className: 'heading', text: 'Key metrics' }));
    const metricTags = el('div', { className: 'tags' });
    layer.metrics.forEach((m) => metricTags.appendChild(el('span', { className: 'tag is-primary is-light', text: m })));
    panelBody.appendChild(metricTags);

    const tradeoffs = el('article', { className: 'message is-tradeoff' });
    const tradeHeader = el('div', { className: 'message-header' });
    tradeHeader.appendChild(el('p', { text: 'Tradeoffs' }));
    const tradeBody = el('div', { className: 'message-body' });
    const tradeContent = el('div', { className: 'content' });
    const tradeUl = el('ul');
    layer.tradeoffs.forEach((t) => tradeUl.appendChild(el('li', { text: t })));
    tradeContent.appendChild(tradeUl);
    tradeBody.appendChild(tradeContent);
    tradeoffs.appendChild(tradeHeader);
    tradeoffs.appendChild(tradeBody);
    panelBody.appendChild(tradeoffs);

    panel.appendChild(panelBody);
    layerSection.appendChild(panel);
    layerPanels.push(panel);
  });

  // Event delegation for layer switching (no inline onclick).
  buttonRow.addEventListener('click', (e) => {
    const btn = e.target && e.target.closest && e.target.closest('[data-layer-index]');
    if (!btn) return;
    const index = Number(btn.getAttribute('data-layer-index'));
    if (Number.isNaN(index)) return;

    layerPanels.forEach((p) => {
      p.classList.toggle('is-hidden', Number(p.getAttribute('data-layer-index')) !== index);
    });

    buttonRow.querySelectorAll('[data-layer-button]').forEach((b) => {
      const isActive = Number(b.getAttribute('data-layer-index')) === index;
      b.classList.toggle('is-selected', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  });

  doc.appendChild(layerSection);

  // Comparisons table
  {
    const s = section(true);
    s.appendChild(el('p', { className: 'heading', text: 'Universal distributed systems pattern' }));

    const tableContainer = el('div', { className: 'table-container' });
    const table = el('table', { className: 'table is-striped is-hoverable is-fullwidth' });
    const thead = el('thead');
    const trh = el('tr');
    trh.appendChild(el('th', { text: 'Technology' }));
    trh.appendChild(el('th', { text: 'Equivalent problem' }));
    thead.appendChild(trh);

    const tbody = el('tbody');
    pageData.comparisons.forEach((c) => {
      const tr = el('tr');
      const tdTech = el('td');
      tdTech.appendChild(el('strong', { text: c.tech }));
      const tdProb = el('td', { text: c.problem });
      tr.appendChild(tdTech);
      tr.appendChild(tdProb);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    s.appendChild(tableContainer);
    doc.appendChild(s);
  }

  // Insight
  {
    const s = section(true);
    const article = el('article', { className: 'message is-info' });
    const body = el('div', { className: 'message-body', text: pageData.insight });
    article.appendChild(body);
    s.appendChild(article);
    doc.appendChild(s);
  }

  container.appendChild(doc);
  root.appendChild(wrapper);
}

