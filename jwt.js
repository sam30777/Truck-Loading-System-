
var jwt=require('jsonwebtoken');

var Secret_Key="santosh";


var sign=function(userEmail,userRole){
    console.log(userEmail);
    console.log(userRole);
    return jwt.sign({emailId:userEmail,role:userRole}, Secret_Key, {algorithm: 'HS256'});
}

var verify=function (token) {
    return new Promise(function (resolve,reject) {
        jwt.verify(token,Secret_Key,function (err,decoded) {
            if(err) reject(err);
            else {
                resolve(decoded);
            }
        })
    })
}


module.exports={
    sign,
    verify
}


