document.documentElement.classList.add('js');
document.querySelectorAll('[data-enhanced-only]').forEach((element) => { element.hidden = false; });
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
if (menuToggle && navigation) {
  const closeMenu = (returnFocus = false) => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (returnFocus) menuToggle.focus();
  };
  menuToggle.addEventListener('click', () => {
    if (menuToggle.getAttribute('aria-expanded') === 'true') return closeMenu();
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    navigation.classList.add('is-open');
    document.body.classList.add('menu-open');
    navigation.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const links = [...navigation.querySelectorAll('a'), menuToggle];
      if (event.shiftKey && document.activeElement === links[0]) {
        event.preventDefault();
        links.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
        event.preventDefault();
        links[0].focus();
      }
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top <= window.innerHeight) return;
    element.classList.add('is-pending');
    observer.observe(element);
  });
}

const productGrid = document.querySelector('[data-product-grid]');
if (productGrid) {
  const products = [...productGrid.querySelectorAll('[data-product]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('[data-product-search]');
  const count = document.querySelector('[data-product-count]');
  const empty = document.querySelector('[data-product-empty]');
  let category = 'all';
  const applyFilters = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    products.forEach((product) => {
      const matches = (category === 'all' || product.dataset.category === category)
        && product.dataset.search.toLocaleLowerCase().includes(query);
      product.hidden = !matches;
      if (matches) visible++;
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'product' : 'products'}`;
    if (empty) empty.hidden = visible > 0;
  };
  filters.forEach((filter) => filter.addEventListener('click', () => {
    category = filter.dataset.filter;
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
    applyFilters();
  }));
  search?.addEventListener('input', applyFilters);
  document.querySelector('[data-reset-filters]')?.addEventListener('click', () => {
    category = 'all';
    if (search) search.value = '';
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.filter === 'all')));
    applyFilters();
    search?.focus();
  });
  applyFilters();
}

const lightbox = document.querySelector('[data-lightbox]');
if (lightbox && typeof lightbox.showModal === 'function') {
  const picture = lightbox.querySelector('img');
  const title = lightbox.querySelector('[data-lightbox-title]');
  document.querySelectorAll('[data-zoom]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      picture.src = link.href;
      picture.alt = link.dataset.caption || link.querySelector('img')?.alt || 'Product photograph';
      title.textContent = picture.alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    const bounds = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
  });
}

const enquiryForm = document.querySelector('[data-enquiry-form]');
if (enquiryForm) {
  const query = new URLSearchParams(window.location.search);
  const subject = enquiryForm.elements.namedItem('product');
  if (subject && query.has('product')) subject.value = query.get('product');
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const values = new FormData(enquiryForm);
    const message = [
      `Name: ${values.get('name')}`,
      `Email: ${values.get('email')}`,
      `Company: ${values.get('company') || 'Not provided'}`,
      `Product interest: ${values.get('product') || 'General enquiry'}`,
      '', values.get('message'),
    ].join('\n');
    const destination = enquiryForm.dataset.email;
    const mailto = `mailto:${destination}?subject=${encodeURIComponent(`Website enquiry: ${values.get('product') || 'Apparel manufacturing'}`)}&body=${encodeURIComponent(message)}`;
    const status = enquiryForm.querySelector('[data-form-status]');
    if (status) status.textContent = 'Your enquiry draft is ready. Open it in your email app to review and send. Nothing has been sent yet.';
    const draft = enquiryForm.querySelector('[data-email-draft]');
    if (draft) {
      draft.href = mailto;
      draft.hidden = false;
    }
  });
}
