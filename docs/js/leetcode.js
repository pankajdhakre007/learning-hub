document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const filters = Array.from(document.querySelectorAll('[data-difficulty]'));
  const searchInput = document.getElementById('searchInput');
  const categoryNav = document.getElementById('categoryNav');

  const totals = {
    categories: document.getElementById('categoryCount'),
    count: document.getElementById('questionCount'),
    easy: document.getElementById('easyCount'),
    medium: document.getElementById('mediumCount'),
    hard: document.getElementById('hardCount'),
  };

  function slugify(value) {
    return value.toString().toLowerCase().trim()
      .replace(/[&/]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function debounce(fn, delayMs) {
    let t = null;
    return (...args) => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => fn(...args), delayMs);
    };
  }

  // Data is pre-loaded via <script src="data/leetcode-roadmap.js"> — no fetch needed.
  // This site is designed to work on file:// protocol where fetch() is blocked.
  const roadmap = window.LEETCODE_ROADMAP;
  if (!roadmap) {
    content.innerHTML = `
      <div class="notification is-danger is-light">
        Failed to load the LeetCode roadmap data. Ensure
        <code>data/leetcode-roadmap.js</code> is included before this script.
      </div>
    `;
    return;
  }

  let selectedDifficulty = 'All';

  function renderCategoryNav(categories) {
    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    categories.forEach(category => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${slugify(category)}`;
      a.textContent = category;
      li.appendChild(a);
      ul.appendChild(li);
    });

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.appendChild(ul);

    categoryNav.innerHTML = '';
    categoryNav.appendChild(menu);
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    content.innerHTML = '';

    let total = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    const categories = Object.keys(roadmap);

    categories.forEach((category) => {
      const problems = roadmap[category];
      const filtered = problems.filter(([title, difficulty, reason]) => {
        const matchesDifficulty = selectedDifficulty === 'All' || difficulty === selectedDifficulty;
        const matchesSearch = query === '' || [title, reason, category].some(text => text.toLowerCase().includes(query));
        return matchesDifficulty && matchesSearch;
      });

      if (!filtered.length) return;

      total += filtered.length;
      easy   += filtered.filter(([, difficulty]) => difficulty === 'Easy').length;
      medium += filtered.filter(([, difficulty]) => difficulty === 'Medium').length;
      hard   += filtered.filter(([, difficulty]) => difficulty === 'Hard').length;

      const section = document.createElement('div');
      section.className = 'section is-tight';
      section.id = slugify(category);

      const box = document.createElement('div');
      box.className = 'box';

      box.innerHTML = `
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <h2 class="title is-4 mb-0" data-category-title></h2>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <span class="tag is-light" data-category-count></span>
            </div>
          </div>
        </div>
        <div class="table-container">
          <table class="table is-striped is-hoverable is-fullwidth" data-table="leetcode">
            <thead>
              <tr>
                <th>#</th>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Why It Matters</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      `;

      box.querySelector('[data-category-title]').textContent = category;
      box.querySelector('[data-category-count]').textContent = `${filtered.length} Questions`;

      const tbody = box.querySelector('tbody');
      filtered.forEach((problem, index) => {
        const [title, difficulty, reason, url] = problem;
        const label = url.includes('leetcode') ? 'LeetCode' : url.includes('geeksforgeeks') ? 'GeeksForGeeks' : 'Open Link';
        const tagTone = difficulty === 'Hard' ? 'is-danger' : difficulty === 'Medium' ? 'is-warning' : 'is-success';

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.textContent = String(index + 1);

        const tdTitle = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = title;
        tdTitle.appendChild(strong);

        const tdDifficulty = document.createElement('td');
        const tag = document.createElement('span');
        tag.className = `tag ${tagTone} is-light`;
        tag.textContent = difficulty;
        tdDifficulty.appendChild(tag);

        const tdReason = document.createElement('td');
        tdReason.textContent = reason;

        const tdLink = document.createElement('td');
        const a = document.createElement('a');
        a.className = 'button is-primary is-small';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = label;
        tdLink.appendChild(a);

        tr.appendChild(tdIndex);
        tr.appendChild(tdTitle);
        tr.appendChild(tdDifficulty);
        tr.appendChild(tdReason);
        tr.appendChild(tdLink);
        tbody.appendChild(tr);
      });

      section.appendChild(box);
      content.appendChild(section);
    });

    totals.categories.textContent = Object.keys(roadmap).length;
    totals.count.textContent = total;
    totals.easy.textContent = easy;
    totals.medium.textContent = medium;
    totals.hard.textContent = hard;
  }

  // Nav is derived from the roadmap keys (single source of truth).
  renderCategoryNav(Object.keys(roadmap));

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(node => {
        node.classList.remove('is-selected');
        node.setAttribute('aria-pressed', 'false');
      });
      filter.classList.add('is-selected');
      filter.setAttribute('aria-pressed', 'true');
      selectedDifficulty = filter.dataset.difficulty;
      render();
    });
  });

  const debouncedRender = debounce(render, 200);
  searchInput.addEventListener('input', debouncedRender);

  render();
});
