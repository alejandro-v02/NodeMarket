import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { UserRole } from '../api/types'
import type { SelfRegisterableRole } from '../api/types'
import { useAuth } from '../auth/useAuth'

export function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SelfRegisterableRole>(UserRole.CLIENT)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register({ name, email, password, role })
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm p-4">
      <h1 className="mb-4 text-xl font-bold">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          Nombre
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="border p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          Tipo de cuenta
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as SelfRegisterableRole)}
            className="border p-2"
          >
            <option value={UserRole.CLIENT}>Cliente</option>
            <option value={UserRole.PROVIDER}>Proveedor</option>
          </select>
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="border p-2">
          {isSubmitting ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-4">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  )
}
