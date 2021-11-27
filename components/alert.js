import React from 'react'
import Link from 'next/link'

export default function Alert(props){

    return(
        <div className="h-screen w-full z-10 inset-0 overflow-y-auto">
            <div className="absolute w-full h-full inset-0 bg-gray-500 opacity-75">
            </div>
            <div className="flex items-end justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                <span className="hidden sm:inline-block sm:align-top sm:h-screen" aria-hidden="true">
                </span>
                <div className="inline-block relative overflow-hidden transform transition-all sm:align-middle sm:max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div>
                        <div className="rounded-lg px-8 bg-white shadow">
                            <div className="bg-white dark:bg-gray-800 ">
                                <div className="text-center w-full mx-auto pb-12 pt-4 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
                                    <h2 className="text-3xl font-extrabold text-red-500 dark:text-white sm:text-4xl">
                                        <span className="block pb-8">
                                            Alert!
                                        </span>
                                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                                            Please use a Web3 Compatible Browser!
                                        </span>
                                        <span className='block my-6'>
                                            Or
                                        </span>
                                    </h2>
                                    <div className="py-4 lg:mt-0 lg:flex-shrink-0">
                                        <div className="inline-flex rounded-md shadow">
                                            <Link href='https://metamask.io/download.html'>
                                                <a className="py-4 px-6  bg-pink-primary hover:bg-pink-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                                    Install extension
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}