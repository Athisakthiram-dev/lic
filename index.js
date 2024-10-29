require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const Appointment=require('./models/Appointment');

const app=express();
const PORT= process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const cors = require('cors');
app.use(cors());


//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


//mongodb connection
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
.then(()=>console.log("Connected to the mongodb"))
.catch((err)=> console.error('MongoDb connection error:', err));


//serve static pages
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'public','home.html')));
app.get('/about',(req,res)=>res.sendFile(path.join(__dirname,'public','about.html')));
app.get('/appointment',(req,res)=>res.sendFile(path.join(__dirname,'public','Appointment.html')));
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

//handle form submisson
app.post('/book', async(req,res)=>{
    try{
        const {fullname,phonenumber,profession,insurancedetails, appointment_date,appointment_time}=req.body;
        const appointment=new Appointment({
            fullname,
            phonenumber,
            profession,
            insurancedetails,
            appointment_date,
            appointment_time
        });
        await appointment.save();
        res.send('<h1>Appointment Booked Successfully</h1><a href="/">Back to Home</a>');
    }catch (error){
        console.error('Error booking appointment: ', error);
        res.status(500).send('Error booking appointment');
    }
});


//admin route to view appointments
app.get('/admin/appointments', async (req,res)=>{
    try{
        const appointments=await Appointment.find();
        res.json(appointments);
    }catch(error){
        console.error('Error fetching appointments: ', error);
        res.status(500).send('Error fetching appointments')
    }
});
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
