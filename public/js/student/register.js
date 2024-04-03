
function showAlertMessage(msg, type="error"){
    const alertContainer = document.getElementById("alert-container");
    const alertMessage = document.getElementById("alert-message");
    const customAlert = document.getElementById("custom-alert")

    switch (type) {
        case "error":
            customAlert.style.backgroundColor = "#ED4337"
            break;
        case "success":
            customAlert.style.backgroundColor = "#03B381"
            break
        default:
            customAlert.style.backgroundColor = "#ED4337"
            break;
    }
    
    alertContainer.style.display = "flex";
    alertMessage.innerText = msg
    
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Retrieve form data
        const formData = new FormData(form);

        // Convert formData to JSON object
        const formDataJSON = {};
        formData.forEach(function (value, key) {
            formDataJSON[key] = value;
        });

        try {

            if(formDataJSON["password"] !== formDataJSON["confirm-password"]){
                throw new Error("Password and Confirm password not matching.")
            }
            // Make POST request to /api/student/register
            const response = await fetch('/api/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataJSON)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }

            // Handle successful registration
            console.log('Registration successfull', data);
            showAlertMessage('Registration successfull', "success");
            window.location.replace("/student/login")
            // Redirect or show success message as needed
        } catch (error) {
            // Handle errors
            console.log('There was a problem with the registration:', error.message);
            showAlertMessage(error.message)
            // Display error message to the user or retry registration
        }
    });
});
