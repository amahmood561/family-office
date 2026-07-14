import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outputDir = path.join(rootDir, 'screenshots', 'workflows')
const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://localhost:5173'

const workflows = [
  { name: '01-dashboard', label: 'Dashboard' },
  { name: '02-investments', label: 'Investments' },
  { name: '03-entities', label: 'Entities' },
  { name: '04-finance', label: 'Finance' },
  { name: '05-documents', label: 'Documents' },
  { name: '06-compliance', label: 'Compliance' },
  { name: '07-tasks', label: 'Tasks' },
]

async function captureWorkflow(page, workflow) {
  await page
    .getByLabel('Primary')
    .getByRole('button', { name: workflow.label, exact: true })
    .click()
  await page.locator('.workspace').waitFor({ state: 'visible' })
  await page.screenshot({
    path: path.join(outputDir, `${workflow.name}.png`),
    fullPage: true,
  })
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    for (const workflow of workflows) {
      await captureWorkflow(page, workflow)
    }

    await page
      .getByLabel('Primary')
      .getByRole('button', { name: 'Dashboard', exact: true })
      .click()
    await page.getByPlaceholder('Filter modules').fill('tax')
    await page.screenshot({
      path: path.join(outputDir, '08-dashboard-filtered-modules.png'),
      fullPage: true,
    })
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
