import React from 'react'
import Link from "next/link"
import { useRouter } from 'next/router';
import Head from 'next/head';

function ErrorPage() {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Error Page</title>
      </Head>
      <h1>An error has occured</h1>
      <p>{router.query.message || ""}</p>
      <Link href="/" >Go to homepage</Link>
    </div>
  )
}

export default ErrorPage;