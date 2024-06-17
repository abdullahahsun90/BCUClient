document.addEventListener("DOMContentLoaded", function() {
    const adminPanel = document.getElementById("adminPanel");
    document.getElementById("addUserBtn").addEventListener("click", addUser);
    document.getElementById("changePasswordBtn").addEventListener("click", changePassword);
    document.getElementById("removeOperatorBtn").addEventListener("click", removeUser);
    document.getElementById("modifyOperatorPasswordBtn").addEventListener("click", modifyOperatorPassword);
    document.getElementById("viewUsersTab").addEventListener("click", fetchAndDisplayUsers);
    // Check if user is admin
    if (localStorage.getItem("userStatus") === "Admin") {
        document.getElementById("addUserTab").style.display = "block";
        document.getElementById("changePasswordTab").style.display = "block";
        document.getElementById("removeOperatorTab").style.display = "block";
        document.getElementById("modifyOperatorPasswordTab").style.display = "block";
        document.getElementById("viewUsersTab").style.display = "block";
    } else if (localStorage.getItem("userStatus") === "Operator") { 
        document.getElementById("addUserTab").style.display = "none";
        document.getElementById("changePasswordTab").style.display = "block";
        document.getElementById("removeOperatorTab").style.display = "none";
        document.getElementById("modifyOperatorPasswordTab").style.display = "none";
        document.getElementById("viewUsersTab").style.display = "none";
    } else {
        alert("You are not authorized to access this page. First login to continue");
        window.location.href = 'main.html';
    }

    function addUser() {
        const userEmail = document.getElementById("userEmail").value;
        const userPassword = document.getElementById("userPassword").value;
        const userType = document.getElementById("userType").value; // Added line to get user type
    
        // Basic validation
        if (userEmail.trim() === "" || userPassword.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }
    
        fetch('http://localhost:5262/Login/AddUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
                userType: userType
            })
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
            // Handle successful response
            alert("New user added successfully.");
            console.log(data); // Log response data if needed
        })
        .catch(error => {
            // Handle errors
            alert("Error: " + error);
            console.error('Error adding new user:', error);
        });
    }
    

    function changePassword() {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;
    
        // Basic validation
        if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmNewPassword.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }
    
        if (newPassword !== confirmNewPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
    
        // Construct data object
        const data = {
            userEmail: localStorage.getItem("userMail"),
            currentPassword: currentPassword,
            newPassword: newPassword
        };
    
        
        // Fetch API POST request to update password
        fetch('http://localhost:5262/Login/ChangePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
            // Handle successful response
            alert("Password changed successfully.");
            console.log(data); // Log response data if needed
        })
        .catch(error => {
            // Handle errors
            alert("Error: " + error.message);
            console.error('Error changing password:', error);
        });
    }
    

    function removeUser() {
        const removeOperatorEmail = document.getElementById("removeOperatorEmail").value;
    
        if (removeOperatorEmail.trim() === "") {
            alert("Please enter the email address of the user to remove.");
            return;
        }
    
        
        // Fetch API DELETE request to remove user
        fetch('http://localhost:5262/Login/RemoveUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operatorEmail: removeOperatorEmail,
                adminMail: localStorage.getItem("userMail") 
            })
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
            // Handle successful response
            alert("User removed successfully.");
            console.log(data); // Log response data if needed
        })
        .catch(error => {
            // Handle errors
            alert("Error: " + error.message);
            console.error('Error removing user:', error);
        });
    }
    
    function modifyOperatorPassword() {
        const operatorEmail = document.getElementById("operatorEmail").value;
        const operatorNewPassword = document.getElementById("operatorNewPassword").value;
        const confirmOperatorNewPassword = document.getElementById("confirmOperatorNewPassword").value;
    
        // Basic validation
        if (operatorEmail.trim() === "" || operatorNewPassword.trim() === "" || confirmOperatorNewPassword.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }
    
        if (operatorNewPassword !== confirmOperatorNewPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
    
        // Construct data object
        const data = {
            loggedInUserMail: localStorage.getItem("userMail"),
            operatorEmail: operatorEmail,
            newPassword: operatorNewPassword
        };
    
        // Fetch API POST request to modify operator password
        fetch('http://localhost:5262/Login/ModifyOperatorPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
            // Handle successful response
            alert("Operator password modified successfully.");
            console.log(data); // Log response data if needed
        })
        .catch(error => {
            // Handle errors
            alert("Error: " + error.message);
            console.error('Error modifying operator password:', error);
        });
    }
    
    function fetchAndDisplayUsers() {
        // Fetch user data from the server
        fetch('http://localhost:5262/Login/GetUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(error => { throw new Error(error); });
        })
        .then(users => {
            // Populate the table with user data
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = ''; // Clear existing rows

            while(usersTableBody.firstChild){
                usersTableBody.remove(usersTableBody.firstChild);
            }

            users.forEach(user => {
                const row = document.createElement('tr');
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                const userTypeCell = document.createElement('td');
                if(user.userStatus === 0)
                    userTypeCell.textContent = "Admin";
                else 
                    userTypeCell.textContent = "Operator";
                
                row.appendChild(emailCell);
                row.appendChild(userTypeCell);
                usersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching users:', error);
            alert('Error fetching users:', error);
        });
    }

});
