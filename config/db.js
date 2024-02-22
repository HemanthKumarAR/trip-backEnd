const mongoose=require('mongoose')

const ConfigDB=async ()=>{
    try{
       await  mongoose.connect('mongodb://localhost:27017/travel-project')
       console.log('connect to db')

    }catch(e){
      console.log(e)
    }
}
module.exports=ConfigDB