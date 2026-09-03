import type { ReactNode } from 'react'

export type TabKey = 'clientes' | 'productos' | 'ventas'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'clientes', label: 'Clientes' },
  { key: 'productos', label: 'Productos' },
  { key: 'ventas', label: 'Ventas' },
]

interface LayoutProps {
  active: TabKey
  onTabChange: (tab: TabKey) => void
  children: ReactNode
}

export function Layout({ active, onTabChange, children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <div>
            <h1>PROPUESTA DE PRODUCTIVIDAD 1</h1>
            <p>Clientes · Productos · Ventas</p>
          </div>
        </div>
        <nav className="tabs" aria-label="Secciones">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={tab.key === active ? 'tab tab--active' : 'tab'}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  )
}
