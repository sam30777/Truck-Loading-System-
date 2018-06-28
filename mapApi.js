
var https=require('https');

var request=require('request');

;


var getDistance=function(origin,destination){
    var requestUrl=`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.long}&destination=${destination.lat},${destination.long}&key=AIzaSyDfqr8uF1oqPIunw29yrq-vS1iEedLWDIU`;


    return new Promise(function (resolve,reject) {
        request(requestUrl,{json:true},function (err,res,body) {
           if(err){
               reject(err);
           }else
               if(body.status==='OK'){
                   console.log(body.routes[0].legs[0].distance.text);
               resolve(body.routes[0].legs[0].distance.text);}
               else reject('trucks not available for provided locations');

        })
    })


}

module.exports={
    getDistance
}





/*var distance=require('google-distance-matrix');

distance.key('AIzaSyBStnAuvgoJ0r0gNNSrv_wJVZxh0jgp75');

distance.units('imperial');


var getDistance=function (origin,destination) {

    return new Promise(function (resolve,reject) {
        distance.matrix(origin,destination,function (err,distance) {
            if(err){
                reject(err);
            }else if(!distance){
                reject('no distance found for provided data');
            }else if(distance.status==='ok'){
                console.log(distance);
                resolve(distance);
            }
        })
    })
}

*/