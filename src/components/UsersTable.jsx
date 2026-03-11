import React from 'react'

export default function UsersTable({ children }) {
  return <table data-testid="user-table" className="users-table" role="grid">{children}</table>
}
