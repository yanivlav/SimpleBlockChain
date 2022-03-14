const SHA256=require('crypto-js/sha256')

class Block{
constructor(index,timestamp,data,previousHash=''){
    this.index=index
    this.previousHash=previousHash
    this.timestamp=timestamp
    this.data=data
    this.hash=this.calculateHash()
}
calculateHash(){
  return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString()
}
}
class Blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()]
    }

    createGenesisBlock(){
        return new Block(0,"01/01/2019","Genesis Block","0")
    }

    getLatestBlock(){
      return this.chain[this.chain.length-1]
    }

    addBlock(newBlock){
      newBlock.previousHash=this.getLatestBlock().hash
      newBlock.hash=newBlock.calculateHash();
      this.chain.push(newBlock)
    }

}

module.exports.Blockchain=Blockchain
module.exports.Block=Block