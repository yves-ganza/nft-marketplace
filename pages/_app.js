import '../styles/globals.css'
import Header from '../components/header'
import Footer from '../components/footer'

function MyApp({ Component, pageProps }) {

  window.addEventListener('contextmenu', e => e.preventDefault())

  return (
    <div className="flex flex-col leading-normal tracking-normal min-h-screen text-indigo-400 bg-cover bg-fixed" style={{backgroundImage: "url('hero.png')"}}>
      <Header />
      <div className='min-h-xl'>
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
  
}

export default MyApp
