import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/categories', label: 'Categorías' },
]

export function Sidebar() {
  return (
    <nav className="w-48 shrink-0 border-r p-4">
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'font-bold' : '')}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
