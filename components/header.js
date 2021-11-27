import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'


export default function Header(props){

    const [show, setShow] = useState(false)
    const [active, setActive] = useState('')

    const router = useRouter()

    return(
    <nav className="dark:bg-gray-800  shadow py-4 w-full">
        <div className="flex items-center justify-between px-8 h-16">
            <div className="flex w-full items-center justify-between">
                <Link href="/">
                    <a className={`${router.pathname == '/' ? 'text-header-hover': 'text-header'} flex items-center  no-underline hover:no-underline font-bold text-2xl lg:text-4xl`}><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">PHOENX NFTs</span>
                    </a>
                </Link>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <Link href="/">
                            <a className={`${router.pathname == '/' ? 'text-header-hover': 'text-header'} flex items-center  no-underline hover:no-underline font-bold text-xl`}>
                                Home
                            </a>
                        </Link>
                        <Link href='/create-item'>
                            <a className={`${router.pathname == '/create-item' ? 'text-header-hover': 'text-header'} flex items-center  no-underline hover:no-underline font-bold text-xl`}>
                                Sell Digital Assets
                            </a>
                        </Link>
                        <Link href='/dashboard'>
                            <a className={`${router.pathname == '/dashboard' ? 'text-white  bg-pink-primary py-4 px-6 rounded': 'text-header'} flex items-center  no-underline hover:no-underline font-bold text-xl`}>
                                Dashboard
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="ml-4 flex items-center md:ml-6">
                </div>
            </div>
            <div className="-mr-2 flex md:hidden">
                <button onClick={() => setShow(prev => !prev)} className="text-header-hover dark:text-white hover:text-header inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                    <svg width="20" height="20" fill="currentColor" className="h-8 w-8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
        <div className={`md:hidden ${!show ? 'hidden' : '' }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href='/'>
                    <a className="text-header hover:text-header-hover dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Home
                    </a>
                </Link>
                <Link href='/create-item'>
                    <a className="text-header-hover dark:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Sell Digital Assets
                    </a>
                </Link>
                <Link href='/dashboard'>
                    <a className="text-header hover:text-header-hover dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Dashboard
                    </a>
                </Link>
            </div>
        </div>
    </nav>
    )
}