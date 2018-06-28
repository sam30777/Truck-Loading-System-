
var mongoose=require('mongoose');

var {Users}=require('./models/user');

var jwt=require('./jwt');
var createDBConnection=function () {
    mongoose.connect('mongodb://localhost:27017/TruckSystem',function (err) {
        if(err){
            console.log(err);
        }else{
            console.log('db is connected');
        }
    })
}



var checkEMailPassword=function(userEmailId,password) {
    return new Promise(function (resolve,reject) {
        Users.find({emailId:userEmailId}).then(function (res) {
              if(res[0].password===password){
                  var token=jwt.sign(res[0].emailId,res[0].role);
                  resolve(token);
              }else{
                  reject('email or password is wrong');
              }
        }).catch(function (err) {
           reject(err);
        })
    })

}

module.exports={
    createDBConnection,
    checkEMailPassword
}
