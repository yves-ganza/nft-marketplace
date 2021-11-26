import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {

  return (
    <div>
      <nav className='border-b p-6 text-center'>
        <p className='text-4xl font-bold'>Phoenx NFTs Marketplace</p>
        <div className='flex mt-4'>
          <Link href='/'>
            <a className='mr-6 text-purple-500'>
              Home
            </a>
          </Link>
          <Link href='/create-item'>
            <a className='mr-6 text-purple-500'>
              Sell Digital Asset
            </a>
          </Link>
          <Link href='/my-assets'>
            <a className='mr-6 text-purple-500'>
              My Digital Assets
            </a>
          </Link>
          <Link href='/dashboard'>
            <a className='mr-6 text-purple-500'>
              Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
  
}

export default MyApp
