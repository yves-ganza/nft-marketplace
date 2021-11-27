import { useState, useEffect } from 'react'
import {ethers} from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { nftaddress, nftmarketaddress } from '../config'
import NftCard from '../components/nftCard'


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
        const data2 = await marketContract.fetchMyNFTs()

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

        const assetsCreatedNotSold = items.filter(item => item.owner === signer._address)

        const assetsBought = await Promise.all(data2.map(async i => {
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
      console.log(items.concat(assetsBought));
      setAssets(assetsCreatedNotSold.concat(assetsBought))

      const soldAssets = items.filter(item => item.sold)
      setSold(soldAssets)
    }

    useEffect(() => {
        fetchAssets()
    }, [])

    return(
        <div className='flex flex-col lg:flex-row pl-32'>
          <div className='w-full'>
              <h2 className='pt-24 pb-4 text-3xl text-white opacity-75 font-bold leading-tight'>Your Assets</h2>
            <div className='grid xl:grid-cols-2 gap-4 xl:gap-x-0 p-4'>
              {
                Boolean(assets.length) ?
                assets.map((nft, i) => (
                  <NftCard key={i} nft={nft} />
                )) : <p className='text-2xl font-semibold'>No assets Created</p>
              }
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <h2 className='pt-24 pb-4 text-3xl text-white opacity-75 font-bold leading-tight'>Sold</h2>
            <div className='flex flex-col p-4 gap-4 justify-center'>
              {
                Boolean(sold.length) ?
                sold.map((nft, i) => (
                  <NftCard key={i} nft={nft} />
                )) : <p className='text-2xl font-semibold'>No assets sold</p>
              }
            </div>
          </div>
        </div>
    )
}