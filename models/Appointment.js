const mongoose=require('mongoose');
const appointmentSchema= new mongoose.Schema({
    fullname:String,
    phonenumber:String,
    profession:String,
    insurancedetails:String,
    appointment_date:Date,
    appointment_time:String
});
module.exports=mongoose.model('Appointments', appointmentSchema);
