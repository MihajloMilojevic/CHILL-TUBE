import React from 'react'
import Link from "next/link"
import Head from 'next/head';

function Error404() {
  return (
    <div>
      <Head>
        <title>Error 404 | Page does not exist</title>
      </Head>
      <h1>Page doesn&apos;t exist</h1>
      <Link href="/" >Go to homepage</Link>
    </div>
  )
}

export default Error404;