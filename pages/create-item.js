import React from 'react'
import { useState } from "react"
import { ethers } from "ethers"
import { create } from "ipfs-http-client"
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../config'

import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
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
        <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col  pb-12'>
                <input 
                    type='text' 
                    placeholder='Asset Name' 
                    className='mt-8 border rounded p-4'
                    onChange = {e => setFormInput({...formInput, name: e.target.value})} />
                <textarea
                    className='mt-2 border rounded p-4' 
                    onChange={e => setFormInput({...formInput, description: e.target.value})} />
                <input 
                    type='text' 
                    placeholder='Asset price in Matic' 
                    className='mt-2 border rounded p-4'
                    onChange={e => setFormInput({...formInput, price: e.target.value})} />
                <input 
                    type='file' 
                    name='Asset'
                    className='my-4'
                    onChange={onUpload} />
                    {
                        fileURL ? 
                        <img className='rounded mt-4' width='350px' src={fileURL} alt='asset' /> : ''
                    }
                <button 
                    className='font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg'
                    onClick={createMarket}>Create Digital Asset</button>
            </div>
        </div>
    )
}