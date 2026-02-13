"use client"

import { SmoothScroll } from "./smooth-scroll"
import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { LogoMarquee } from "./logo-marquee"
import { BentoGrid } from "./bento-grid"
import { Pricing } from "./pricing"
import { FinalCTA } from "./final-cta"
import { Footer } from "./footer"

export function LandingPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black">
        <Navbar />
        <Hero />
        <LogoMarquee />
        <BentoGrid />
        <Pricing />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
