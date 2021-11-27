import React from 'react'
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { create } from "ipfs-http-client"
import Web3Modal from 'web3modal'
import axios from 'axios'

import { nftaddress, nftmarketaddress } from '../config'

import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets(){
    const [assets, setAssets] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    const fetchAssets = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)

        try {
            const data = await marketContract.fetchMyNFTs()
            const items = await Promise.all(data.map(async i => {
                const tokenURI = await tokenContract.tokenURI(i.tokenId)
                const metadata = await axios.get(tokenURI)
                const price = ethers.utils.parseUnits(metadata.data.price.toString(), 'ether')
                const item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    owner: i.owner,
                    seller: i.seller,
                    name: metadata.data.name,
                    description: metadata.data.description,
                    image: metadata.data.image,
                }
                return item
            }))

            setAssets(items)
            setLoadingState('loaded')
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => fetchAssets(), [])

    return (
        <div className='flex justify-center'>
          <div className='px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4'>
              {
                Boolean(assets.length) ?
                assets.map((nft, i) => (
                  <div key={i} className='border shadow rounded-xl overflow-hidden'>
                    <img src={nft.image} alt={nft.name} />
                    <div className='p-4'>
                      <p style={{height: '64px'}} className='text-2xl font-semibold'>{nft.name}</p>
                      <div style={{height: '70px', overflow: 'hidden'}}>
                        <p className='text-gray-400'>{nft.description}</p>
                      </div>
                    </div>
                  </div>
                )) : <p className='text-2xl font-semibold'>No assets Owned</p>
              }
            </div>
          </div>
        </div>
      )
}