import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return <button className={cls} {...props} />
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="input" {...props} />
}

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="field-required">*</span>}
      </span>
      {children}
      {error ? (
        <span className="field-error">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </label>
  )
}

export type BadgeTone = 'success' | 'danger' | 'warning' | 'neutral'

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

type AlertTone = 'danger' | 'success'

export function Alert({ tone = 'danger', children }: { tone?: AlertTone; children: ReactNode }) {
  return <div className={`alert alert--${tone}`}>{children}</div>
}

export function Spinner() {
  return <span className="spinner" aria-label="Cargando" />
}

export function EmptyState({ message }: { message: string }) {
  return <div className="empty">{message}</div>
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        <h2 className="page-title">{title}</h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}

export function FilterBar({
  onApply,
  onReset,
  resetDisabled,
  children,
}: {
  onApply: () => void
  onReset: () => void
  resetDisabled?: boolean
  children: ReactNode
}) {
  return (
    <div className="card filter-card">
      <div className="filter-head">
        <span className="filter-title">Filtros</span>
        {resetDisabled && <span className="filter-hint">Mostrando todos</span>}
      </div>
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault()
          onApply()
        }}
      >
        {children}
        <div className="filter-actions">
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
          <Button type="button" variant="ghost" onClick={onReset} disabled={resetDisabled}>
            Limpiar
          </Button>
        </div>
      </form>
    </div>
  )
}
