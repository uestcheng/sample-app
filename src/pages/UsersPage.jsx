import React, { useState } from 'react'

export default function UsersPage({
  users,
  activeUserId,
  orderCountsByUser,
  onSaveUser,
  onDeleteUser,
  onSelectUser
}) {
  const [draft, setDraft] = useState({ name: '', email: '' })
  const [editId, setEditId] = useState(null)

  const submit = (event) => {
    event.preventDefault()
    const name = draft.name.trim()
    const email = draft.email.trim()
    if (!name || !email) {
      return
    }

    onSaveUser({ id: editId, name, email })
    setEditId(null)

    setDraft({ name: '', email: '' })
  }

  const remove = (id) => {
    onDeleteUser(id)
    if (editId === id) {
      setEditId(null)
      setDraft({ name: '', email: '' })
    }
  }

  const edit = (user) => {
    setEditId(user.id)
    setDraft({ name: user.name, email: user.email })
  }

  return (
    <section data-testid="users-page">
      <h2>User Management</h2>
      <p data-testid="users-page-note">Workflow check: user selection drives product ordering.</p>
      <form onSubmit={submit} className="form" data-testid="user-form">
        <input
          data-testid="user-name-input"
          placeholder="Name"
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
        />
        <input
          data-testid="user-email-input"
          placeholder="Email"
          value={draft.email}
          onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
        />
        <button data-testid="save-user-btn" type="submit">
          {editId ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table data-testid="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Orders</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} data-testid={`user-row-${user.id}`}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{orderCountsByUser[user.id] ?? 0}</td>
              <td>{activeUserId === user.id ? 'Active' : 'Idle'}</td>
              <td>
                <button data-testid={`select-user-${user.id}`} onClick={() => onSelectUser(user.id)}>
                  Select
                </button>
                <button data-testid={`edit-user-${user.id}`} onClick={() => edit(user)}>
                  Edit
                </button>
                <button data-testid={`delete-user-${user.id}`} onClick={() => remove(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
