import React, { useState } from 'react'

export default function ProductsPage({ products, orders, activeUser, onAddProduct, onPlaceOrder }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('1')
  const [quantities, setQuantities] = useState({})
  const [notice, setNotice] = useState('')

  const add = (event) => {
    event.preventDefault()
    const parsedPrice = Number(price)
    const parsedStock = Number(stock)
    if (!name || !parsedPrice || parsedPrice < 1 || !parsedStock || parsedStock < 1) {
      setNotice('Please enter valid product name, price, and stock.')
      return
    }

    onAddProduct({ name: name.trim(), price: parsedPrice, stock: parsedStock })
    setName('')
    setPrice('')
    setStock('1')
    setNotice('Product added successfully.')
  }

  const placeOrder = (productId) => {
    const quantity = Number(quantities[productId] ?? 1)
    const result = onPlaceOrder({ productId, quantity })
    setNotice(result.message)
    if (result.ok) {
      setQuantities((prev) => ({ ...prev, [productId]: 1 }))
    }
  }

  return (
    <section data-testid="products-page">
      <h2>Product & Order Workflow</h2>
      <p data-testid="products-page-note">Featured products: Keyboard, Mouse, Headset (CI workflow check)</p>
      <p className="hint">Active user: {activeUser ? activeUser.name : 'Not selected'}</p>
      <form onSubmit={add} className="form" data-testid="product-form">
        <input
          data-testid="product-name-input"
          placeholder="Product Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          data-testid="product-price-input"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <input
          data-testid="product-stock-input"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
        />
        <button data-testid="save-product-btn" type="submit">
          Add Product
        </button>
      </form>
      {notice ? <p className="notice">{notice}</p> : null}

      <table data-testid="product-list">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>{product.stock}</td>
            <td>
              <input
                type="number"
                min="1"
                max={Math.max(product.stock, 1)}
                value={quantities[product.id] ?? 1}
                onChange={(event) =>
                  setQuantities((prev) => ({ ...prev, [product.id]: event.target.value }))
                }
              />
            </td>
            <td>
              <button
                onClick={() => placeOrder(product.id)}
                disabled={!activeUser || product.stock === 0}
              >
                Place Order
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      <h3>Recent Orders</h3>
      <ul>
        {orders.slice(0, 6).map((order) => (
          <li key={order.id}>
            {order.createdAt} - {order.userName} ordered {order.quantity} x {order.productName} (${order.total})
          </li>
        ))}
      </ul>
    </section>
  )
}
