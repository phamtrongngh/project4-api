const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
let shipper = new Scheme(
    {
        name:String,
        dob:Date,
        gender:Boolean,
        avatar:String,
        rating:[
            {
                idUser:{
                    type:Scheme.Types.ObjectId,
                    ref:"User"
                },
                stars:{
                    type:Number,
                    enums:[1,2,3,4,5]
                },
                comment: String

            }
        ],
        ordersId:[
            {
                type:Scheme.Types.ObjectId,
                ref:"Order"
            }
        ]
    }
)
module.exports = mongoose.model("Shipper",shipper,"Shipper");