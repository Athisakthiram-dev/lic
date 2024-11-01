
document.addEventListener('DOMContentLoaded', function(){
    const appointmentForm=document.getElementById('appointmentForm');
    appointmentForm.addEventListener('submit',function (event){
        const phonenumber=document.getElementById('phonenumber').value;
        const appointmentDate=document.getElementById('appointment_date').value;
        const today=new Date();

        //phonenumber
        if(phonenumber.length !==10 || isNaN(phonenumber)){
            alert("Please enter the valid phonenumber!");
            event.preventDefault();
            return;
        }
        if(appointmentDate < today.setHours(0,0,0,0)){
            alert("Event cannot be in past");
            event.preventDefault();
            return;
        }
    })
})
