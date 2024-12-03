const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js")
const MONG_URL="mongodb://127.0.0.1:27017/wanderMove";

main()
.then(()=>{
    console.log("connected to db");
    
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONG_URL)
}
const initDatabase=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67482b9f0eb3a03cf20608ba"}))
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}
   
initDatabase();