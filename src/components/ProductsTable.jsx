import React from 'react'

export default function ProductsTable({ children }) {
  return <table data-testid="product-list">{children}</table>
}
