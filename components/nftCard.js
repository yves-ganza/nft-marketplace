import React from 'react'

export default function NftCard({nft, onClick}){
    return(
    <div className="shadow-lg rounded-2xl text-xl  bg-white w-full max-w-md p-2 bg-opacity-5 backdrop-filter backdrop-blur-lg">
        <div>
            <img src={nft.image} alt={nft.name} className="w-full p-4 h-36 sm:h-64 m-auto"/>
        </div>
        <div className="m-3 p-4 mb-4 rounded-lg bg-pink-primary">
            <p className="text-white text-2xl font-bold ">
                {nft.name}
            </p>
            <p className="text-white text-sm font-semibold">
                {nft.description}
            </p>
            <div className="flex items-center justify-between ">
                <p className="text-primary">
                    {nft.price} ETH
                </p>
                {
                    onClick ? 
                    <button onClick={() => onClick(nft)} className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold text-2xl py-2 px-8 ml-10 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out">
                        Buy
                    </button> : ''
                }
            </div>
        </div>
    </div>

    )
}