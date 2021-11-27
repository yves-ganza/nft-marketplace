import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {nftaddress, nftmarketaddress} from '../config'

import NFT from '../abi/NFT.json'
import NFTMarket from '../abi/NFTMarket.json'
import NftCard from '../components/nftCard'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNfts()
  }, [])

  const loadNfts = async () => {
    const url = `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_PROJECT_ID}`
    const provider = new ethers.providers.JsonRpcProvider(url)

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider)

    try{
      const data = await marketContract.fetchMarketItems()
  
      const items = await Promise.all(data.map(async item => {
        const tokenURI = await tokenContract.tokenURI(item.tokenId)
        const meta = await axios.get(tokenURI)
  
        let price = ethers.utils.formatUnits(item.price.toString(), 'ether')
        let i = {
          price,
          tokenId: item.tokenId.toNumber(),
          seller: item.seller,
          owner: item.owner,
          image: meta.data.image,
          name: meta.data.name,
          description:meta.data.description
        }
        return i
      }))
      setNfts(items)
      setLoadingState('loaded')
    }catch(err){
      console.log(err)
    }
  }

  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: price})
    await transaction.wait()

    loadNfts()
  }


  return (
    <div className='grid gap-y-4 pl-8 h-full lg:pl-32 py-4'>
      <header className='flex flex-col text-5xl pt-24 pb-12 gap-2'>
        <p className='font-bold'>Discover the World&apos;s Top</p> 
        <span className='font-bold bg-clip-text text-transparent bg-gradient-to-r  from-green-400 via-pink-500 to-purple-500'>Digital Assets</span>
      </header>
      {
        loadingState === 'loaded' && !nfts.length ?
        <h1 className='w-full h-full flex items-center justify-center text-5xl'>No items in the marketplace!</h1> :
        nfts.map((nft, i) => (
          <NftCard key={i} nft={nft} onClick={buyNft} />
        ))
      }
    </div>
  )
}
