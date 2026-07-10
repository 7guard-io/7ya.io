(() => {
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-room]'));
  const result = document.getElementById('filterResult');

  if (!buttons.length || !cards.length || !result) return;

  const update = (filter) => {
    let visible = 0;

    cards.forEach((card) => {
      const rooms = (card.dataset.room || '').split(/\s+/).filter(Boolean);
      const show = filter === 'all' || rooms.includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });

    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    result.textContent = `Showing ${visible} museum signal${visible === 1 ? '' : 's'}.`;
  };

  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => update(button.dataset.filter || 'all'));
  });
})();
