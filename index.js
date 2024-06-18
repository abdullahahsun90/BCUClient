var serverIP;
document.addEventListener("DOMContentLoaded", function() {
    // Get form and button elements
    var form = document.querySelector('form');

    // Add event listener for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get input values
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;
        serverIP = document.getElementById('serverIP').value;

        const myVariable = serverIP;
        localStorage.setItem('sharedVariable', JSON.stringify(myVariable));

        // Check if any field is empty
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        loginUser(email, password);        
    });
});

function loginUser(email, password) {
    fetch(`http://${serverIP}:5262/Login?email=${encodeURIComponent(email.toString())}&password=${encodeURIComponent(password.toString())}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        else {
            // Parse the error response sent by the server
            return response.json().then(error => {
                throw new Error(error);
            });
        }
    })
    .then(data => {
        
        console.log(data); 
        const userType = data.toString(); 

        localStorage.setItem("userStatus", userType.toString());
        localStorage.setItem("userMail", email);
        
        // navigate to BCU screen
        window.location.href = 'BCU.html';
    })
    .catch(error => {
        alert(error);
    });
}
