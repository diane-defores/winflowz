// An array of links for navigation bar
const navBarLinks = [
  { name: "Home", url: "/" },
  { name: "Apps", url: "/products" },
  { name: "Roadmap", url: "/roadmap" },
  { name: "Services", url: "/services" },
  { name: "Blog", url: "/blog" },
  { name: "Contact", url: "/contact" },
];
// An array of links for footer
const footerLinks = [
  {
    section: "Ecosystem",
    links: [
      { name: "Courses", url: "/welcome-to-docs/" },
      { name: "Apps", url: "/products" },
      { name: "Services", url: "/services" },
    ],
  },
  {
    section: "Company",
    links: [
      { name: "About us", url: "/about" },
      { name: "Blog", url: "/blog" },
      { name: "Disclaimer", url: "/disclaimer" },
      { name: "Copyright policy", url: "/copyright" },
      { name: "Terms of use", url: "/terms" },
      { name: "Privacy policy", url: "/privacy" },
    ],
  },
];
// An object of links for social icons
export const socialLinks: SocialLinks = {
  facebook: "#",
  twitter: "#",
  github: "https://github.com/dianedef/winflowz",
  linkedin: "#",
  instagram: "#",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};