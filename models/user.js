const mongooose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const Schema=mongooose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true            //here we don't need to define
    }                           //username and password as passportlocalmongoose already contain it

})

userSchema.plugin(passportLocalMongoose); //we used this as passportLocalMongoose by default create the salting,hashingPassword,usename for the user
                                           //it also create some methods used for authentication
module.exports=mongooose.model("User",userSchema)