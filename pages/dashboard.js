import { useState, useEffect } from 'react'
import {ethers} from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { nftaddress, nftmarketaddress } from '../config'


export default function Dashboard(){
    const [assets, setAssets]  = useState([])
    const [sold, setSold] = useState([])

    const fetchAssets  = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)

        const data = await marketContract.fetchNFTsCreated()


        const items = await Promise.all(data.map(async i => {
            const tokenURI = await tokenContract.tokenURI(i.tokenId)
            const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            const meta = await axios.get(tokenURI)

            const item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                seller: i.seller,
                sold: i.sold,
                name: meta.data.name,
                description: meta.data.description,
                image: meta.data.image
            }

            return item
        }))

        setAssets(items)

        const soldAssets = items.filter(item => item.sold)
        console.log(soldAssets)
        setSold(soldAssets)
    }

    useEffect(() => {
        fetchAssets()
    }, [])

    return(
        <div className='flex flex-col justify-center'>
          <div className='px-4' style={{maxWidth: '1600px'}}>
              <h2 className='text-3xl font-semibold'>Created Assets</h2>
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
                )) : <p className='text-2xl font-semibold'>No assets Created</p>
              }
            </div>
          </div>
          <div className='px-4 mt-12' style={{maxWidth: '1600px'}}>
              <h2 className='text-3xl font-semibold'>Sold Assets</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4'>
              {
                Boolean(sold.length) ?
                sold.map((nft, i) => (
                  <div key={i} className='border shadow rounded-xl overflow-hidden'>
                    <img src={nft.image} alt={nft.name} />
                    <div className='p-4'>
                      <p style={{height: '64px'}} className='text-2xl font-semibold'>{nft.name}</p>
                      <div style={{height: '70px', overflow: 'hidden'}}>
                        <p className='text-gray-400'>{nft.description}</p>
                      </div>
                    </div>
                    <div className='p-4 bg-black'>
                        <p className='text-2xl mb-4 font-bold text-white'>Price - {nft.price} ETH</p>
                    </div>                    
                  </div>
                )) : <p className='text-2xl font-semibold'>No assets sold</p>
              }
            </div>
          </div>
        </div>
    )
}