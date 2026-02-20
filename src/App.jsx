import React, { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import UsersPage from './pages/UsersPage'
import ProductsPage from './pages/ProductsPage'

const seedUsers = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' }
]

const seedProducts = [
  { id: 101, name: 'Keyboard', price: 199, stock: 6 },
  { id: 102, name: 'Mouse', price: 99, stock: 10 }
]

export default function App() {
  const [users, setUsers] = useState(seedUsers)
  const [products, setProducts] = useState(seedProducts)
  const [orders, setOrders] = useState([])
  const [activeUserId, setActiveUserId] = useState(seedUsers[0]?.id ?? null)

  const activeUser = useMemo(
    () => users.find((user) => user.id === activeUserId) ?? null,
    [users, activeUserId]
  )

  const saveUser = (payload) => {
    if (payload.id) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === payload.id ? { ...user, name: payload.name, email: payload.email } : user
        )
      )
      return
    }

    const newUser = { id: Date.now(), name: payload.name, email: payload.email }
    setUsers((prev) => [...prev, newUser])
    if (!activeUserId) {
      setActiveUserId(newUser.id)
    }
  }

  const deleteUser = (id) => {
    const remainingUsers = users.filter((user) => user.id !== id)
    setUsers(remainingUsers)
    setOrders((prev) => prev.filter((order) => order.userId !== id))

    if (activeUserId === id) {
      setActiveUserId(remainingUsers[0]?.id ?? null)
    }
  }

  const addProduct = (payload) => {
    const newProduct = {
      id: Date.now(),
      name: payload.name,
      price: payload.price,
      stock: payload.stock
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const placeOrder = ({ productId, quantity }) => {
    const parsedQuantity = Number(quantity)
    if (!activeUser) {
      return { ok: false, message: 'Please select a user first.' }
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return { ok: false, message: 'Quantity must be at least 1.' }
    }

    const selectedProduct = products.find((product) => product.id === productId)
    if (!selectedProduct) {
      return { ok: false, message: 'Product not found.' }
    }

    if (selectedProduct.stock < parsedQuantity) {
      return { ok: false, message: 'Not enough stock for this order.' }
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, stock: product.stock - parsedQuantity }
          : product
      )
    )

    setOrders((prev) => [
      {
        id: Date.now(),
        userId: activeUser.id,
        userName: activeUser.name,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: parsedQuantity,
        total: selectedProduct.price * parsedQuantity,
        createdAt: new Date().toLocaleTimeString()
      },
      ...prev
    ])

    return { ok: true, message: 'Order placed successfully.' }
  }

  const orderCountsByUser = orders.reduce((result, order) => {
    result[order.userId] = (result[order.userId] ?? 0) + 1
    return result
  }, {})

  const summary = {
    users: users.length,
    products: products.length,
    orders: orders.length,
    revenue: orders.reduce((total, order) => total + order.total, 0)
  }

  return (
    <Layout summary={summary} activeUserName={activeUser?.name ?? 'None'}>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route
          path="/users"
          element={
            <UsersPage
              users={users}
              activeUserId={activeUserId}
              orderCountsByUser={orderCountsByUser}
              onSaveUser={saveUser}
              onDeleteUser={deleteUser}
              onSelectUser={setActiveUserId}
            />
          }
        />
        <Route
          path="/products"
          element={
            <ProductsPage
              products={products}
              orders={orders}
              activeUser={activeUser}
              onAddProduct={addProduct}
              onPlaceOrder={placeOrder}
            />
          }
        />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </Layout>
  )
}
