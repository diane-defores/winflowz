import 'preline';
import '@preline/dropdown';
import '@preline/overlay';

declare global {
  interface Window {
    HSDropdown: any;
    HSOverlay: any;
  }
}

function initPreline() {
  // Initialiser les dropdowns
  if (typeof window.HSDropdown !== 'undefined') {
    window.HSDropdown.autoInit();
  }

  // Initialiser les overlays (modales)
  if (typeof window.HSOverlay !== 'undefined') {
    window.HSOverlay.autoInit();
  }
}

// Initialisation au chargement initial
document.addEventListener('DOMContentLoaded', initPreline);

// Initialisation après chaque navigation
document.addEventListener('astro:page-load', initPreline);

// Réinitialisation après chaque transition de page
document.addEventListener('astro:after-swap', initPreline); 