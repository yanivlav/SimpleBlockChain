const SHA256=require('crypto-js/sha256')
const { intFromLE } = require('elliptic/lib/elliptic/utils')
class Transaction{
    constructor(fromAddress,toAddress,amount){
      this.fromAddress=fromAddress
      this.toAddress=toAddress
      this.amount=amount
  }
}

class Block{
constructor(timestamp,transactions,previousHash=''){
    
    this.previousHash=previousHash
    this.timestamp=timestamp
    this.transactions=transactions
    this.hash=this.calculateHash()
    this.nonce=0
}
calculateHash(){
  return SHA256(this.previousHash+this.timestamp+JSON.stringify(this.transactions)+this.nonce).toString()
 }
 mineBlock(difficulty){
    while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join('0')){
      this.nonce++
      this.hash=this.calculateHash()
    }

    console.log('Block minded  '+this.nonce)
 }



}
class Blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()]
        this.difficulty=5
        this.pendingTransactions=[]
        this.miningReward=100
    }

    createGenesisBlock(){
        return new Block("01/01/2019","Genesis Block","0")
    }

    getLatestBlock(){
      return this.chain[this.chain.length-1]
    }

    // addBlock(newBlock){
    //   newBlock.previousHash=this.getLatestBlock().hash
    //   newBlock.mineBlock(this.difficulty)
    //   this.chain.push(newBlock)
    // }
    minePendingTransactions(miningRewardAddress){
      const rewardTX =new Transaction(null,miningRewardAddress,this.miningReward)
      this.pendingTransactions.push(rewardTX)
      
      let block=new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash)
      block.mineBlock(this.difficulty)
      console.log('Block successfully mines!')
      this.chain.push(block)
      this.pendingTransactions=[]
    }

    getBalanceOfAddress(address){
      let balance=0
      for(const block of this.chain){
        for(const trans of block.transactions){
          if(trans.fromAddress===address){
            balance -= trans.amount
          }
          if(trans.toAddress===address){
            balance +=trans.amount
          }
        }
      }
      return balance
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    } 




    isChainValid(){
       for (let i = 1; i < this.chain.length; i++) {
         const currentBlock=this.chain[i]
         const previousBlock=this.chain[i-1]
         if(currentBlock.hash !== currentBlock.calculateHash()){
          return false
         }
         
         if(currentBlock.previousHash !== previousBlock.hash){
           return false
         }
       }
      return true
    }
}

module.exports.Blockchain=Blockchain
module.exports.Block=Block
module.exports.Transaction=Transaction