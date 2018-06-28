var mongoose=require('mongoose');

var Users=mongoose.model('Users',{
    "name":{type:String,required:true,minLength:1},
    "emailId": {required:true,unique:true,type:String,minLength:1},
    "role":{required:true,type:String,minLength:1},
    "password":{required:true,type:String,minLength:1},
    "user_token":{type:String,default:null}
});

module.exports={
    Users
}