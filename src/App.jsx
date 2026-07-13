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

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'investments', label: 'Investments', icon: PieChart },
  { key: 'entities', label: 'Entities', icon: Building2 },
  { key: 'finance', label: 'Finance', icon: WalletCards },
  { key: 'documents', label: 'Documents', icon: FileArchive },
  { key: 'compliance', label: 'Compliance', icon: ClipboardCheck },
  { key: 'tasks', label: 'Tasks', icon: ListChecks },
]

const modulePageMap = {
  Investments: 'investments',
  Finance: 'finance',
  Operations: 'tasks',
  'Entity Management': 'entities',
  Tax: 'compliance',
  Lifestyle: 'tasks',
  Documents: 'documents',
  Compliance: 'compliance',
}

const pageDetails = {
  investments: {
    eyebrow: 'Investments',
    title: 'Portfolio management',
    summary: 'Monitor public markets, alternatives, capital calls, real estate, venture, and cash exposure.',
    metrics: [
      ['Total AUM', '$284.6M'],
      ['YTD Return', '+8.4%'],
      ['Open Capital Calls', '$3.2M'],
      ['Managers', '27'],
    ],
    rows: [
      ['Public Markets', '$92.5M', '+5.8%', 'Rebalanced'],
      ['Private Equity', '$61.2M', '+11.3%', '2 capital calls'],
      ['Real Estate', '$54.8M', '+4.1%', 'Appraisal pending'],
      ['Venture Capital', '$31.8M', '+18.6%', 'Quarterly marks due'],
      ['Hedge Funds', '$26.2M', '+3.2%', 'Monthly packet ready'],
    ],
  },
  entities: {
    eyebrow: 'Entity management',
    title: 'Trusts, LLCs, partnerships, and foundations',
    summary: 'Track entity status, registered agents, ownership records, estate documents, and annual actions.',
    metrics: [
      ['Active Entities', '31'],
      ['Trusts', '8'],
      ['LLCs', '14'],
      ['Annual Reviews', '6'],
    ],
    rows: [
      ['Mahmood Dynasty Trust', 'Trust', 'Legal review', 'Minutes due Jul 22'],
      ['Aspen Holdings LLC', 'LLC', 'Good standing', 'RA notice attached'],
      ['AM Family Foundation', 'Foundation', 'Active', 'Grant review pending'],
      ['Northstar Partners LP', 'Partnership', 'Active', 'K-1 expected'],
      ['Harbor Real Estate Co.', 'Holding Co.', 'Active', 'Insurance renewal'],
    ],
  },
  finance: {
    eyebrow: 'Finance',
    title: 'Accounting, treasury, AP / AR, and forecasting',
    summary: 'Support QuickBooks, NetSuite, banking, bill pay, treasury, cash forecasting, and reporting workflows.',
    metrics: [
      ['Cash', '$18.5M'],
      ['AP Queue', '$860K'],
      ['AR Expected', '$560K'],
      ['Runway', '9.7 mo'],
    ],
    rows: [
      ['Operating Treasury', 'JPM Private Bank', '$7.2M', 'Healthy'],
      ['Bill Pay Reserve', 'First Republic', '$1.8M', 'Refill'],
      ['Opportunity Cash', 'Goldman Sachs', '$9.5M', 'Deployable'],
      ['Vendor Payables', 'AP / AR', '$860K', 'Approval queue'],
      ['Forecast Model', 'Treasury', '13 weeks', 'Updated today'],
    ],
  },
  documents: {
    eyebrow: 'Documents',
    title: 'Contracts, statements, tax files, and legal archive',
    summary: 'Centralize document review across trust docs, insurance, statements, contracts, and tax packages.',
    metrics: [
      ['Indexed Docs', '1,284'],
      ['Needs Review', '18'],
      ['Tax Files', '94'],
      ['Legal Files', '212'],
    ],
    rows: [
      ['June consolidated custody packet', 'Statements', 'Finance', 'Needs Review'],
      ['Dynasty trust amendment draft', 'Trust Docs', 'Legal', 'Counsel Review'],
      ['K-1 intake tracker', 'Tax Documents', 'Tax', '72% Complete'],
      ['Household staff agreements', 'Contracts', 'Operations', 'Renewal'],
      ['Aircraft insurance binder', 'Insurance', 'Lifestyle', 'Renewal'],
    ],
  },
  compliance: {
    eyebrow: 'Compliance and tax',
    title: 'Filings, deadlines, approvals, and audit trail',
    summary: 'Track tax returns, K-1s, CPA handoffs, entity filings, annual reports, and approval history.',
    metrics: [
      ['Risk Items', '17'],
      ['High Priority', '4'],
      ['Filings Due', '9'],
      ['K-1s Open', '12'],
    ],
    rows: [
      ['Q2 estimated tax package', 'Tax', 'High', 'Due Jul 15'],
      ['Registered agent notice', 'Compliance', 'Medium', 'Attached'],
      ['Annual report batch', 'Entity Filings', 'High', '6 remaining'],
      ['K-1 collection', 'Tax', 'Medium', '72% complete'],
      ['Approval history review', 'Audit Trail', 'Low', 'Ready'],
    ],
  },
  tasks: {
    eyebrow: 'Operations',
    title: 'Tasks, lifestyle, workflows, and household operations',
    summary: 'Coordinate CRM, email, calendar, tasks, workflow automation, travel, events, staff, and security.',
    metrics: [
      ['Open Tasks', '42'],
      ['Due This Week', '11'],
      ['Travel Items', '5'],
      ['Staff Actions', '8'],
    ],
    rows: [
      ['Aircraft insurance renewal', 'Lifestyle', 'Medium', 'Due Jul 29'],
      ['Capital call approval', 'Investments', 'High', 'Due Jul 18'],
      ['Family calendar sync', 'Operations', 'Medium', 'Updated'],
      ['Household staff agreements', 'Operations', 'Medium', 'Renewal'],
      ['Security vendor review', 'Lifestyle', 'High', 'In progress'],
    ],
  },
}

