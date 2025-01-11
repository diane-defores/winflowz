import '@preline/dropdown';

declare global {
  interface Window {
    HSDropdown: any;
  }
}

function initDropdowns() {
  if (typeof window.HSDropdown !== 'undefined') {
    window.HSDropdown.autoInit();
  }
}

// Initialisation au chargement initial et après chaque navigation
document.addEventListener('astro:page-load', initDropdowns);
document.addEventListener('astro:after-swap', initDropdowns); 