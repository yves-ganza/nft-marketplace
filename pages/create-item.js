import React from 'react'
import { useState } from "react"
import { ethers } from "ethers"
import { create } from "ipfs-http-client"
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../abi/NFT.json'
import NFTMarket from '../abi/NFTMarket.json'
import { useRouter } from 'next/router'

const client = create('https://ipfs.infura.io:5001/api/v0')

export default function CreateItem(){
    const [fileURL, setFileURL] = useState()
    const [formInput, setFormInput] = useState({name: '', description: '', price: ''})

    const router = useRouter()

    const onUpload = async(e) => {
        const file = e.target.files[0]
        try{
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileURL(url)
        }catch(err){
            console.log('File upload failed with error: ', err)
        }

    }

    const createMarket = async () => {
        const {name, description, price} = formInput

        if(!name || !description || !price || !fileURL) return

        const data = JSON.stringify({name, description, price, image: fileURL})
        try{
            const added = await client.add(data, {progress: (prog) => console.log(`Received: ${prog}`)})
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            createSale(url)
        }catch(err){
            console.log(err)
        }
    }

    const createSale = async (url) => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //create NFT item
        const contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const transaction = await contract.createToken(url)
        const tx = await transaction.wait()
        const event = tx.events[0]
        const value = event.args[2]
        const tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        //create Market
        const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
        const listingPrice = marketContract.getListingPrice()

        const marketTransaction = await marketContract.createMarketItem(nftaddress, tokenId, price, {value: listingPrice})
        await marketTransaction.wait()
        router.push('/')
    }

    return(
        <div className="flex flex-col items-center w-full justify-center overflow-y-hidden">
          <h1 className="pt-24 pb-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center">
            Create
            <span className="bg-clip-text text-transparent ml-2 bg-gradient-to-r  from-green-400 via-pink-500 to-purple-500">
            Digital Asset
            </span>
          </h1>
          <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left">
            Make it just right!
          </p>
          <div className='bg-gray-900 opacity-75 shadow-lg rounded-lg px-8 pt-6  mb-20 w-full max-w-xl flex justify-center'>
            <div className='flex flex-col w-full py-12'>
                <input 
                    type='text' 
                    placeholder='Asset Name' 
                    className='shadow appearance-none border rounded w-full px-3 py-5 mb-4 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out'
                    onChange = {e => setFormInput({...formInput, name: e.target.value})} />
                <textarea
                    placeholder='Asset description'
                    className='shadow appearance-none border rounded w-full px-3 py-5 mb-4 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out'
                    onChange={e => setFormInput({...formInput, description: e.target.value})} />
                <input 
                    type='text' 
                    placeholder='Asset price in Matic' 
                    className='shadow appearance-none border rounded w-full px-3 py-5 mb-4 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out'
                    onChange={e => setFormInput({...formInput, price: e.target.value})} />
                <label htmlFor='asset' className='cursor-pointer shadow appearance-none border rounded w-full px-3 py-5 my-4 bg-gray-100 text-center text-semibold text-gray-500 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out'>Upload Image</label>
                <input 
                    type='file' 
                    name='asset'
                    id='asset'
                    onChange={onUpload} 
                    className='hidden'
                />
                {
                    fileURL ? 
                    <img className='rounded mb-4' width='350px' src={fileURL} alt='asset' /> : ''
                }
                <button 
                    className='font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg'
                    onClick={createMarket}>Create Digital Asset</button>
            </div>
        </div>
        </div>
        
    )
}