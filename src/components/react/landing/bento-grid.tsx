"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { BookOpen, Chrome, Monitor, GraduationCap, Zap, FolderTree, Search, Bookmark } from "lucide-react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const pluginEvents = [
  { plugin: "RSSFlowz", action: "synced", color: "var(--brand-cyan)" },
  { plugin: "PluginFlowz", action: "updated", color: "var(--brand-green)" },
  { plugin: "ContentFlowz", action: "indexed", color: "var(--brand-magenta)" },
  { plugin: "NoteFlowz", action: "ready", color: "var(--brand-yellow)" },
]

function PluginActivity() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [events, setEvents] = useState<Array<{ plugin: string; action: string; color: string; id: number }>>([])
  const idRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const event = pluginEvents[activeIndex]
      idRef.current += 1
      setEvents((prev) => [{ ...event, id: idRef.current }, ...prev].slice(0, 3))
      setActiveIndex((prev) => (prev + 1) % pluginEvents.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [activeIndex])

  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      {events.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: 20, height: 0 }}
          animate={{ opacity: 1, x: 0, height: 'auto' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-xs"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: event.color }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 0.6 }}
          />
          <span className="text-zinc-400 truncate">
            <span className="font-medium" style={{ color: event.color }}>{event.plugin}</span>
            {" "}{event.action}
          </span>
        </motion.div>
      ))}
      {events.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" />
          listening...
        </div>
      )}
    </div>
  )
}

function KeyboardShortcut() {
  const [pressed, setPressed] = useState(false)
  const shortcuts = [
    { keys: ["Ctrl", "Space"], label: "Quick search" },
    { keys: ["Ctrl", "B"], label: "Bookmark" },
    { keys: ["Ctrl", "Shift", "S"], label: "Save all" },
  ]
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPressed(true)
      setTimeout(() => {
        setPressed(false)
        setCurrent((prev) => (prev + 1) % shortcuts.length)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {shortcuts[current].keys.map((key, i) => (
          <motion.kbd
            key={`${current}-${i}`}
            animate={pressed ? { scale: 0.92, y: 2 } : { scale: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="px-2 py-1 text-xs border border-zinc-700 rounded text-zinc-300 font-mono"
            style={pressed ? { backgroundColor: 'var(--brand-cyan)', borderColor: 'var(--brand-cyan)', color: 'black' } : { backgroundColor: 'rgb(39 39 42)' }}
          >
            {key}
          </motion.kbd>
        ))}
      </div>
      <motion.span
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-zinc-500"
      >
        {shortcuts[current].label}
      </motion.span>
    </div>
  )
}

function SmartOrganization() {
  const items = [
    { icon: FolderTree, label: "Categorize", color: "var(--brand-magenta)" },
    { icon: Search, label: "Discover", color: "var(--brand-cyan)" },
    { icon: Bookmark, label: "Save", color: "var(--brand-yellow)" },
  ]
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % items.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {items.map((item, i) => {
        const Icon = item.icon
        const isActive = i === activeStep
        return (
          <motion.div
            key={item.label}
            animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="p-2 rounded-lg border transition-all duration-300"
              style={{
                borderColor: isActive ? item.color : 'rgb(63 63 70)',
                backgroundColor: isActive ? `${item.color}15` : 'rgb(39 39 42)',
              }}
            >
              <Icon
                className="w-4 h-4 transition-colors duration-300"
                strokeWidth={1.5}
                style={{ color: isActive ? item.color : 'rgb(161 161 170)' }}
              />
            </div>
            <span
              className="text-[10px] font-medium transition-colors duration-300"
              style={{ color: isActive ? item.color : 'rgb(113 113 122)' }}
            >
              {item.label}
            </span>
          </motion.div>
        )
      })}
      {/* Animated connecting line */}
      <svg className="absolute bottom-4 left-6 right-6 h-1 overflow-visible" style={{ pointerEvents: 'none' }}>
        <motion.rect
          x={`${(activeStep / (items.length - 1)) * 100}%`}
          y="0"
          width="33%"
          height="2"
          rx="1"
          fill={items[activeStep].color}
          animate={{ x: `${activeStep * 33}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </svg>
    </div>
  )
}

function AnimatedChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const points = [
    { x: 0, y: 60 },
    { x: 20, y: 45 },
    { x: 40, y: 55 },
    { x: 60, y: 30 },
    { x: 80, y: 40 },
    { x: 100, y: 15 },
  ]

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, "")

  return (
    <svg ref={ref} viewBox="0 0 100 70" className="w-full h-24">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(255,255,255)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="rgb(255,255,255)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {isInView && (
        <>
          <path d={`${pathD} L 100 70 L 0 70 Z`} fill="url(#chartGradient)" className="opacity-50" />
          <path d={pathD} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="draw-line" />
        </>
      )}
    </svg>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-instrument-sans)" }}
          >
            Everything you need to be productive
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            As someone with ADHD and autism, I created tools that make it unreasonable
            and impossible not to achieve our goals.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Large card - ObsiFlowz */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
                  <BookOpen className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">ObsiFlowz — Obsidian Plugins</h3>
                <p className="text-zinc-400 text-sm">
                  Transform your content curation with RSSFlowz and optimize your plugin management with PluginFlowz.
                  Powerful plugins designed for productivity and content management.
                </p>
              </div>
              <PluginActivity />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["RSSFlowz", "PluginFlowz", "ContentFlowz", "NoteFlowz"].map((plugin) => (
                <div key={plugin} className="text-center">
                  <div className="text-sm font-medium text-white mb-1">{plugin}</div>
                  <div className="text-xs text-zinc-500">Active</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chrome Extension */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Chrome className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">TubeFlowz</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Revolutionize your YouTube searches with a powerful Chrome extension for annotation and bookmarking.
            </p>
            <KeyboardShortcut />
          </motion.div>

          {/* Windows Tools */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Monitor className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Windows Mastery</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Unlock the full potential of Windows with over 200 tested and approved productivity tips and tools.
            </p>
            <AnimatedChart />
          </motion.div>

          {/* Productivity Boost */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Zap className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Blazing Fast Results</h3>
            <p className="text-zinc-400 text-sm mb-4">
              35% efficiency increase reported by users. Tools that actually save you time, not just look good.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-green)' }}>
              <span className="font-mono">+35%</span>
              <span className="text-zinc-500">avg efficiency</span>
            </div>
          </motion.div>

          {/* Smart Organization */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <GraduationCap className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Organization</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Categorize, discover and save — a structured workflow to tame digital chaos and find anything instantly.
            </p>
            <SmartOrganization />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
