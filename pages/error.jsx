import React from 'react'
import Link from "next/link"
import { useRouter } from 'next/router';

function ErrorPage() {
  const router = useRouter();
  return (
    <div>
      <h1>An error has occured</h1>
      <p>{router.query.message || ""}</p>
      <Link href="/" >Go to homepage</Link>
    </div>
  )
}

export default ErrorPage;