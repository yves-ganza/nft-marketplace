import React from 'react'
import '../styles/globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  
  return (
    <>
    <Head>
      <title>NFT Martketplace</title>
    </Head>
    <div className="flex flex-col leading-normal tracking-normal min-h-screen text-indigo-400 bg-cover bg-fixed" style={{backgroundImage: "url('hero.png')"}}>
      <Header />
      <div className='min-h-xl'>
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
    </>
  )
  
}

export default MyApp
