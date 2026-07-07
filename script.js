(() => {
  // Static search experience mimicking the BIG.dk interaction rhythm.
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const resultContainer = document.getElementById('searchResults');
  const searchShell = document.querySelector('.search-shell');
  const placeholders = ['Projects', 'Architecture', 'Landscape', 'Urbanism', 'Housing', 'Design', 'Masterplan', 'Competitions'];

  const sections = [
    {
      title: 'Recent Searches',
      items: [
        { label: 'Urban Housing', meta: 'Housing' },
        { label: 'Copenhagen Harbor', meta: 'Waterfront' },
        { label: 'Museum of Tomorrow', meta: 'Culture' },
      ],
    },
    {
      title: 'Popular Searches',
      items: [
        { label: 'Masterplan', meta: 'Planning' },
        { label: 'Sustainability', meta: 'Systems' },
        { label: 'Residential', meta: 'Living' },
      ],
    },
    {
      title: 'Trending',
      items: [
        { label: 'Landscape', meta: 'Open Space' },
        { label: 'Architecture', meta: 'Studio' },
        { label: 'The Plus', meta: 'Projects' },
      ],
    },
  ];

  let isOpen = false;
  let activeIndex = 0;
  let highlightedIndex = -1;
  let currentWordEl = document.querySelector('.placeholder-word.is-current');
  let nextWordEl = document.querySelector('.placeholder-word.is-next');
  let placeholderTimer;

  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    searchPanel.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();
    renderResults();
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    searchPanel.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    highlightedIndex = -1;
    renderResults();
  }

  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function renderResults() {
    const query = searchInput.value.trim().toLowerCase();
    let resultIndex = 0;

    const sectionsMarkup = sections
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          const haystack = `${item.label} ${item.meta}`.toLowerCase();
          return haystack.includes(query);
        });

        if (!filteredItems.length) {
          return '';
        }

        const itemsMarkup = filteredItems
          .map((item) => {
            const isActive = highlightedIndex >= 0 && highlightedIndex === resultIndex;
            const markup = `
              <li>
                <button class="result-item${isActive ? ' is-active' : ''}" type="button" data-label="${item.label}" data-result-index="${resultIndex}">
                  <span class="result-main">
                    <span class="result-label">${item.label}</span>
                    <span class="result-meta">${item.meta}</span>
                  </span>
                  <span class="result-arrow" aria-hidden="true">→</span>
                </button>
              </li>
            `;
            resultIndex += 1;
            return markup;
          })
          .join('');

        return `
          <section class="search-section">
            <h3>${section.title}</h3>
            <ul class="results-list">${itemsMarkup}</ul>
          </section>
        `;
      })
      .filter(Boolean)
      .join('');

    resultContainer.innerHTML = sectionsMarkup || '<p class="result-meta">No results yet.</p>';
  }

  function cyclePlaceholder() {
    const nextIndex = (activeIndex + 1) % placeholders.length;
    currentWordEl.textContent = placeholders[activeIndex];
    nextWordEl.textContent = placeholders[nextIndex];

    currentWordEl.classList.add('is-leaving');
    nextWordEl.classList.add('is-entering');

    window.setTimeout(() => {
      currentWordEl.classList.remove('is-current', 'is-leaving');
      currentWordEl.classList.add('is-next');
      nextWordEl.classList.remove('is-next', 'is-entering');
      nextWordEl.classList.add('is-current');

      const outgoing = currentWordEl;
      currentWordEl = nextWordEl;
      nextWordEl = outgoing;
      activeIndex = nextIndex;
    }, 550);
  }

  function startPlaceholderRotation() {
    clearInterval(placeholderTimer);
    placeholderTimer = window.setInterval(cyclePlaceholder, 2000);
  }

  function focusNextResult(direction) {
    const buttons = Array.from(resultContainer.querySelectorAll('.result-item'));
    if (!buttons.length) return;

    if (highlightedIndex < 0) {
      highlightedIndex = direction > 0 ? 0 : buttons.length - 1;
    } else {
      highlightedIndex = (highlightedIndex + direction + buttons.length) % buttons.length;
    }

    buttons.forEach((button, index) => {
      button.classList.toggle('is-active', index === highlightedIndex);
    });

    buttons[highlightedIndex].focus();
  }

  searchToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePanel();
  });

  searchInput.addEventListener('input', () => {
    highlightedIndex = -1;
    renderResults();
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusNextResult(1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusNextResult(-1);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const activeButton = resultContainer.querySelector('.result-item.is-active');
      if (activeButton) {
        activeButton.click();
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel();
    }
  });

  resultContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.result-item');
    if (!button) return;

    const selectedLabel = button.getAttribute('data-label');
    searchInput.value = selectedLabel;
    renderResults();
    closePanel();
  });

  document.addEventListener('click', (event) => {
    if (!searchShell.contains(event.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Tab') {
      const focusableElements = searchPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  renderResults();
  startPlaceholderRotation();
})();
