const express=require('express');
const bodyParser=require('body-parser');
const app=new express();
var mongoose=require('mongoose');

var database=require('./db');

var jwt=require('./jwt');

var map=require('./mapApi');

var {Users}=require('./models/user');

var {Truck}=require('./models/truck');

var utils=require('./utils');



app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(bodyParser.json({limit:'50mb',extended:true}));

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
});

database.createDBConnection();





var verifyToken=function(req,res,next){
    var token=req.body.token || req.headers['token'];
    if(token){
        jwt.verify(token).then(function (mes) {
            next();
        }).catch(function (err) {
            res.send(err);
        })
    }else{
        res.send('user not signed in ');
    }
}

var checkIfAdmin=function(req,res,next){
    var token=req.body.token || req.headers['token'];
    if(token){
        jwt.verify(token).then(function (mes) {
            if(mes.role==='admin')
            next();
            else res.send('you are not authorised');
        }).catch(function (err) {
            res.send(err);
        })
    }else{
        res.send('user not signed in ');
    }
}



app.get('/allTrucks',checkIfAdmin,function (req,res) {
    Truck.find({}).then(function (result) {
        res.send(result);
    })
})

app.put('/updateTruckDetails',checkIfAdmin,function (req,res) {

    Truck.update({emailId:req.body.emailId},{$set:req.body}).then(function (result) {
        res.send(result);

    }).catch(function (err) {
        res.send(err);
    })
})


app.delete('/deleteSingleTruck',checkIfAdmin,function (req,res) {

    Truck.deleteOne({name:req.body.name}).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        res.send(err);
    })
})
app.post('/addTruck',checkIfAdmin,function (req,res) {
    var truck=new Truck();
    truck.name=req.body.name;
    var l=req.body.dimensions.length;
    var b=req.body.dimensions.breadth;
    var h=req.body.dimensions.height;

    truck.dimensions.breadth=b;
    truck.dimensions.height=h;
    truck.dimensions.length=l;
    truck.max_weight=req.body.max_weight;
    truck.base_price=req.body.base_price;
    truck.per_km_price=req.body.per_km_price;
    truck.truck_number=req.body.truck_number;
    truck.truck_capacity=l*b*h;
    truck.save().then(function (res) {
        console.log(res);
        res.send(res);
    }).catch(function (err) {
        res.send(err);
    })
})


app.post('/bestTruck',verifyToken,function (req,res) {


     map.getDistance(req.body.origin, req.body.destination).then(function (distance) {

        var objectArray=req.body.objects;
        var items="";
        var totalW=0;
        var totalVolume=0;
        for(var i=0;i<objectArray.length;i++){
            items=items+`${i}:${0}:${objectArray[i].weight}:${objectArray[i].length}x${objectArray[i].breadth}x${objectArray[i].height}`
            if(i!==objectArray.length-1)items=items+',';
            totalW=totalW+objectArray[i].weight;
            totalVolume=totalVolume+(objectArray[i].length*objectArray[i].breadth*objectArray[i].height);
        }
        utils.calculateBestTruck(items,objectArray.length,totalW,totalVolume).then(function (validTruck) {

            utils.calculatePrice(validTruck,distance).then(function (finalObj) {
               res.send(finalObj);
            })

        }).catch(function (err) {
           console.log(err);
           res.send(err);
        })


    }).catch(function (err) {
        res.send(err);
    })

/*


    prom[0]=;
    map.getDistance(req.body.origin,req.body.destination);

    Promise.all(prom).then(function (result) {

        utils.calculatePrice(result[0],result[1]).then(function (price) {
           res.send(price);
       })


    }).catch(function (err) {
        res.send(err);
    })



    /*utils.calculateBestTruck(items,objectArray.length,totalW,totalVolume).then(function (validTrucks) {
        .then(function (result) {
            utils.calculatePrice(validTrucks,result).then(function (last) {
                res.send(last);
            });
        }).catch(function (err) {
            res.send(err);
        })
    }).catch(function (err) {
        res.send(err);
    });
*/


})


app.post('/signUp',function (req,res) {
    var user=new Users();
    user.name=req.body.name;
    user.emailId=req.body.emailId;
    user.password=req.body.password;
    user.role=req.body.role;
    user.save().then(function (res) {
        console.log(res);
        res.send('user saved');
    }).catch(function (err) {
       res.send(err);
    })
})

app.post('/login',function (req,res) {
    database.checkEMailPassword(req.body.emailId,req.body.password).then(function (result) {
        Users.update({emailId:req.body.emailId},{$set:{user_token:result}}).then(function (resultUPs) {
            console.log(resultUPs);
            res.send(result);
        })

    }).catch(function (err) {
        res.send(err);
    })

})




app.listen(3000,function (err,res) {
    console.log('server is running');
})