function formatValue(value) {
  return typeof value === 'number' && value > 1000 ? currency.format(value) : value
}

function Dashboard() {
  const [data, setData] = useState(seedData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activePage, setActivePage] = useState('dashboard')

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
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              className={activePage === key ? 'active' : ''}
              type="button"
              key={key}
              onClick={() => setActivePage(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* <section className="security-panel">
          <LockKeyhole size={18} />
          <div>
            <strong>Private infrastructure</strong>
            <span>Local React + Postgres-ready API</span>
          </div>
        </section> */}
      </aside>

      <section className="workspace">
        {activePage === 'dashboard' ? <header className="topbar">
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
        </header> : null}

        {error ? (
          <div className="notice">
            <AlertTriangle size={17} />
            {error}
          </div>
        ) : null}

        {activePage === 'dashboard' ? (
          <>
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
              <button
                className="module-card"
                key={item.name}
                type="button"
                onClick={() => setActivePage(modulePageMap[item.name] || 'dashboard')}
              >
                <div className="module-icon">
                  <Icon size={19} />
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.status}</span>
                </div>
                <strong>{item.count}</strong>
                <ChevronRight size={17} />
              </button>
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
          </>
        ) : (
          <DetailPage page={pageDetails[activePage]} setActivePage={setActivePage} />
        )}
      </section>
    </main>
  )
}

function DetailPage({ page, setActivePage }) {
  return (
    <section className="detail-view">
      <header className="detail-hero">
        <button type="button" onClick={() => setActivePage('dashboard')}>
          <LayoutDashboard size={17} />
          Dashboard
        </button>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.summary}</p>
      </header>

      <section className="kpi-grid detail-kpis" aria-label={`${page.title} metrics`}>
        {page.metrics.map(([label, value]) => (
          <article className="kpi-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small className="neutral">Current demo view</small>
          </article>
        ))}
      </section>

      <article className="panel detail-table">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>{page.title} records</h2>
          </div>
          <ClipboardCheck size={20} />
        </div>

        <div className="record-list">
          {page.rows.map((row) => (
            <div className="record-row" key={row.join('-')}>
              {row.map((cell, index) => (
                <span key={`${cell}-${index}`} className={index === 0 ? 'record-title' : ''}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default Dashboard
