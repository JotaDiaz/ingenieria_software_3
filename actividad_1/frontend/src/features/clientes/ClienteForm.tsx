import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import { Alert, Button, Field, Input } from '../../components/ui'
import type { Cliente, ClienteCreate } from '../../types'

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ ]+$/
const TELEFONO = /^[0-9-]+$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Props {
  cliente?: Cliente
  onSubmit: (payload: ClienteCreate) => Promise<void>
  onCancel: () => void
}

type Errores = Partial<Record<'dni' | 'nombre' | 'apellido' | 'email' | 'telefono', string>>

export function ClienteForm({ cliente, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    dni: cliente?.dni ?? '',
    nombre: cliente?.nombre ?? '',
    apellido: cliente?.apellido ?? '',
    email: cliente?.email ?? '',
    telefono: cliente?.telefono ?? '',
  })
  const [errores, setErrores] = useState<Errores>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const set = (campo: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }))
  }

  function validar(): boolean {
    const errs: Errores = {}
    if (!form.dni.trim()) errs.dni = 'El DNI es obligatorio'
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    else if (!SOLO_LETRAS.test(form.nombre.trim())) errs.nombre = 'Solo debe contener letras'
    if (!form.apellido.trim()) errs.apellido = 'El apellido es obligatorio'
    else if (!SOLO_LETRAS.test(form.apellido.trim())) errs.apellido = 'Solo debe contener letras'
    if (!form.email.trim()) errs.email = 'El email es obligatorio'
    else if (!EMAIL.test(form.email.trim())) errs.email = 'Email inválido (usuario@dominio)'
    if (form.telefono.trim() && !TELEFONO.test(form.telefono.trim())) {
      errs.telefono = 'Solo números y guiones'
    }
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validar()) return
    setEnviando(true)
    setServerError(null)
    try {
      await onSubmit({
        dni: form.dni.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || null,
      })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="card card--form" onSubmit={handleSubmit} noValidate>
      <h3 className="card-title">{cliente ? `Editar cliente #${cliente.id_cliente}` : 'Nuevo cliente'}</h3>
      {serverError && <Alert>{serverError}</Alert>}
      <div className="form-grid">
        <Field label="DNI" required error={errores.dni}>
          <Input value={form.dni} onChange={set('dni')} placeholder="30111222" disabled={enviando} />
        </Field>
        <Field label="Nombre" required error={errores.nombre}>
          <Input value={form.nombre} onChange={set('nombre')} placeholder="Juan" disabled={enviando} />
        </Field>
        <Field label="Apellido" required error={errores.apellido}>
          <Input value={form.apellido} onChange={set('apellido')} placeholder="Pérez" disabled={enviando} />
        </Field>
        <Field label="Email" required error={errores.email}>
          <Input value={form.email} onChange={set('email')} placeholder="juan@mail.com" disabled={enviando} />
        </Field>
        <Field label="Teléfono" error={errores.telefono} hint="Números y guiones">
          <Input value={form.telefono} onChange={set('telefono')} placeholder="2804-123456" disabled={enviando} />
        </Field>
      </div>
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : cliente ? 'Guardar cambios' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
