import pg from 'pg'
import { dashboardSeed } from './seed.js'

const { Pool } = pg

let pool

export function getPool() {
  if (!process.env.DATABASE_URL) return null
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

export async function fetchDashboard() {
  const db = getPool()

  if (!db) {
    return dashboardSeed
  }

  try {
    await ensureSchema(db)

    const [
      kpis,
      allocation,
      modules,
      cash,
      upcoming,
      documents,
      activity,
    ] = await Promise.all([
      db.query('select label, value, delta, tone from executive_kpis order by sort_order'),
      db.query('select label, value, color from asset_allocation order by sort_order'),
      db.query('select name, status, count, icon from operating_modules order by sort_order'),
      db.query('select account, institution, balance, runway, status from cash_accounts order by sort_order'),
      db.query('select due_label as date, title, owner, priority from upcoming_work order by sort_order'),
      db.query('select type, name, owner, status from document_queue order by sort_order'),
      db.query('select event, source, time_label as time from activity_log order by sort_order'),
    ])

    return {
      asOf: new Date().toISOString(),
      connection: 'postgres',
      kpis: kpis.rows.map((row) => ({
        ...row,
        value: Number(row.value),
        delta: Number(row.delta),
      })),
      allocation: allocation.rows.map((row) => ({
        ...row,
        value: Number(row.value),
      })),
      modules: modules.rows,
      cash: cash.rows.map((row) => ({
        ...row,
        balance: Number(row.balance),
      })),
      upcoming: upcoming.rows,
      documents: documents.rows,
      activity: activity.rows,
    }
  } catch (error) {
    console.warn('Postgres unavailable, returning seed dashboard:', error.message)
    return dashboardSeed
  }
}

async function ensureSchema(db) {
  await db.query(`
    create table if not exists executive_kpis (
      id bigserial primary key,
      label text not null,
      value numeric not null,
      delta numeric not null default 0,
      tone text not null default 'neutral',
      sort_order integer not null default 0
    );

    create table if not exists asset_allocation (
      id bigserial primary key,
      label text not null,
      value numeric not null,
      color text not null,
      sort_order integer not null default 0
    );

    create table if not exists operating_modules (
      id bigserial primary key,
      name text not null,
      status text not null,
      count integer not null default 0,
      icon text not null,
      sort_order integer not null default 0
    );

    create table if not exists cash_accounts (
      id bigserial primary key,
      account text not null,
      institution text not null,
      balance numeric not null,
      runway text not null,
      status text not null,
      sort_order integer not null default 0
    );

    create table if not exists upcoming_work (
      id bigserial primary key,
      due_label text not null,
      title text not null,
      owner text not null,
      priority text not null,
      sort_order integer not null default 0
    );

    create table if not exists document_queue (
      id bigserial primary key,
      type text not null,
      name text not null,
      owner text not null,
      status text not null,
      sort_order integer not null default 0
    );

    create table if not exists activity_log (
      id bigserial primary key,
      event text not null,
      source text not null,
      time_label text not null,
      sort_order integer not null default 0
    );
  `)

  const { rows } = await db.query('select count(*)::int as count from executive_kpis')
  if (rows[0].count > 0) return

  await seedTable(db, 'executive_kpis', ['label', 'value', 'delta', 'tone'], dashboardSeed.kpis)
  await seedTable(db, 'asset_allocation', ['label', 'value', 'color'], dashboardSeed.allocation)
  await seedTable(db, 'operating_modules', ['name', 'status', 'count', 'icon'], dashboardSeed.modules)
  await seedTable(db, 'cash_accounts', ['account', 'institution', 'balance', 'runway', 'status'], dashboardSeed.cash)
  await seedTable(db, 'upcoming_work', ['due_label', 'title', 'owner', 'priority'], dashboardSeed.upcoming.map(({ date, ...item }) => ({ due_label: date, ...item })))
  await seedTable(db, 'document_queue', ['type', 'name', 'owner', 'status'], dashboardSeed.documents)
  await seedTable(db, 'activity_log', ['event', 'source', 'time_label'], dashboardSeed.activity.map(({ time, ...item }) => ({ time_label: time, ...item })))
}

async function seedTable(db, tableName, columns, rows) {
  for (const [index, row] of rows.entries()) {
    const names = [...columns, 'sort_order']
    const values = [...columns.map((column) => row[column]), index + 1]
    const placeholders = values.map((_, valueIndex) => `$${valueIndex + 1}`).join(', ')

    await db.query(
      `insert into ${tableName} (${names.join(', ')}) values (${placeholders})`,
      values,
    )
  }
}
