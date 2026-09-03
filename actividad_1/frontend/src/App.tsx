import { useState } from 'react'

import { Layout, type TabKey } from './components/Layout'
import { ClientesPage } from './features/clientes/ClientesPage'
import { ProductosPage } from './features/productos/ProductosPage'
import { VentasPage } from './features/ventas/VentasPage'

export default function App() {
  const [tab, setTab] = useState<TabKey>('clientes')

  return (
    <Layout active={tab} onTabChange={setTab}>
      {tab === 'clientes' && <ClientesPage />}
      {tab === 'productos' && <ProductosPage />}
      {tab === 'ventas' && <VentasPage />}
    </Layout>
  )
}
