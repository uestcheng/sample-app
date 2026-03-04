import React from 'react'

export default function HomePage() {
  return (
    <section>
      <h2>POC Overview</h2>
      <ul>
        <li>Frontend code is located in frontend/src</li>
        <li>E2E tests are located in frontend/qa</li>
        <li>Test mapping is auto-generated at qa/.tmp/mapping.json</li>
        <li>Dynamic selection entry is in qa/scripts/resolve-tests.ts</li>
      </ul>
    </section>
  )
}
