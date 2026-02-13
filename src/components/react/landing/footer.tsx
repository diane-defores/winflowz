"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const footerLinks = {
  Ecosystem: [
    { label: "Formations", href: "/docs" },
    { label: "Tools & Equipment", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Products: [
    { label: "ObsiFlowz", href: "/products" },
    { label: "TubeFlowz", href: "/products" },
    { label: "Windows Mastery", href: "/products" },
    { label: "Productivity Suite", href: "/products" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Legal Notice", href: "/legal" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="border-t border-zinc-800 bg-black">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="text-logo" style={{ fontSize: '1.25rem' }}>
                <span className="text">WinFlowz</span>
                <div className="glow-effect"></div>
              </div>
            </a>
            <p className="text-sm text-zinc-500 mb-4">
              Productivity plugins & Windows training by Diane Defores.
            </p>
            {/* Newsletter */}
            <div className="mb-4">
              <p className="text-xs text-zinc-400 mb-2">This Week In Windows Productivity</p>
              <p className="text-xs text-zinc-500">Weekly newsletter about Windows tooling and the productivity ecosystem.</p>
            </div>
            {/* System Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <span className="w-2 h-2 rounded-full pulse-glow" style={{ backgroundColor: 'var(--brand-green)' }} />
              <span className="text-xs text-zinc-400">All Systems Operational</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} WinFlowz. Crafted by Diane Defores.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/dianedef/winflowz" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-white transition-colors">
              GitHub
            </a>
            <a href="mailto:contact@winflowz.com" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
