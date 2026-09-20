import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between border-b p-4">
      <span className="font-bold">NodeMarket</span>
      <div className="flex items-center gap-4">
        {user && <span>{user.email}</span>}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </header>
  )
}
