window.addEventListener('load', function() {
    // Call your function when the page is loaded
    var loggedInUser = this.document.getElementById("loggedInUserEmail");
    loggedInUser.textContent = this.localStorage.getItem("userMail");
    document.getElementById("logoutButton").addEventListener("click", logOut);
    manageTabs();
    console.log("load called");
});

// Function to logout of current account
function logOut(){
    localStorage.setItem("userStatus", "");
    localStorage.setItem("userMail", "");
    window.location.href = 'main.html';
}

// Function to show or hide tabs based on user role
function manageTabs() {
    // Get the tabs
    const monitorTab = document.getElementById("monitor-tab");
    const controlTab = document.getElementById("control-tab");
    const userMgmtTab = document.getElementById("userMgmt-tab");
    const controlDiv = document.getElementById("control");

    // If the user is an admin, show all tabs
    if (localStorage.getItem("userStatus") === "Admin") {
        monitorTab.style.display = "block";
        controlTab.style.display = "block";
        userMgmtTab.style.display = "block";
    } 
    else if (localStorage.getItem("userStatus") === "Operator")
    {
        // monitorTab.hidden = false;
        // controlTab.hidden = true;
        // userMgmtTab.hidden = false;
        monitorTab.style.display = "block";
        controlTab.style.display = "none";
        userMgmtTab.style.display = "block";
    }
    else
    {
        window.location.href = 'main.html';
    }
}