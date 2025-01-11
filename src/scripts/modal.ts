// Initialisation des modales
function initModals() {
  // Boutons d'ouverture
  document.querySelectorAll('[data-modal-toggle]').forEach((button) => {
    const modalId = button.getAttribute('data-modal-toggle');
    if (!modalId) return;

    const modal = document.getElementById(modalId);
    if (!modal) return;

    button.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  });

  // Boutons de fermeture
  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    const modalId = button.getAttribute('data-modal-close');
    if (!modalId) return;

    const modal = document.getElementById(modalId);
    if (!modal) return;

    button.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });

  // Fermeture en cliquant sur l'arrière-plan
  document.querySelectorAll('.hs-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
}

// Initialiser les modales au chargement de la page et après chaque navigation
document.addEventListener('astro:page-load', initModals); 