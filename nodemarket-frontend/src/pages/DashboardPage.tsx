import { useAuth } from '../auth/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>
        Bienvenido, {user?.email} ({user?.role})
      </p>
    </div>
  )
}
