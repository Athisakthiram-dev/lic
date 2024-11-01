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
        res.send(` <html>
                <head>
                    <title>Appointment Booked</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            font-family: Arial, sans-serif;
                            background: linear-gradient(135deg, #f9a825, #ffeb3b);
                            color: #333;
                            text-align: center;
                        }
                        .container {
                            background: white;
                            padding: 30px;
                            border-radius: 12px;
                            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
                            max-width: 400px;
                        }
                        h1 {
                            color: #4caf50;
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        p {
                            color: #555;
                            font-size: 18px;
                        }
                        .icon {
                            font-size: 50px;
                            color: #4caf50;
                            margin-bottom: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="icon">✔️</div>
                        <h1>Appointment Booked Successfully</h1>
                        <p>You will be redirected to the homepage shortly...</p>
                        <script>
                            setTimeout(function() {
                                window.location.href = "/";
                            }, 5000); // Redirect after 1 second
                        </script>
                    </div>
                </body>
            </html>`);
    }catch (error){
        console.error('Error booking appointment: ', error);
        res.status(500).send('Error booking appointment');
    }
});


//admin route to view appointments
app.get('/hidden-123-admin/appointments', async (req,res)=>{
    try{
        const appointments=await Appointment.find();
        res.json(appointments);
    }catch(error){
        console.error('Error fetching appointments: ', error);
        res.status(500).send('Error fetching appointments')
    }
});
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
