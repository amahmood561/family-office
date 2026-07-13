import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Database,
  FileArchive,
  Files,
  Landmark,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  PieChart,
  Plane,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import './App.css'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
})

const seedData = {
  asOf: '2026-07-13T09:00:00-04:00',
  connection: 'seed',
  kpis: [
    { label: 'Net Worth', value: 284600000, delta: 0.028, tone: 'positive' },
    { label: 'Cash Position', value: 18500000, delta: -0.041, tone: 'warning' },
    { label: 'Monthly AP / AR', value: 1420000, delta: 0.012, tone: 'neutral' },
    { label: 'Open Risk Items', value: 17, delta: -0.105, tone: 'positive' },
  ],
  allocation: [
    { label: 'Public Markets', value: 92500000, color: '#2563eb' },
    { label: 'Private Equity', value: 61200000, color: '#0f766e' },
    { label: 'Real Estate', value: 54800000, color: '#b45309' },
    { label: 'Venture', value: 31800000, color: '#7c3aed' },
    { label: 'Hedge Funds', value: 26200000, color: '#be123c' },
    { label: 'Cash', value: 18500000, color: '#475569' },
  ],
  modules: [
    { name: 'Investments', status: 'Live', count: 86, icon: 'portfolio' },
    { name: 'Finance', status: 'Postgres Ready', count: 124, icon: 'finance' },
    { name: 'Operations', status: 'Buildout', count: 42, icon: 'operations' },
    { name: 'Entity Management', status: 'Live', count: 31, icon: 'entities' },
    { name: 'Tax', status: 'Deadline Watch', count: 18, icon: 'tax' },
    { name: 'Lifestyle', status: 'Buildout', count: 14, icon: 'lifestyle' },
    { name: 'Documents', status: 'Indexed', count: 1284, icon: 'documents' },
    { name: 'Compliance', status: 'Attention', count: 9, icon: 'compliance' },
  ],
  cash: [
    { account: 'Operating Treasury', institution: 'JPM Private Bank', balance: 7200000, runway: '11 mo', status: 'Healthy' },
    { account: 'Bill Pay Reserve', institution: 'First Republic', balance: 1800000, runway: '43 days', status: 'Refill' },
    { account: 'Opportunity Cash', institution: 'Goldman Sachs', balance: 9500000, runway: 'Flexible', status: 'Deployable' },
  ],
  upcoming: [
    { date: 'Jul 15', title: 'Q2 estimated tax package', owner: 'Tax', priority: 'High' },
    { date: 'Jul 18', title: 'Capital call approval: Horizon Fund IV', owner: 'Investments', priority: 'High' },
    { date: 'Jul 22', title: 'Trust annual minutes review', owner: 'Legal', priority: 'Medium' },
    { date: 'Jul 29', title: 'Aircraft insurance renewal', owner: 'Lifestyle', priority: 'Medium' },
  ],
  documents: [
    { type: 'Statements', name: 'June consolidated custody packet', owner: 'Finance', status: 'Needs Review' },
    { type: 'Trust Docs', name: 'Dynasty trust amendment draft', owner: 'Legal', status: 'Counsel Review' },
    { type: 'Tax Documents', name: 'K-1 intake tracker', owner: 'Tax', status: '72% Complete' },
    { type: 'Contracts', name: 'Household staff agreements', owner: 'Operations', status: 'Renewal' },
  ],
  activity: [
    { event: 'Capital call routed for approval', source: 'Private Equity', time: '15m ago' },
    { event: 'Cash forecast refreshed from treasury ledger', source: 'Finance', time: '42m ago' },
    { event: 'Registered agent notice attached to Aspen LLC', source: 'Compliance', time: '2h ago' },
    { event: 'New aircraft itinerary added to family calendar', source: 'Lifestyle', time: '4h ago' },
  ],
}

const iconMap = {
  portfolio: BriefcaseBusiness,
  finance: CircleDollarSign,
  operations: UsersRound,
  entities: Building2,
  tax: ReceiptText,
  lifestyle: Plane,
  documents: Files,
  compliance: ShieldCheck,
}

function formatValue(value) {
  return typeof value === 'number' && value > 1000 ? currency.format(value) : value
}

