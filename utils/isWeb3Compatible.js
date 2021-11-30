export default function(){
    if(typeof window.ethereum !== 'undefined'){
      console.log('Web3 Detected!')
      return true
    }else{
      console.log('Please use a Web3 compatible browser or wallet!')
      return false
    }
}