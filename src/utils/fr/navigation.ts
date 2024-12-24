const navBarLinks = [
  { name: "Accueil", url: "/fr" },
  { name: "Apps", url: "/fr/produits" },
  { name: "Roadmap", url: "/fr/roadmap" },
  { name: "Services", url: "/fr/services" },
  { name: "Blog", url: "/fr/blog" },
  { name: "Contact", url: "/fr/contact" },
];

const footerLinks = [
  {
    section: "Écosystème",
    links: [
      { name: "Documentation", url: "/fr/welcome-to-docs/" },
      { name: "Outils et Équipements", url: "/fr/produits" },
      { name: "Services de Construction", url: "/fr/services" },
    ],
  },
  {
    section: "Société",
    links: [
      { name: "À propos de nous", url: "/fr/a-propos" },
      { name: "Blog", url: "/fr/blog" },
      { name: "Droits d'auteur", url: "/fr/droits" },
      { name: "Clause de non-responsabilité", url: "/fr/non-responsabilite" },
      { name: "Mentions légales", url: "/fr/mentions-legales" },
      { name: "Politique de confidentialité", url: "/fr/confidentialite" },
      { name: "CGU", url: "/fr/cgu" },
    ],
  },
];

const socialLinks = {
  facebook: "#",
  x: "#",
  github: "https://github.com/mearashadowfax/ScrewFast",
  google: "#",
  slack: "#",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};