function Dashboard() {
  const [data, setData] = useState(seedData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true

    fetch('/api/dashboard')
      .then((response) => {
        if (!response.ok) throw new Error('Dashboard API unavailable')
        return response.json()
      })
      .then((payload) => {
        if (mounted) {
          setData(payload)
          setError('')
        }
      })
      .catch(() => {
        if (mounted) setError('Using local seed data until Postgres is connected.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const totalAllocation = useMemo(
    () => data.allocation.reduce((total, item) => total + item.value, 0),
    [data.allocation],
  )

  const filteredModules = data.modules.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Landmark size={22} />
          </div>
          <div>
            <strong>Amp Family Office</strong>
            <span>Operating Dashboard</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {[
            ['Dashboard', LayoutDashboard],
            ['Investments', PieChart],
            ['Entities', Building2],
            ['Finance', WalletCards],
            ['Documents', FileArchive],
            ['Compliance', ClipboardCheck],
            ['Tasks', ListChecks],
          ].map(([label, Icon], index) => (
            <button className={index === 0 ? 'active' : ''} type="button" key={label}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <section className="security-panel">
          <LockKeyhole size={18} />
          <div>
            <strong>Private infrastructure</strong>
            <span>Local React + Postgres-ready API</span>
          </div>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Executive dashboard</p>
            <h1>Family office command center</h1>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter modules"
              />
            </label>
            <span className={`status-pill ${data.connection}`}>
              <Database size={15} />
              {loading ? 'Loading' : data.connection === 'postgres' ? 'Postgres live' : 'Seed data'}
            </span>
          </div>
        </header>

        {error ? (
          <div className="notice">
            <AlertTriangle size={17} />
            {error}
          </div>
        ) : null}

        <section className="kpi-grid" aria-label="Executive KPIs">
          {data.kpis.map((item) => {
            const DeltaIcon = item.delta >= 0 ? ArrowUpRight : ArrowDownRight
            return (
              <article className="kpi-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{formatValue(item.value)}</strong>
                <small className={item.tone}>
                  <DeltaIcon size={15} />
                  {percent.format(Math.abs(item.delta))} vs prior period
                </small>
              </article>
            )
          })}
        </section>

        <section className="dashboard-grid">
          <article className="panel allocation-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Investments</p>
                <h2>Asset allocation</h2>
              </div>
              <TrendingUp size={20} />
            </div>
            <div className="allocation-bar">
              {data.allocation.map((item) => (
                <span
                  key={item.label}
                  style={{
                    width: `${(item.value / totalAllocation) * 100}%`,
                    background: item.color,
                  }}
                  title={`${item.label}: ${currency.format(item.value)}`}
                />
              ))}
            </div>
            <div className="allocation-list">
              {data.allocation.map((item) => (
                <div key={item.label}>
                  <span className="dot" style={{ background: item.color }} />
                  <span>{item.label}</span>
                  <strong>{currency.format(item.value)}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Treasury</p>
                <h2>Cash management</h2>
              </div>
              <Banknote size={20} />
            </div>
            <div className="table-list">
              {data.cash.map((item) => (
                <div className="table-row" key={item.account}>
                  <div>
                    <strong>{item.account}</strong>
                    <span>{item.institution}</span>
                  </div>
                  <div>
                    <strong>{currency.format(item.balance)}</strong>
                    <span>{item.runway}</span>
                  </div>
                  <small className={item.status.toLowerCase()}>{item.status}</small>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="module-grid" aria-label="Operating modules">
          {filteredModules.map((item) => {
            const Icon = iconMap[item.icon] || BriefcaseBusiness
            return (
              <article className="module-card" key={item.name}>
                <div className="module-icon">
                  <Icon size={19} />
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.status}</span>
                </div>
                <strong>{item.count}</strong>
                <ChevronRight size={17} />
              </article>
            )
          })}
        </section>

        <section className="lower-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Deadlines</p>
                <h2>Upcoming work</h2>
              </div>
              <CalendarClock size={20} />
            </div>
            <div className="timeline">
              {data.upcoming.map((item) => (
                <div className="timeline-item" key={item.title}>
                  <time>{item.date}</time>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.owner}</span>
                  </div>
                  <small className={item.priority.toLowerCase()}>{item.priority}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Documents</p>
                <h2>Review queue</h2>
              </div>
              <Files size={20} />
            </div>
            <div className="document-list">
              {data.documents.map((item) => (
                <div key={item.name}>
                  <FileArchive size={18} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.type} · {item.owner}</span>
                  </div>
                  <small>{item.status}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Operations</p>
                <h2>Latest activity</h2>
              </div>
              <Clock3 size={20} />
            </div>
            <div className="activity-list">
              {data.activity.map((item) => (
                <div key={`${item.event}-${item.time}`}>
                  <CheckCircle2 size={17} />
                  <div>
                    <strong>{item.event}</strong>
                    <span>{item.source} · {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="insight-panel">
            <Sparkles size={21} />
            <p className="eyebrow">Infrastructure</p>
            <h2>Built for controlled operations</h2>
            <p>
              The dashboard is organized around clear modules, permission-ready workflows, and API contracts that can
              connect to accounting, banking, legal, tax, and document systems.
            </p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
