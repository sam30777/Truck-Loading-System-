var mongoose=require('mongoose');

var Truck=mongoose.model('Trucks',{
    "name":{type:String,required:true,minLength:1},
    "dimensions":{
        "length":{type:Number},
        "breadth":{type:Number},
        "height":{type:Number}
    },
    "base_km":{required:true,type:Number},
    "truck_number":{required:true,type:String,unique:true},
    "max_weight":{type:Number,minLength:1},
    "base_price":{required:true,type:Number,minLength:1},
    "per_km_price":{type:String,default:null},
    "truck_capacity":{type:Number,required:true}
});

module.exports={
    Truck
}