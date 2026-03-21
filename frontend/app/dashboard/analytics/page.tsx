// frontend/app/dashboard/analytics/page.tsx
"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft, TrendingUp, TrendingDown, Users, FolderOpen,
  CheckCircle2, Clock, AlertCircle, Calendar, BarChart3,
  Activity, Target, Award, RefreshCcw, Download, Filter, X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ── Mock Data ──────────────────────────────────────────────
const weeklyActivity = [
  { day: "Mon", tasks: 8,  completed: 6,  messages: 24 },
  { day: "Tue", tasks: 12, completed: 10, messages: 31 },
  { day: "Wed", tasks: 6,  completed: 4,  messages: 18 },
  { day: "Thu", tasks: 15, completed: 13, messages: 42 },
  { day: "Fri", tasks: 10, completed: 9,  messages: 28 },
  { day: "Sat", tasks: 4,  completed: 4,  messages: 9  },
  { day: "Sun", tasks: 2,  completed: 2,  messages: 5  },
]

const monthlyProgress = [
  { month: "Aug", progress: 42 },
  { month: "Sep", progress: 58 },
  { month: "Oct", progress: 51 },
  { month: "Nov", progress: 67 },
  { month: "Dec", progress: 74 },
  { month: "Jan", progress: 68 },
]

const projectHealth = [
  { name: "Website Redesign",        progress: 75, status: "on-track",  tasks: 12, done: 9,  members: 4, risk: "low"    },
  { name: "Mobile App Development",  progress: 45, status: "on-track",  tasks: 24, done: 11, members: 3, risk: "medium" },
  { name: "Marketing Campaign",      progress: 90, status: "at-risk",   tasks: 8,  done: 7,  members: 2, risk: "high"   },
  { name: "Database Migration",      progress: 20, status: "delayed",   tasks: 15, done: 3,  members: 2, risk: "high"   },
]

const teamPerformance = [
  { name: "Sarah Chen",   initials: "SC", tasksCompleted: 18, onTime: 16, efficiency: 89, role: "Frontend Dev"   },
  { name: "Mike Johnson", initials: "MJ", tasksCompleted: 22, onTime: 19, efficiency: 86, role: "Backend Dev"    },
  { name: "Alex Rivera",  initials: "AR", tasksCompleted: 15, onTime: 15, efficiency: 100,role: "UI/UX Designer"  },
  { name: "Emma Davis",   initials: "ED", tasksCompleted: 12, onTime: 10, efficiency: 83, role: "QA Engineer"    },
  { name: "David Kim",    initials: "DK", tasksCompleted: 9,  onTime: 8,  efficiency: 89, role: "DevOps"         },
]

const taskDistribution = [
  { label: "Completed",   value: 47, color: "#50c878" },
  { label: "In Progress", value: 18, color: "#5CAFC4" },
  { label: "Review",      value: 8,  color: "#ffd700" },
  { label: "To Do",       value: 27, color: "rgba(92,124,137,0.5)" },
]

const recentActivity = [
  { id: 1, user: "Sarah Chen",   initials: "SC", action: "completed task",    target: "Homepage Mockup",        time: "2m ago",   type: "complete" },
  { id: 2, user: "Mike Johnson", initials: "MJ", action: "updated progress",  target: "Auth Flow",              time: "15m ago",  type: "update"   },
  { id: 3, user: "Alex Rivera",  initials: "AR", action: "created task",      target: "Mobile Wireframes",      time: "1h ago",   type: "create"   },
  { id: 4, user: "Emma Davis",   initials: "ED", action: "flagged at-risk",   target: "Marketing Campaign",     time: "2h ago",   type: "risk"     },
  { id: 5, user: "David Kim",    initials: "DK", action: "deployed to staging","target": "Website Redesign",   time: "3h ago",   type: "deploy"   },
  { id: 6, user: "Sarah Chen",   initials: "SC", action: "added comment",     target: "Database Migration",     time: "4h ago",   type: "comment"  },
  { id: 7, user: "Mike Johnson", initials: "MJ", action: "resolved blocker",  target: "API Integration",        time: "5h ago",   type: "complete" },
]

