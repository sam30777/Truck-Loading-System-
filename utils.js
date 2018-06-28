
var {Truck}=require('./models/truck');

var request=require('request');


/*
var getValidTucks=function (volume,weight) {
    Truck.find({max_weight:{$gte:weight},truck_capacity:{$gte:volume}}).then(function (result) {
        console.log(result);
    }).catch(function (err) {
        console.log(err);
    })
}


var calculateVolumeAndWeight=function (objArray) {
    var volume=0;
    var totalWeight=0;
    for(var i=0;i<objArray.length;i++){
        volume=volume+(objArray[i].length*objArray[i].breadth*objArray[i].height);
        totalWeight=totalWeight+objArray[i].weight;
    }

    getValidTucks(volume,totalWeight);

}

*/

var calculatePrice=function (truck,distance) {
     console.log('in calculate price');
     console.log('truck',truck);
     console.log('distance',distance);

    return new Promise(function (resolve,reject) {
        var total_Price=0;
        var temp=parseInt(distance);
        total_Price=total_Price+ truck.base_price;
        temp=temp-50;
        if(temp>0){
            total_Price=total_Price+(temp*truck.per_km_price);
        }

        var obj={
            truck_name:truck.name,
            truck_number:truck.truck_number,
            total_Price:total_Price
        }
        resolve(obj);
    })


}

var createPromise=function (doc,loads,bindId) {

    return new Promise(function (resolve,reject) {
         bin=`${bindId}:${doc.max_weight}:${doc.dimensions.length}x${doc.dimensions.breadth}x${doc.dimensions.height}`;
        var url=`http://www.packit4me.com/api/call/raw?bins=${bin}&items=${loads}`
         request.post(url,function (err,res,body) {
            resolve(JSON.parse(body));
        })
    })
}

var executePromises=function *(prom) {
   yield Promise.all(prom);


}

var calculateBestTruck=function (loads,loadsLength,totalWieght,totalVolume){


   return new Promise(function (resolve,reject) {
       Truck.aggregate(
           [
               {$match: {max_weight: {$gte: totalWieght}, truck_capacity: {$gte: totalVolume}}},
               {$sort: {truck_capacity: 1}}
           ]
       ).then (function (result) {
           console.log('entered result');
           var prom=[];
           var f=0;
           var i=0;
           var isfound=false;
            while (i<result.length) {

                  prom.push(createPromise(result[i],loads,i));
                  i++;
                  f++;
                if(f===3||i===result.length){
                    var re=executePromises(prom);
                    re.next().value.then(function (resultArray) {
                       for(var i=0;i<resultArray.length;i++){
                          if(resultArray[i][0].items.length===loadsLength){
                              isfound=true;
                              resolve(result[resultArray[i][0].id]);
                              break;
                          }
                       }
                    }).catch(function (err) {
                        console.log(err);
                        f=0;
                        re.next()
                        prom=[];
                    });
                    if(isfound){
                        break;
                    }else{
                        f=0;
                        prom=[];
                    }


                }
            }


       })
   })








































    /*

    return new Promise(function (resolve,reject) {

         Truck.aggregate(
               [
                   {$match: {max_weight: {$gte: totalWieght}, truck_capacity: {$gte: totalVolume}}},
                   {$sort: {truck_capacity: 1}}
               ]
           ).then(function (res) {
               var bindId=0;
               while(res.length>0){
                   var doc=res.shift();
                   var bin=`${bindId}:${doc.max_weight}:${doc.dimensions.length}x${doc.dimensions.breadth}x${doc.dimensions.height}`;
                   var url=`http://www.packit4me.com/api/call/raw?bins=${bin}&items=${loads}`
                   request.post(url,function (err,res,body) {
                       console.log(res);
                       if(JSON.parse(body)[0].items.length===loadsLength)
                       {
                          resolve(doc);


                       }
                   })
               }

         })





              var cursor=Truck.find({max_weight:{$gte:totalWieght},truck_capacity:{$gte:totalVolume}}).cursor();
              var bindId=0;
              console.log(loadsLength);
              var validTrucks=[];
              cursor.on('data',function (doc) {
                  var bin=`${bindId}:${doc.max_weight}:${doc.dimensions.length}x${doc.dimensions.breadth}x${doc.dimensions.height}`;
                  bindId++;
                  var url=`http://www.packit4me.com/api/call/raw?bins=${bin}&items=${loads}`
                   cursor.pause();
                  request.post(url,function (err,res,body) {
                      if(JSON.parse(body)[0].items.length===loadsLength)
                      {
                          validTrucks.push(doc);

                      }
                      cursor.resume();

                  })



              })

              cursor.on('end',function (doc) {
                 if(validTrucks.length>0) resolve(validTrucks);
                 else reject('not truck is valid for your loads');

              })




    })
*/

}

module.exports={
    calculateBestTruck,
    calculatePrice
}