const closeSelect = (root: HTMLElement) => {
  root.removeAttribute('data-open');
  root.querySelector<HTMLButtonElement>('.custom-select__trigger')?.setAttribute('aria-expanded', 'false');
};

document.querySelectorAll<HTMLSelectElement>('select[data-custom-select]').forEach((select, index) => {
  const root = document.createElement('div');
  root.className = 'custom-select';
  select.replaceWith(root);
  root.append(select);
  root.dataset.enhanced = 'true';
  const listId = `${select.id || 'select'}-options-${index}`;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select__trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', listId);
  const list = document.createElement('ul');
  list.id = listId;
  list.className = 'custom-select__list';
  list.setAttribute('role', 'listbox');
  root.prepend(trigger, list);

  const sync = () => {
    trigger.firstChild?.remove();
    trigger.prepend(document.createTextNode(select.selectedOptions[0]?.textContent ?? ''));
    list.querySelectorAll('[role="option"]').forEach((option, optionIndex) => option.setAttribute('aria-selected', String(optionIndex === select.selectedIndex)));
  };
  Array.from(select.options).forEach((option, optionIndex) => {
    const item = document.createElement('li');
    item.className = 'custom-select__option';
    item.textContent = option.textContent;
    item.setAttribute('role', 'option');
    item.tabIndex = -1;
    item.addEventListener('keydown', (event) => {
      const options = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]'));
      const current = options.indexOf(item);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        options[(current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus();
      } else if (event.key === 'Enter' || event.key === ' ') item.click();
      else if (event.key === 'Escape') { closeSelect(root); trigger.focus(); }
    });
    item.addEventListener('click', () => {
      select.selectedIndex = optionIndex;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      closeSelect(root);
      trigger.focus();
    });
    list.append(item);
  });
  trigger.addEventListener('click', () => {
    const open = root.hasAttribute('data-open');
    if (open) closeSelect(root); else { root.dataset.open = ''; trigger.setAttribute('aria-expanded', 'true'); }
  });
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeSelect(root); return; }
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      root.dataset.open = '';
      trigger.setAttribute('aria-expanded', 'true');
      list.querySelector<HTMLElement>(`[role="option"]:nth-child(${select.selectedIndex + 1})`)?.focus();
    }
  });
  document.addEventListener('click', (event) => { if (!root.contains(event.target as Node)) closeSelect(root); });
  select.addEventListener('change', sync);
  sync();
});
