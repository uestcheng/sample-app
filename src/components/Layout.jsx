import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/users', label: 'Users' },
  { to: '/products', label: 'Products' }
]

export default function Layout({ children, summary, activeUserName }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Sample App</h1>
          <div className="summary-row">
            <span>Users: {summary.users}</span>
            <span>Products: {summary.products}</span>
            <span>Orders: {summary.orders}</span>
            <span>Revenue: ${summary.revenue}</span>
            <span>Active User: {activeUserName}</span>
          </div>
        </div>
        <nav className="nav" data-testid="main-nav">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
