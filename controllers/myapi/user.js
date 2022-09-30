const db = require('../../models')



const User = db.user


exports.addUser = async (req,res)=>{
    try {
        console.log('====',req.body);
        const user = await User.create(req.body)
        res.status(200).json({
            status:"sucess",
            data:user
        })
    } catch (err) {
        res.status(400).json({
            status:"fail",
            err
        })
    }

}