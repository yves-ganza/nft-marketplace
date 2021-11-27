import React, { useEffect, useState } from 'react'
import '../styles/globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import Head from 'next/head'
import Alert from '../components/alert'

function MyApp({ Component, pageProps }) {

  const [isWeb3Compatible, setIsWeb3Compatible] = useState(false)

  useEffect(()=>{
    if(typeof window.ethereum !== 'undefined'){
      setIsWeb3Compatible(true)
      console.log('Web3 Detected!')
    }else{
      setIsWeb3Compatible(false)
      console.log('Please use a Web3 compatible browser or wallet!')
    }
  }, [])
  
  return (
    <>
    <Head>
      <title>NFT Martketplace</title>
    </Head>
    <div className="flex flex-col leading-normal tracking-normal min-h-screen text-indigo-400 bg-cover bg-fixed relative" style={{backgroundImage: "url('hero.png')"}}>
      <Header />
      {
        !isWeb3Compatible ? <Alert /> :
        <div className='min-h-xl'>
          <Component {...pageProps} />
        </div>
      }
      <Footer />
    </div>
    </>
  )
  
}

export default MyApp
