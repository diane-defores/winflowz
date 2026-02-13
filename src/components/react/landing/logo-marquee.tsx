"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"

const testimonials = [
  {
    name: "Florin Muresan",
    handle: "Florin_Squirrly",
    role: "CEO & Co-Founder at Squirrly",
    title: "One of the Best Deals I Purchased All Year!",
    quote:
      "I just spent 20 minutes in it and I'm already wondering what I've been doing with my life until now :)) Lots of goodies to improve my work. I love it! I thought I was being productive and that my setup was good and adapted for speed... but I guess I was wrong. There's a lot to go through and it's so well organized. I feel like I've discovered hidden treasure.",
    rating: 5,
    source: "AppSumo",
    verified: true,
  },
  {
    name: "Alex",
    handle: "Alex_dynapictures",
    role: "Verified Purchaser",
    title: "Actionable Advice and Profound Market Research",
    quote:
      "This product contains lots of useful information, obviously the authors are experts in market analysis and productivity tools. I like the idea of working smarter, not harder, and one can achieve this by applying the right tools for the job. Nice, they even covered how to stay focused, what tools to use to eliminate distractions and not to procrastinate!",
    rating: 5,
    source: "AppSumo",
    verified: true,
  },
  {
    name: "HoangV",
    handle: "HoangV",
    role: "Verified Purchaser",
    title: "Love it!",
    quote:
      "I was skeptical at first. It was not easy to buy truly helpful Notion templates. But I made the right decision. It contains numerous information about various \"handy hacks\" to make me much more productive without having to search too much. I feel lucky that I pulled the trigger — Desktop Enhanced already more than paid off my investment.",
    rating: 5,
    source: "AppSumo",
    verified: true,
  },
  {
    name: "Digital Nomad",
    handle: "Digital_Nomad",
    role: "Verified Purchaser",
    title: "Must have for Windows user",
    quote:
      "Even if one is a Windows geek, one will find golden nuggets on hacks, shortcuts which save time and fasten your work. Very neatly organized in sections. Already got my money's worth. As the name of the product will definitely enhance the way one will use their Windows OS.",
    rating: 5,
    source: "AppSumo",
    verified: true,
  },
  {
    name: "g273",
    handle: "g273",
    role: "Verified Purchaser",
    title: "Best ROI ever!!!",
    quote:
      "This list of useful apps and websites will optimize the crap out of your life \"literally\". Thank you for putting this together.",
    rating: 5,
    source: "AppSumo",
    verified: true,
  },
  {
    name: "lamefusioncake",
    handle: "lamefusioncake",
    role: "Verified Purchaser",
    title: "Useful",
    quote: "Useful. Thank you.",
    rating: 5,
    source: "AppSumo",
    verified: true,
  },
]

const tools = [
  { name: "ObsiFlowz" },
  { name: "TubeFlowz" },
  { name: "RSSFlowz" },
  { name: "PluginFlowz" },
  { name: "Windows Mastery" },
  { name: "Obsidian" },
  { name: "Chrome" },
  { name: "AppSumo" },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="var(--brand-yellow)" stroke="var(--brand-yellow)" strokeWidth="1">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function LogoMarquee() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isInView])

  return (
    <section id="testimonials" ref={ref} className="py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
          Trusted by entrepreneurs, freelancers & professionals
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <StarRating rating={5} />
          <span className="text-sm text-zinc-400">
            {testimonials.length} reviews on <span className="text-zinc-300 font-medium">AppSumo</span> — All 5/5
          </span>
        </div>
      </motion.div>

      {/* Testimonials carousel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 mb-8"
      >
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-4">
                <StarRating rating={testimonials[current].rating} />
              </div>
              {testimonials[current].title && (
                <h3 className="text-white font-semibold text-base mb-3">
                  "{testimonials[current].title}"
                </h3>
              )}
              <p className="text-zinc-400 text-sm italic mb-4 leading-relaxed">
                "{testimonials[current].quote}"
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                  {testimonials[current].name[0]}
                </div>
                <div className="text-left">
                  <p className="text-zinc-300 text-sm font-medium">
                    {testimonials[current].name}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {testimonials[current].role}
                    {testimonials[current].verified && (
                      <span className="ml-1" style={{ color: 'var(--brand-green)' }}>Verified Purchaser</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots navigation */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-6"
                  : "w-2 bg-zinc-700 hover:bg-zinc-500"
              }`}
              style={index === current ? { background: 'var(--brand-cyan)' } : undefined}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="relative mt-12">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {[...tools, ...tools].map((tool, index) => (
            <div
              key={index}
              className="flex items-center justify-center min-w-[160px] h-16 mx-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-bold">{tool.name[0]}</span>
                </div>
                <span className="font-medium">
                  {tool.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
