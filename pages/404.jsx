import React from 'react'
import Link from "next/link"

function Error404() {
  return (
    <div>
      <h1>Page doesn&apos;t exist</h1>
      <Link href="/" >Go to homepage</Link>
    </div>
  )
}

export default Error404;