// ── Helpers ────────────────────────────────────────────────
function authorColor(name: string) {
  const c = ["#5CAFC4","#c084fc","#50c878","#ff8a65","#ffd700","#f472b6"]
  return c[name.charCodeAt(0) % c.length]
}
function riskColor(r: string) {
  return r === "high" ? "#ff8a65" : r === "medium" ? "#ffd700" : "#50c878"
}
function activityIcon(type: string) {
  switch (type) {
    case "complete": return <CheckCircle2 size={13} style={{ color: "#50c878" }} />
    case "update":   return <RefreshCcw   size={13} style={{ color: "#5CAFC4" }} />
    case "create":   return <FolderOpen   size={13} style={{ color: "#c084fc" }} />
    case "risk":     return <AlertCircle  size={13} style={{ color: "#ff8a65" }} />
    case "deploy":   return <Activity     size={13} style={{ color: "#ffd700" }} />
    default:         return <Clock        size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
  }
}

// ── Animated Bar ──────────────────────────────────────────
function AnimBar({ value, max, color, height = 8 }: { value: number; max: number; color: string; height?: number }) {
  return (
    <div className="rounded-full overflow-hidden w-full" style={{ height, backgroundColor: "rgba(92,124,137,0.15)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  )
}

// ── Mini Sparkline ─────────────────────────────────────────
function Sparkline({ data, color, width = 80, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  )
}

// ── Donut Chart ────────────────────────────────────────────
function DonutChart({ data, size = 120 }: { data: typeof taskDistribution; size?: number }) {
  const total = data.reduce((a, d) => a + d.value, 0)
  const r = (size / 2) - 18
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  let cumulative = 0

  return (
    <svg width={size} height={size}>
      {data.map((seg, i) => {
        const fraction = seg.value / total
        const offset = circumference - fraction * circumference
        const rotation = (cumulative / total) * 360 - 90
        cumulative += seg.value
        return (
          <motion.circle
            key={seg.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeDasharray={`${fraction * circumference} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${cx} ${cy})`}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${fraction * circumference} ${circumference}` }}
            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
            strokeLinecap="round"
          />
        )
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={18} fontWeight={700} fill="white" fontFamily="'Cormorant Garamond',serif">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)" fontFamily="'DM Sans',sans-serif" letterSpacing="1">TASKS</text>
    </svg>
  )
}

// ── Vertical Bar Chart ─────────────────────────────────────
function BarChart({ data, dark }: { data: typeof weeklyActivity; dark: boolean }) {
  const maxTasks = Math.max(...data.map(d => d.tasks))
  const h = 100

  return (
    <div className="flex items-end justify-between gap-2 w-full" style={{ height: h + 32 }}>
      {data.map((d, i) => (
        <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
          <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: h }}>
            {/* Completed */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.completed / maxTasks) * h}px` }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
              className="rounded-t-lg flex-1"
              style={{ background: "linear-gradient(180deg,#50c878,#1F4959)", maxWidth: 14 }}
            />
            {/* Total - completed */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${((d.tasks - d.completed) / maxTasks) * h}px` }}
              transition={{ duration: 0.7, delay: i * 0.08 + 0.05, ease: "easeOut" }}
              className="rounded-t-lg flex-1"
              style={{ background: dark ? "rgba(92,124,137,0.3)" : "rgba(31,73,89,0.15)", maxWidth: 14 }}
            />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem" }}>{d.day}</span>
        </div>
      ))}
    </div>
  )
}

// ── Line Chart ─────────────────────────────────────────────
function LineChart({ data, dark }: { data: typeof monthlyProgress; dark: boolean }) {
  const max = Math.max(...data.map(d => d.progress))
  const min = Math.min(...data.map(d => d.progress))
  const w = 100
  const h = 70
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((d.progress - min) / (max - min || 1)) * (h - 10) - 5
    return { x, y, ...d }
  })
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${path} L ${pts[pts.length-1].x} ${h+5} L 0 ${h+5} Z`

  return (
    <div className="w-full" style={{ paddingBottom: 20 }}>
      <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full" style={{ height: 100, overflow: "visible" }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5CAFC4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5CAFC4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <motion.path d={areaPath} fill="url(#lineGrad)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
        <motion.path d={path} fill="none" stroke="#5CAFC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />
        {pts.map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r={3} fill="#5CAFC4"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }} />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map(d => (
          <span key={d.month} className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6rem" }}>{d.month}</span>
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function AnalyticsPage() {
  const router = useRouter()
  const [dark, setDark]           = useState(true)
  const [period, setPeriod]       = useState<"week" | "month" | "quarter">("week")
  const [refreshing, setRefreshing] = useState(false)
  const [activeProject, setActiveProject] = useState("all")

  useEffect(() => {
    const th = localStorage.getItem("karyalaya_theme")
    if (th) setDark(th === "dark")
    const handler = (e: StorageEvent) => { if (e.key === "karyalaya_theme") setDark(e.newValue === "dark") }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  // Theme tokens
  const pageBg  = dark ? "#060e16"               : "#d5ecf8"
  const navBg   = dark ? "rgba(6,14,22,0.96)"    : "rgba(213,236,248,0.96)"
  const cardBg  = dark ? "rgba(10,22,34,0.78)"   : "rgba(195,228,244,0.72)"
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const txtPri  = dark ? "#ffffff"               : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.5)"

  // KPI cards
  const kpis = [
    { label: "Total Tasks",       value: 100, change: "+12", up: true,  color: "#5CAFC4", spark: [60,72,65,80,75,88,100], icon: CheckCircle2 },
    { label: "Completion Rate",   value: "68%",change: "+5%",up: true,  color: "#50c878", spark: [55,60,58,63,65,70,68],  icon: Target },
    { label: "Active Members",    value: 5,   change: "+1",  up: true,  color: "#c084fc", spark: [3,3,4,4,5,5,5],         icon: Users },
    { label: "Overdue Tasks",     value: 3,   change: "-2",  up: false, color: "#ff8a65", spark: [8,7,6,5,6,5,3],         icon: AlertCircle },
    { label: "Active Projects",   value: 4,   change: "0",   up: true,  color: "#ffd700", spark: [2,2,3,3,4,4,4],         icon: FolderOpen },
    { label: "Avg Team Efficiency",value:"89%",change:"+3%", up: true,  color: "#f472b6", spark: [80,82,85,86,88,87,89],  icon: Award },
  ]

  // Card component
  const Card = ({ children, className = "", style = {} }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${bdr}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(31,73,89,0.06)",
        ...style,
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.25),transparent)" }} />
      {children}
    </motion.div>
  )

  const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
    <div className="mb-4">
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 700, color: txtPri }}>{children}</h2>
      {sub && <p className="text-xs mt-0.5" style={{ color: txtMut }}>{sub}</p>}
    </div>
  )

  return (
    <div className="flex flex-col"
      style={{ minHeight: "100dvh", backgroundColor: pageBg, color: txtPri, fontFamily: "'DM Sans',sans-serif", transition: "background-color 0.4s ease" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 flex-shrink-0"
        style={{ height: 60, backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)" }}>

        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          onClick={() => router.push("/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.2)", color: txtPri, border: `1px solid ${bdr}`, cursor: "pointer" }}>
          <ArrowLeft size={16} />
        </motion.button>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, fontStyle: "italic", color: txtPri }}>
          Analytics
        </h1>

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Period selector */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${bdr}` }}>
            {(["week","month","quarter"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-3 py-1.5 text-xs font-medium capitalize"
                style={{
                  backgroundColor: period === p ? (dark ? "rgba(31,73,89,0.6)" : "rgba(31,73,89,0.15)") : "transparent",
                  color: period === p ? (dark ? "#A7D0E3" : "#1F4959") : txtMut,
                  cursor: "pointer", transition: "all 0.1s ease",
                }}>
                {p}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={handleRefresh}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.18)", border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>
            <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.6, ease: "linear" }}>
              <RefreshCcw size={15} />
            </motion.div>
          </motion.button>

          {/* Export */}
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium"
            style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", color: "#fff", cursor: "pointer", border: "1px solid rgba(92,124,137,0.3)" }}>
            <Download size={14} /> Export
          </motion.button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div style={{ padding: "24px 16px", maxWidth: 1400, margin: "0 auto" }} className="lg:px-8 space-y-8">

          {/* ── KPI Cards ── */}
          <section>
            <SectionTitle sub={`Key metrics for this ${period}`}>Overview</SectionTitle>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon
                return (
                  <motion.div key={kpi.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    whileHover={{ y: -3 }}
                    className="relative rounded-2xl p-4 overflow-hidden"
                    style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}>
                    <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.22),transparent)" }} />
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${kpi.color}18`, border: `1px solid ${kpi.color}28` }}>
                        <Icon size={15} style={{ color: kpi.color }} />
                      </div>
                      <div className={`flex items-center gap-0.5 text-xs font-medium`}
                        style={{ color: kpi.up ? "#50c878" : "#ff8a65" }}>
                        {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {kpi.change}
                      </div>
                    </div>
                    <p className="text-2xl font-bold mb-0.5" style={{ color: kpi.color, fontFamily: "'Cormorant Garamond',serif" }}>{kpi.value}</p>
                    <p className="text-xs mb-2" style={{ color: txtMut, fontSize: "0.65rem" }}>{kpi.label}</p>
                    <Sparkline data={kpi.spark} color={kpi.color} width={70} height={22} />
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* ── Charts Row ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Weekly Activity */}
            <Card className="lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 700, color: txtPri }}>Weekly Activity</h3>
                  <p className="text-xs mt-0.5" style={{ color: txtMut }}>Tasks created vs completed per day</p>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: txtMut }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "linear-gradient(180deg,#50c878,#1F4959)" }} />
                    Completed
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: dark ? "rgba(92,124,137,0.3)" : "rgba(31,73,89,0.15)" }} />
                    Remaining
                  </div>
                </div>
              </div>
              <BarChart data={weeklyActivity} dark={dark} />
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${bdr}` }}>
                {[
                  { label: "Total Tasks",     value: weeklyActivity.reduce((a,d) => a+d.tasks, 0) },
                  { label: "Completed",       value: weeklyActivity.reduce((a,d) => a+d.completed, 0) },
                  { label: "Messages Sent",   value: weeklyActivity.reduce((a,d) => a+d.messages, 0) },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold" style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif" }}>{s.value}</p>
                    <p className="text-xs" style={{ color: txtMut, fontSize: "0.65rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Task Distribution Donut */}
            <Card className="p-5">
              <h3 className="mb-1" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 700, color: txtPri }}>Task Distribution</h3>
              <p className="text-xs mb-5" style={{ color: txtMut }}>Current status breakdown</p>
              <div className="flex flex-col items-center gap-5">
                <DonutChart data={taskDistribution} size={130} />
                <div className="w-full space-y-2.5">
                  {taskDistribution.map(seg => (
                    <div key={seg.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-xs" style={{ color: txtMut }}>{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AnimBar value={seg.value} max={100} color={seg.color} height={4} />
                        <span className="text-xs font-semibold w-6 text-right" style={{ color: txtPri }}>{seg.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          {/* ── Monthly Progress Line ── */}
          <section>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 700, color: txtPri }}>Monthly Progress Trend</h3>
                  <p className="text-xs mt-0.5" style={{ color: txtMut }}>Overall project completion rate over the last 6 months</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#50c878" }}>
                  <TrendingUp size={15} /> +26% since Aug
                </div>
              </div>
              <LineChart data={monthlyProgress} dark={dark} />
            </Card>
          </section>

          {/* ── Project Health ── */}
          <section>
            <SectionTitle sub="Real-time health status of all active projects">Project Health</SectionTitle>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", ...projectHealth.map(p => p.name.split(" ")[0])].map(f => (
                <motion.button key={f} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveProject(f)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium capitalize"
                  style={{
                    backgroundColor: activeProject === f ? (dark ? "rgba(31,73,89,0.6)" : "rgba(31,73,89,0.15)") : (dark ? "rgba(31,73,89,0.2)" : "rgba(92,160,200,0.12)"),
                    color: activeProject === f ? (dark ? "#A7D0E3" : "#1F4959") : txtMut,
                    border: `1px solid ${activeProject === f ? (dark ? "rgba(92,124,137,0.35)" : "rgba(31,73,89,0.2)") : bdr}`,
                    cursor: "pointer", transition: "all 0.1s ease",
                  }}>
                  {f === "all" ? "All Projects" : f}
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence>
                {projectHealth
                  .filter(p => activeProject === "all" || p.name.split(" ")[0] === activeProject)
                  .map((project, i) => (
                    <motion.div key={project.name}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -2 }}
                      className="relative rounded-2xl p-5"
                      style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}>
                      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.2),transparent)" }} />

                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1" style={{ color: txtPri }}>{project.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: project.status === "on-track" ? "rgba(80,200,120,0.15)" : project.status === "at-risk" ? "rgba(255,200,80,0.15)" : "rgba(255,100,100,0.15)",
                                color: project.status === "on-track" ? "#50c878" : project.status === "at-risk" ? "#ffd700" : "#ff6b6b",
                              }}>
                              {project.status.replace("-", " ")}
                            </span>
                            <span className="text-xs flex items-center gap-1" style={{ color: riskColor(project.risk) }}>
                              <AlertCircle size={10} /> {project.risk} risk
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif" }}>{project.progress}%</p>
                          <p className="text-xs" style={{ color: txtMut }}>complete</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <AnimBar
                          value={project.progress}
                          max={100}
                          color={project.progress >= 80 ? "#50c878" : project.progress >= 50 ? "#5CAFC4" : "#ff8a65"}
                          height={8}
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Tasks",   value: `${project.done}/${project.tasks}` },
                          { label: "Members", value: project.members },
                          { label: "Pending", value: project.tasks - project.done },
                        ].map(s => (
                          <div key={s.label} className="text-center rounded-xl py-2"
                            style={{ backgroundColor: dark ? "rgba(31,73,89,0.2)" : "rgba(92,160,200,0.1)" }}>
                            <p className="text-sm font-semibold" style={{ color: txtPri }}>{s.value}</p>
                            <p className="text-xs" style={{ color: txtMut, fontSize: "0.62rem" }}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </section>

          {/* ── Team Performance ── */}
          <section>
            <SectionTitle sub="Individual contributor metrics and efficiency scores">Team Performance</SectionTitle>
            <Card className="overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-3 px-5 py-3 text-xs font-semibold tracking-widest uppercase"
                style={{ color: txtMut, borderBottom: `1px solid ${bdr}`, fontSize: "0.62rem" }}>
                <span className="col-span-2">Member</span>
                <span className="text-center hidden sm:block">Completed</span>
                <span className="text-center hidden md:block">On Time</span>
                <span className="text-right">Efficiency</span>
              </div>

              {/* Rows */}
              {teamPerformance.map((member, i) => (
                <motion.div key={member.name}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="grid grid-cols-5 gap-3 px-5 py-4 items-center group"
                  style={{ borderBottom: i < teamPerformance.length - 1 ? `1px solid ${bdr}` : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = dark ? "rgba(31,73,89,0.15)" : "rgba(92,160,200,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 col-span-2 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${authorColor(member.name)}88,${authorColor(member.name)})` }}>
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: txtPri }}>{member.name}</p>
                      <p className="text-xs truncate" style={{ color: txtMut }}>{member.role}</p>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="text-center hidden sm:block">
                    <p className="text-sm font-semibold" style={{ color: txtPri }}>{member.tasksCompleted}</p>
                    <p className="text-xs" style={{ color: txtMut, fontSize: "0.62rem" }}>tasks</p>
                  </div>

                  {/* On time */}
                  <div className="text-center hidden md:block">
                    <p className="text-sm font-semibold" style={{ color: "#50c878" }}>{member.onTime}</p>
                    <p className="text-xs" style={{ color: txtMut, fontSize: "0.62rem" }}>on time</p>
                  </div>

                  {/* Efficiency bar */}
                  <div className="flex items-center gap-2 justify-end">
                    <div className="flex-1 hidden sm:block" style={{ maxWidth: 80 }}>
                      <AnimBar
                        value={member.efficiency}
                        max={100}
                        color={member.efficiency >= 90 ? "#50c878" : member.efficiency >= 80 ? "#5CAFC4" : "#ffd700"}
                        height={6}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right"
                      style={{ color: member.efficiency >= 90 ? "#50c878" : member.efficiency >= 80 ? "#5CAFC4" : "#ffd700" }}>
                      {member.efficiency}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </Card>
          </section>

          {/* ── Bottom 2-col ── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Recent Activity Feed */}
            <div>
              <SectionTitle sub="Latest actions across all projects">Activity Feed</SectionTitle>
              <Card className="p-5">
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 group"
                    >
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${authorColor(item.user)}88,${authorColor(item.user)})`, fontSize: "0.58rem" }}>
                        {item.initials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed">
                          <span className="font-semibold" style={{ color: txtPri }}>{item.user}</span>
                          {" "}<span style={{ color: txtMut }}>{item.action}</span>{" "}
                          <span className="font-medium" style={{ color: "#5CAFC4" }}>{item.target}</span>
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{item.time}</p>
                      </div>

                      {/* Icon badge */}
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.15)" }}>
                        {activityIcon(item.type)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  className="w-full mt-4 pt-3 text-xs text-center"
                  style={{ borderTop: `1px solid ${bdr}`, color: "#5CAFC4", cursor: "pointer", transition: "opacity 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  View all activity →
                </button>
              </Card>
            </div>

            {/* Quick Insights */}
            <div>
              <SectionTitle sub="AI-driven insights about your team's performance">Quick Insights</SectionTitle>
              <div className="flex flex-col gap-3">
                {[
                  { icon: TrendingUp, color: "#50c878", title: "Productivity Up",     body: "Team completed 13% more tasks this week compared to last week. Keep up the momentum!" },
                  { icon: AlertCircle, color: "#ff8a65", title: "3 Tasks Overdue",    body: "Database Migration has 3 overdue tasks. Consider redistributing workload to stay on track." },
                  { icon: Award,       color: "#ffd700", title: "Top Performer",      body: "Alex Rivera achieved 100% on-time task completion this period. Outstanding work!" },
                  { icon: Target,      color: "#c084fc", title: "Sprint Goal at 68%", body: "Current sprint is 68% complete with 3 days remaining. You're on track to hit the goal." },
                ].map((insight, i) => {
                  const Icon = insight.icon
                  return (
                    <motion.div key={insight.title}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="relative rounded-2xl p-4 flex items-start gap-3"
                      style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)", cursor: "default" }}>
                      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.18),transparent)" }} />
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${insight.color}18`, border: `1px solid ${insight.color}28` }}>
                        <Icon size={16} style={{ color: insight.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-0.5" style={{ color: txtPri }}>{insight.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: txtMut }}>{insight.body}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── Velocity Heatmap (message activity) ── */}
          <section>
            <SectionTitle sub="Message + collaboration activity heatmap this week">Collaboration Pulse</SectionTitle>
            <Card className="p-5">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weeklyActivity.map((d, i) => (
                  <div key={d.day} className="flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full rounded-xl flex items-center justify-center text-xs font-semibold"
                      style={{
                        height: Math.max(40, (d.messages / 45) * 80),
                        background: `rgba(92,160,200,${0.15 + (d.messages / 45) * 0.7})`,
                        border: `1px solid rgba(92,160,200,${0.2 + (d.messages / 45) * 0.4})`,
                        color: txtPri,
                        transition: "all 0.3s",
                      }}>
                      {d.messages}
                    </motion.div>
                    <span className="text-xs" style={{ color: txtMut, fontSize: "0.62rem" }}>{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${bdr}` }}>
                <p className="text-xs" style={{ color: txtMut }}>Total messages this week: <span style={{ color: txtPri, fontWeight: 600 }}>{weeklyActivity.reduce((a,d) => a+d.messages, 0)}</span></p>
                <p className="text-xs" style={{ color: "#50c878" }}>↑ 18% vs last week</p>
              </div>
            </Card>
          </section>

        </div>

        {/* Footer */}
        <div className="px-8 py-4" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="flex items-center justify-center gap-3">
            <p className="text-xs tracking-[0.15em] uppercase" style={{ color: dark ? "rgba(255,255,255,0.18)" : "rgba(11,46,58,0.25)" }}>© 2025 KaryaLaya</p>
            <div className="w-px h-3" style={{ backgroundColor: dark ? "rgba(92,124,137,0.35)" : "rgba(31,73,89,0.2)" }} />
            <p style={{ color: dark ? "rgba(167,208,227,0.3)" : "rgba(31,73,89,0.3)", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem" }}>Crafted by Satyam Kumar</p>
          </div>
        </div>
      </main>
    </div>
  )
}