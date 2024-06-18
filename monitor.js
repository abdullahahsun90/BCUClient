import LiveParams from './LiveParams.js';

const ServerIP = JSON.parse(localStorage.getItem('sharedVariable'));
const liveParams = new LiveParams();

var parameters = [];
var gauges = [];
var gaugesAnalogDieTemperature = [];
var gaugesDigitalDieTemperature = [];
var alarmStatus; 
var warningStatus; 
var faultStatus; 
var AFE_UnderVoltageFaultStatus; 
var alarmText = [
    "Cell Over Voltage",
    "Cell Under Voltage",
    "Over Charging Current",
    "Over Discharging Current",
    "Over Temperature",
    "Under Temperature",
    "Cell Voltage Difference",
    "BCU Temp Difference",
    "Under SOC",
    "Under SOH",
    "Over Charging Power",
    "Over Discharging Power",
    "BAT Over Voltage",
    "BAT Under Voltage",
    "Plug Mismatch",
    "Reserved"
]
var warningText = [
    "Cell Over Voltage",
    "Cell Under Voltage",
    "Over Charging Current",
    "Over Discharging Current",
    "Over Temperature",
    "Under Temperature",
    "Cell Voltage Difference",
    "BCU Temp Difference",
    "Under SOC",
    "Under SOH",
    "Over Charging Power",
    "Over Discharging Power",
    "BAT Over Voltage",
    "BAT Under Voltage",
    "Reserved",
    "Reserved"
]
var faultText = [
    "Cell Over Voltage",
    "Cell Under Voltage",
    "Over Charging Current",
    "Over Discharging Current",
    "Over Temperature",
    "Under Temperature",
    "Cell Voltage Difference",
    "BCU Temp Difference",
    "BAT Over Voltage",
    "Internal Communication",
    "External Communication",
    "PreCharge Fail",
    "Parallel Fail",
    "System Fault",
    "Hardware Fault",
    "BAT Under Voltage"
]
var AFE_UnderVoltageFaultText = [
    "Cell 0 Under Voltage Fault Status",
    "Cell 1 Under Voltage Fault Status",
    "Cell 2 Under Voltage Fault Status",
    "Cell 3 Under Voltage Fault Status",
    "Cell 4 Under Voltage Fault Status",
    "Cell 5 Under Voltage Fault Status",
    "Cell 6 Under Voltage Fault Status",
    "Cell 7 Under Voltage Fault Status",
    "Cell 8 Under Voltage Fault Status",
    "Cell 9 Under Voltage Fault Status",
    "Cell 10 Under Voltage Fault Status",
    "Cell 11 Under Voltage Fault Status",
    "Cell 12 Under Voltage Fault Status",
    "Cell 13 Under Voltage Fault Status",
    "Cell 14 Under Voltage Fault Status",
    "Cell 15 Under Voltage Fault Status"
];
var AFE_OverVoltageFaultStatus; 
var AFE_OverVoltageFaultText = [
    "Cell 0 Over Voltage Fault Status",
    "Cell 1 Over Voltage Fault Status",
    "Cell 2 Over Voltage Fault Status",
    "Cell 3 Over Voltage Fault Status",
    "Cell 4 Over Voltage Fault Status",
    "Cell 5 Over Voltage Fault Status",
    "Cell 6 Over Voltage Fault Status",
    "Cell 7 Over Voltage Fault Status",
    "Cell 8 Over Voltage Fault Status",
    "Cell 9 Over Voltage Fault Status",
    "Cell 10 Over Voltage Fault Status",
    "Cell 11 Over Voltage Fault Status",
    "Cell 12 Over Voltage Fault Status",
    "Cell 13 Over Voltage Fault Status",
    "Cell 14 Over Voltage Fault Status",
    "Cell 15 Over Voltage Fault Status"
];
// Create an array to store references to the LED elements
var AFE_UnderVoltageLeds = [];
var AFE_OverVoltageLeds = [];
var Rack_AlarmLeds = [];
var Rack_WarningLeds = [];
var Rack_FaultLeds = [];
const parameterLabels = [
    "Identification Manufacture Name 1",
    "Identification Manufacture Name 2",
    "Identification Manufacture Name 3",
    "Identification Manufacture Name 4",
    "Rack Alarm Flags",
    "Rack Warning Flags",
    "Rack Fault Flags",
    "Rack Alarm BCU Position",
    "Rack Warning BCU Position",
    "Rack Fault BCU Position",
    "Average BCU Voltage",
    "Sum BCU Current",
    "Average BCU SOC",
    "Average BCU SOH",
    "Min Cell Voltage All Modules",
    "BCU Id Min Cell Voltage",
    "Max Cell Voltage All Modules",
    "BCU Id Max Cell Voltage",
    "Min Temperature Battery Rack",
    "BCU Id Min Temp",
    "Max Temperature Battery Rack",
    "BCU Id Max Temp",
    "Max Charge Current Limit Rack",
    "Max Discharge Current Limit Rack",
    "Max DC Charge Current Limit Per BCU",
    "Max DC Discharge Current Limit Per BCU",
    "Connected BCU Count",
    "Cells In Series Per Module",
    "Upper Cell Voltage Border Rack",
    "Lower Cell Voltage Border Rack",
    "Rack HW Fault Detail",
    "Rack System Fault Detail",
    "CV Point",
    "Rack Status Flag",
    "Battery Start Stop",
    "BCU SW Version",
    "BCU HW Version",
    "BCU Status Flags",
    "BCU Alarm Flags",
    "BCU Warning Flags",
    "BCU Fault Flags",
    "BCU HW Fault Detail",
    "BCU System Fault Detail",
    "BCU SOC",
    "BCU SOH",
    "Battery BCU Voltage",
    "Battery BCU Current",
    "Min Cell Voltage BCU",
    "Max Cell Voltage BCU",
    "Average Of All Cell Voltages",
    "BCU Max Charge Current",
    "BCU Min Charge Current",
    "Number Of Full Charged Discharged Cycles",
    "Design Capacity",
    "Usable Capacity",
    "Remaining Capacity",
    "Upper Cell Voltage Border",
    "Lower Cell Voltage Border",
    "Number Of BMU",
    "BCU System Fault Detail Expand",
    "Load Voltage",
    "Max BCU Temperature",
    "Min BCU Temperature",
    "BCU Temperature 3",
    "Acc Charge Energy Hi",
    "Acc Charge Energy Low",
    "Acc Discharge Energy Hi",
    "Acc Discharge Energy Low",
    "BMS Serial Number Hi",
    "BMS Serial Number Low"
];
var myChart = [];
var balancingChart = [];

document.addEventListener("DOMContentLoaded", function() {
    // Initialize gauges
    for (var j = 0; j < 24; j++)
    {
        for (var i = 0; i < 16; i++) {
            gauges.push({
                id: "BMU" + j + "_gaugeContainer" + i,
                value: 0 // Initial value
            });
        }
    }

    // Initialize gauges Analog Die
    for (var j = 0; j < 24; j++)
    {
        for (var i = 0; i < 1; i++) {
            gaugesAnalogDieTemperature.push({
                id: "BMU" + j + "_gaugeContainer_AnalogDie" + i,
                value: 0 // Initial value
            });
        }
    }

    // Initialize gauges Digital Die
    for (var j = 0; j < 24; j++)
    {
        for (var i = 0; i < 1; i++) {
            gaugesDigitalDieTemperature.push({
                id: "BMU" + j + "_gaugeContainer_DigitalDie" + i,
                value: 0 // Initial value
            });
        }
    }

    var gaugesWrapper;
    for (var j = 0; j < 24; j++)
    {
        gaugesWrapper = document.getElementById("gaugesWrapper_BMU" + j);

        for (var i = 0; i < 16; i++) {
            var div = document.createElement("table");
            // Create table rows and cells
            var row1 = div.insertRow();
            var cell1 = row1.insertCell();
            cell1.textContent = "Channel " + i;
            cell1.style.textAlign = "center";
            var row2 = div.insertRow();
            var cell2 = row2.insertCell();
            var gaugeId = "BMU" + j + "_gaugeContainer" + i;
            cell2.textContent = getGaugeValue(gaugeId);
            cell2.style.fontWeight = "bold";
            cell2.style.textAlign = "center";
            // Apply styles for borders
            div.style.border = "2px solid #0497c3 20px"; // Add border to the table
            div.style.color = "#282828";
            div.style.background = "#c0ced5";
            div.style.margin = "3px"; // Add margin
            div.style.borderRadius = "20px"; // Add border radius
            div.id = gaugeId;
            div.className = "gaugeContainerStyle";
            var id = "BMU" + j + " - Ch" + i + " Voltage";
    
            // Attach a click event listener to the icon
            div.addEventListener("click", (function(id) {
                return function() {
                    // navigate to graph screen
                    var variableValue = id; 
                    window.location.href = 'graph.html?id=' + encodeURIComponent(variableValue);
                };
            })(id));
    
            gaugesWrapper.appendChild(div);
        }
    }

    for (var j = 0; j < 24; j++)
    {
        gaugesWrapper = document.getElementById("gaugesWrapper_AnalogDie_BMU" + j);

        for (var i = 0; i < 1; i++) {
            var div = document.createElement("table");
            // Create table rows and cells
            var row1 = div.insertRow();
            var cell1 = row1.insertCell();
            cell1.textContent = "Die 1";
            cell1.style.textAlign = "center";
            var row2 = div.insertRow();
            var cell2 = row2.insertCell();
            cell2.textContent = "0";
            var gaugeId = "BMU" + j + "_gaugeContainer_AnalogDie" + i;
            cell2.style.fontWeight = "bold";
            cell2.style.textAlign = "center";
            // Apply styles for borders
            div.style.border = "2px solid #0497c3 20px"; // Add border to the table
            div.style.color = "#282828";
            div.style.background = "#c0ced5";
            div.style.margin = "3px"; // Add margin
            div.style.borderRadius = "20px"; // Add border radius
            div.id = gaugeId;
            div.className = "gaugeContainerStyle";
            var id = "BMU" + j + " - Analog Die Temperature";
    
            // Attach a click event listener to the icon
            div.addEventListener("click", (function(id) {
                return function() {
                    // navigate to graph screen
                    var variableValue = id; 
                    window.location.href = 'graph.html?id=' + encodeURIComponent(variableValue);
                };
            })(id));
    
            gaugesWrapper.appendChild(div);
        }
    }

    for (var j = 0; j < 24; j++)
    {
        gaugesWrapper = document.getElementById("gaugesWrapper_DigitalDie_BMU" + j);

        for (var i = 0; i < 1; i++) {
            var div = document.createElement("table");
            // Create table rows and cells
            var row1 = div.insertRow();
            var cell1 = row1.insertCell();
            cell1.textContent = "Die 2";
            cell1.style.textAlign = "center";
            var row2 = div.insertRow();
            var cell2 = row2.insertCell();
            cell2.textContent = "0";
            var gaugeId = "BMU" + j + "_gaugeContainer_DigitalDie" + i;
            cell2.style.fontWeight = "bold";
            cell2.style.textAlign = "center";
            // Apply styles for borders
            div.style.border = "2px solid #0497c3 20px"; // Add border to the table
            div.style.color = "#282828";
            div.style.background = "#c0ced5";
            div.style.margin = "3px"; // Add margin
            div.style.borderRadius = "20px"; // Add border radius
            div.id = gaugeId;
            div.className = "gaugeContainerStyle";
            var id = "BMU" + j + " - Digital Die Temperature";
    
            // Attach a click event listener to the icon
            div.addEventListener("click", (function(id) {
                return function() {
                    // navigate to graph screen
                    var variableValue = id; 
                    window.location.href = 'graph.html?id=' + encodeURIComponent(variableValue);
                };
            })(id));
    
            gaugesWrapper.appendChild(div);
        }
    }

    // Convert uint16 value to array of individual bits
    var alarmValues = [];
    for (var i = 0; i < 16; i++) {
        alarmValues.push((alarmStatus >> i) & 1);
    }

    // Generate LED indicators dynamically
    var alarmStatusDiv = document.getElementById('alarmStatus');
    for (var i = 0; i < 16; i++) {
        var ledDiv = document.createElement('div');
        ledDiv.classList.add('led');
        // Assign a unique ID or data attribute to each LED element
        ledDiv.setAttribute('data-id', i); // For example, using data-id attribute
        // Store the reference to the LED element in the array
        Rack_AlarmLeds.push(ledDiv);
        ledDiv.classList.add('led-off');
        alarmStatusDiv.appendChild(ledDiv);
        var alarmSpan = document.createElement('span');
        alarmSpan.textContent = alarmText[i];
        alarmStatusDiv.appendChild(alarmSpan);
        alarmStatusDiv.appendChild(document.createElement('br'));
    }

    // Convert uint16 value to array of individual bits
    var warningValues = [];
    for (var i = 0; i < 16; i++) {
        warningValues.push((warningStatus >> i) & 1);
    }

    // Generate LED indicators dynamically
    var warningStatusDiv = document.getElementById('warningStatus');
    for (var i = 0; i < 16; i++) {
        var ledDiv = document.createElement('div');
        ledDiv.classList.add('led');
        // Assign a unique ID or data attribute to each LED element
        ledDiv.setAttribute('data-id', i); // For example, using data-id attribute
        // Store the reference to the LED element in the array
        Rack_WarningLeds.push(ledDiv);
        ledDiv.classList.add('led-off');
        warningStatusDiv.appendChild(ledDiv);
        var warningSpan = document.createElement('span');
        warningSpan.textContent = warningText[i];
        warningStatusDiv.appendChild(warningSpan);
        warningStatusDiv.appendChild(document.createElement('br'));
    }

    // Convert uint16 value to array of individual bits
    var faultValues = [];
    for (var i = 0; i < 16; i++) {
        faultValues.push((faultStatus >> i) & 1);
    }

    // Generate LED indicators dynamically
    var faultStatusDiv = document.getElementById('faultStatus');
    for (var i = 0; i < 16; i++) {
        var ledDiv = document.createElement('div');
        ledDiv.classList.add('led');
        // Assign a unique ID or data attribute to each LED element
        ledDiv.setAttribute('data-id', i); // For example, using data-id attribute
        // Store the reference to the LED element in the array
        Rack_FaultLeds.push(ledDiv);
        ledDiv.classList.add('led-off');
        faultStatusDiv.appendChild(ledDiv);
        var faultSpan = document.createElement('span');
        faultSpan.textContent = faultText[i];
        faultStatusDiv.appendChild(faultSpan);
        faultStatusDiv.appendChild(document.createElement('br'));
    }

    // Generate LED indicators for Fault Status dynamically
    var faultStatusDiv;
    for (var j = 0; j < 24; j++) {
        faultStatusDiv = document.getElementById('BMU' + j + '_UnderVoltageFaultStatus');
        for (var i = 0; i < 16; i++) {
            var ledDiv = document.createElement('div');
            ledDiv.classList.add('led');
            ledDiv.classList.add('led-off');
             // Assign a unique ID or data attribute to each LED element
            ledDiv.setAttribute('data-id', j+i); // For example, using data-id attribute
            // Store the reference to the LED element in the array
            AFE_UnderVoltageLeds.push(ledDiv);
            faultStatusDiv.appendChild(ledDiv);
            var faultSpan = document.createElement('span');
            faultSpan.textContent = AFE_UnderVoltageFaultText[i];
            faultStatusDiv.appendChild(faultSpan);
            faultStatusDiv.appendChild(document.createElement('br'));
        }
    }
    for (var j = 0; j < 24; j++) {
        faultStatusDiv = document.getElementById('BMU' + j + '_OverVoltageFaultStatus');
        for (var i = 0; i < 16; i++) {
            var ledDiv = document.createElement('div');
            ledDiv.classList.add('led');
            ledDiv.classList.add('led-off');
             // Assign a unique ID or data attribute to each LED element
            ledDiv.setAttribute('data-id', j+i); // For example, using data-id attribute
            AFE_OverVoltageLeds.push(ledDiv);
            faultStatusDiv.appendChild(ledDiv);
            var faultSpan = document.createElement('span');
            faultSpan.textContent = AFE_OverVoltageFaultText[i];
            faultStatusDiv.appendChild(faultSpan);
            faultStatusDiv.appendChild(document.createElement('br'));
        }
    }

    updateParameters();

    // Get reference to the parameter container
    var parameterContainer = document.getElementById("parameterContainer");

    // Loop through the parameters array and create parameter elements
    parameters.forEach(function(parameter) {
        var parameterDiv = document.createElement("div");
        parameterDiv.classList.add("parameter");

        var nameHeading = document.createElement("h4");
        nameHeading.textContent = parameter.name;

        // Create value with status
        var statusValue = document.createElement("p");
        statusValue.classList.add("status-value");
        statusValue.textContent = parameter.value;
        parameterDiv.appendChild(nameHeading);
        parameterDiv.appendChild(statusValue);

        // Create progress bar
        var progressBar = document.createElement("div");
        progressBar.classList.add("progress");

        var progressBarInner = document.createElement("div");
        progressBarInner.classList.add("progress-bar");
        progressBarInner.style.width = ((parameter.value*100)/65535) + "%"; // Set the width based on the parameter value
        progressBar.appendChild(progressBarInner);
        parameterDiv.appendChild(progressBar);

        parameterContainer.appendChild(parameterDiv);
    });
});

// Function to update the gauge value 
function updateVoltage(gaugeIndex, value, BMU_Index) {
    if (!isNaN(gaugeIndex) && gaugeIndex >= 0 && gaugeIndex < 16*16) {
        // Update the value in the table cell
        var cell = document.getElementById(gauges[gaugeIndex+(BMU_Index*16)].id).getElementsByTagName('td')[1];
        if (cell) {
            cell.textContent = value.toFixed(3); 
        }
    } else {
        console.error("Invalid gauge ID:", gaugeIndex+(BMU_Index*16));
    }
}

function updateAnalogDieTemperature(value, BMU_Index) {
    var cell = document.getElementById(gaugesAnalogDieTemperature[BMU_Index].id).getElementsByTagName('td')[1];
    if (cell) {
        cell.textContent = value.toFixed(0); 
    }
}

function updateDigitalDieTemperature(value, BMU_Index) {
    var cell = document.getElementById(gaugesDigitalDieTemperature[BMU_Index].id).getElementsByTagName('td')[1];
    if (cell) {
        cell.textContent = value.toFixed(0); 
    }
}

function updateParameters(){
    for (var i = 0; i < 70; i++) {
        var paramName = parameterLabels[i];
        var paramValue = liveParams.params[i];
        parameters.push({ name: paramName, value: paramValue });
    }
}

for(var j=0; j<24; j++){
    var ctx = document.getElementById('BMU' + j + '_ExtremeValuesChart').getContext('2d');

    // Sample data (replace with your actual data points)
    var data = []; // Empty array to store data objects
    
    // Define your parameters and their values
    var params = ['Max Cell Voltage', 'Min Cell Voltage', 'Max Temperature', 'Min Temperature', 'Voltage Sum'];
    var values = [0, 0, 0, 0, 0]; // values for each parameter
    
    // Loop to generate data points for the bar graph
    for (var i = 0; i < params.length; i++) {
      data.push({
        x: params[i], // Use the parameter name as the x-value
        y: values[i] // Use the corresponding value for the y-value
      });
    }
    
    var config = {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Extreme Values',
          backgroundColor: '#282828',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: data
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'category',
            labels: params, // Use the parameter names as labels for the x-axis
            scaleLabel: {
              display: true,
              labelString: 'Parameters' // Label for the x-axis
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Values' // Label for the y-axis
            },
            ticks: {
              beginAtZero: false // Start y-axis at zero
            }
          }]
        }
      }
    };
    
    myChart[j] = new Chart(ctx, config);
}

for(var j=0; j<24; j++){
    var ctx = document.getElementById('BMU' + j + '_BalancingChart').getContext('2d');

    // Sample data (replace with your actual data points)
    var data = []; // Empty array to store data objects
    
    // Define your parameters and their values
    var params = ['Cell 0', 'Cell 1', 'Cell 2', 'Cell 3', 'Cell 4', 'Cell 5', 'Cell 6', 'Cell 7',
     'Cell 8', 'Cell 9', 'Cell 10', 'Cell 11', 'Cell 12', 'Cell 13', 'Cell 14', 'Cell 15'];
    var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // values for each parameter
    
    // Loop to generate data points for the bar graph
    for (var i = 0; i < params.length; i++) {
      data.push({
        x: params[i], // Use the parameter name as the x-value
        y: values[i] // Use the corresponding value for the y-value
      });
    }
    
    var config = {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Balancing Status',
          backgroundColor: '#282828',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: data
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'category',
            labels: params, // Use the parameter names as labels for the x-axis
            scaleLabel: {
              display: true,
              labelString: 'Parameters' // Label for the x-axis
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Values' // Label for the y-axis
            },
            ticks: {
              beginAtZero: true // Start y-axis at zero
            }
          }]
        }
      }
    };
    
    balancingChart[j] = new Chart(ctx, config);
}

$(document).ready(function() {
    // Add class to the table wrapper on window resize to recalculate the max height
    $(window).resize(function() {
        $('.table-wrapper').each(function() {
        $(this).addClass('recalculate-max-height');
        });
    });
    $(".show-history-btn").click(function() {
      var tableId = $(this).attr("data-table") + "Table";
      var fromDateTime = new Date($("#fromDateTime_" + tableId).val());
      var toDateTime = new Date($("#toDateTime_" + tableId).val());
  
      // Check if the time span is valid (less than or equal to one month)
      var isValidTimeSpan = checkTimeSpan(fromDateTime, toDateTime);
      if (!isValidTimeSpan) {
        alert("Time span must be less than or equal to one month.");
        return;
      }
  
      // Perform HTTP request and update table with data
      
      if(tableId.search('BMU') >= 0)
        {
            if(tableId.search('under') >= 0)
            {
                getUnderVoltageFaultHistory(tableId, fromDateTime, toDateTime);
            }
            else if(tableId.search('over') >= 0)
            {
                getOverVoltageFaultHistory(tableId, fromDateTime, toDateTime);
            }
        }
        else
        {
            fetchDataAndUpdateTable(tableId, fromDateTime, toDateTime);
        }
      
    });
  
    function checkTimeSpan(fromDateTime, toDateTime) {
      // Calculate the difference in milliseconds
      var timeSpan = Math.abs(toDateTime.getTime() - fromDateTime.getTime());
      // Convert milliseconds to days
      var days = timeSpan / (1000 * 60 * 60 * 24);
      // Check if the time span is less than or equal to one month (31 days)
      return days <= 31;
    }
  
    function fetchDataAndUpdateTable(tableId, fromDateTime, toDateTime) {
        // Perform your HTTP request here using fetch API
        fetch(`http://${ServerIP}:5262/RackHistory?fromDateTime=${encodeURIComponent(fromDateTime.toISOString())}&toDateTime=${encodeURIComponent(toDateTime.toISOString())}&tableID=${encodeURIComponent(tableId)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            // Check if response is successful
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Parse response as JSON
            return response.json();
        })
        .then(data => {
            // Clear existing table rows
            document.getElementById(tableId).querySelector("tbody").innerHTML = "";
    
            // Iterate over the response data and populate the table
            data.forEach(item => {
                var row = document.createElement("tr");
                var dateTimeCell = document.createElement("td");
                dateTimeCell.textContent = item.dateTime;
                var faultCell = document.createElement("td");
                if (tableId === 'alarmTable') {
                    faultCell.textContent = alarmText[item.i];
                } else if (tableId === 'warningTable') {
                    faultCell.textContent = warningText[item.i];
                } else if (tableId === 'faultTable') {
                    faultCell.textContent = faultText[item.i];
                }
                row.appendChild(dateTimeCell);
                row.appendChild(faultCell);
                document.getElementById(tableId).querySelector("tbody").appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Error fetching data. Please try again.");
        });
    }
});

//Function to get under voltage fault history by BMU
function getUnderVoltageFaultHistory(tableId, fromTime, toTime)
{
    
        // Perform your HTTP request here using fetch API
     fetch(`http://${ServerIP}:5262/AFE_UnderVoltageHistory?fromDateTime=${encodeURIComponent(fromTime.toISOString())}&toDateTime=${encodeURIComponent(toTime.toISOString())}&tableID=${encodeURIComponent(tableId)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        // Parse response as JSON
        return response.json();
    })
    .then(data => {
        // Clear existing table rows
        document.getElementById(tableId).querySelector("tbody").innerHTML = "";

        // Iterate over the response data and populate the table
        data.forEach(item => {
            var row = document.createElement("tr");
            var dateTimeCell = document.createElement("td");
            dateTimeCell.textContent = item.dateTime;
            var faultCell = document.createElement("td");
            faultCell.textContent = AFE_UnderVoltageFaultText[item.i];
            row.appendChild(dateTimeCell);
            row.appendChild(faultCell);
            document.getElementById(tableId).querySelector("tbody").appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again.");
    });
}

//Function to get under voltage fault history by BMU
function getOverVoltageFaultHistory(tableId, fromTime, toTime)
{    
        // Perform your HTTP request here using fetch API
     fetch(`http://${ServerIP}:5262/AFE_OverVoltageHistory?fromDateTime=${encodeURIComponent(fromTime.toISOString())}&toDateTime=${encodeURIComponent(toTime.toISOString())}&tableID=${encodeURIComponent(tableId)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        // Parse response as JSON
        return response.json();
    })
    .then(data => {
        // Clear existing table rows
        document.getElementById(tableId).querySelector("tbody").innerHTML = "";

        // Iterate over the response data and populate the table
        data.forEach(item => {
            var row = document.createElement("tr");
            var dateTimeCell = document.createElement("td");
            dateTimeCell.textContent = item.dateTime;
            var faultCell = document.createElement("td");
            faultCell.textContent = AFE_OverVoltageFaultText[item.i];
            row.appendChild(dateTimeCell);
            row.appendChild(faultCell);
            document.getElementById(tableId).querySelector("tbody").appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again.");
    });
}

// Function to get the value of a gauge by ID
function getGaugeValue(gaugeId) {
    for (var i = 0; i < gauges.length; i++) {
        if (gauges[i].id === gaugeId) {
            return gauges[i].value.toFixed(3);
        }
    }
    // If gauge with the specified ID is not found, return null or handle appropriately
    return null;
}

// Update values dynamically
function updateChartValues(newValues, BMU_Index) {
    // Update the data array with new values
    for (var i = 0; i < newValues.length; i++) {
      myChart[BMU_Index].data.datasets[0].data[i].y = newValues[i];
    }
    
    // Update the chart
    myChart[BMU_Index].update();
  }

function fetchByteArrayAndUpdateParams(serverIP) {
    fetch('http://' + serverIP + ':5262/LiveParams', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            // Convert ArrayBuffer to Uint8Array
            const byteArray = new Uint8Array(arrayBuffer);            
            liveParams.updateParams(byteArray);

            var statusValues = parameterContainer.querySelectorAll('.status-value');
            var progressBarsInner = parameterContainer.querySelectorAll('.progress-bar');
            for (var i = 0; i < 70; i++)  {
                // Find the existing statusValue element by class name
                var statusValue = statusValues[i];

                // Update the text content of the statusValue element
                statusValue.textContent = liveParams.params[i];

                // Calculate the width for the progress bar
                var progressWidth = (liveParams.params[i] * 100) / 65535;

                // Update the width of the progress bar inner element
                var progressBarInner = progressBarsInner[i];
                progressBarInner.style.width = progressWidth + "%";
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateAFEChValues_Voltage(serverIP) {
    fetch('http://' + serverIP + ':5262/AFE_ChValuesVoltage', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                for (var i = 0; i < 16; i++)  {
                    updateVoltage(i, (byteArray[(i+(j*16))*2 + 1] | (byteArray[(i+(j*16))*2] << 8))* (190.73E-6), j);
                }
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateAnalogDieTemperature(serverIP) {
    fetch('http://' + serverIP + ':5262/AnalogDieTemperature', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                for (var i = 0; i < 1; i++)  {
                    updateAnalogDieTemperature((byteArray[(i+(j*1))*2 + 1] | (byteArray[(i+(j*1))*2] << 8))* (0.025), j);
                }
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateDigitalDieTemperature(serverIP) {
    fetch('http://' + serverIP + ':5262/DigitalDieTemperature', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                for (var i = 0; i < 1; i++)  {
                    updateDigitalDieTemperature((byteArray[(i+(j*1))*2 + 1] | (byteArray[(i+(j*1))*2] << 8))* (0.025), j);
                }
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateAFE_UnderVoltageFaultStatus(serverIP) {
    fetch('http://' + serverIP + ':5262/AFE_UnderVoltageFaultStatus', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                for (var i = 0; i < 1; i++)  {
                    AFE_UnderVoltageFaultStatus = (byteArray[(i+(j*1))*2 + 1] | (byteArray[(i+(j*1))*2] << 8));
                    // Convert uint16 value to array of individual bits
                    var faultValues = [];
                    for (var k = 0; k < 16; k++) {
                        faultValues.push((AFE_UnderVoltageFaultStatus >> k) & 1);
                    }

                    // Update LED indicators dynamically
                    for (var ledIndex = 0; ledIndex < 16; ledIndex++) {
                        var ledElement = AFE_UnderVoltageLeds[ledIndex + (j*16)]
                        if (faultValues[ledIndex] === 1) {
                            ledElement.classList.remove('led-off');
                            ledElement.classList.add('led-on');
                        } else {
                            ledElement.classList.remove('led-on');
                            ledElement.classList.add('led-off');
                        }
                    }
                }
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateAFE_OverVoltageFaultStatus(serverIP) {
    fetch('http://' + serverIP + ':5262/AFE_OverVoltageFaultStatus', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                for (var i = 0; i < 1; i++)  {
                    AFE_OverVoltageFaultStatus = (byteArray[(i+(j*1))*2+1] | (byteArray[(i+(j*1))*2] << 8));
                    // Convert uint16 value to array of individual bits
                    var faultValues = [];
                    for (var k = 0; k < 16; k++) {
                        faultValues.push((AFE_OverVoltageFaultStatus >> k) & 1);
                    }

                    // Update LED indicators dynamically
                    for (var ledIndex = 0; ledIndex < 16; ledIndex++) {
                        var ledElement = AFE_OverVoltageLeds[ledIndex + (j*16)]
                        if (faultValues[ledIndex] === 1) {
                            ledElement.classList.remove('led-off');
                            ledElement.classList.add('led-on');
                        } else {
                            ledElement.classList.remove('led-on');
                            ledElement.classList.add('led-off');
                        }
                    }
                }
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateRackAlarmStatus(serverIP) {
    fetch('http://' + serverIP + ':5262/RackAlarmStatus', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            alarmStatus = (byteArray[1] | (byteArray[0] << 8));
            // Convert uint16 value to array of individual bits
            var faultValues = [];
            for (var k = 0; k < 16; k++) {
                faultValues.push((alarmStatus >> k) & 1);
            }

            // Update LED indicators dynamically
            for (var ledIndex = 0; ledIndex < 16; ledIndex++) {
                var ledElement = Rack_AlarmLeds[ledIndex]
                if (faultValues[ledIndex] === 1) {
                    ledElement.classList.remove('led-off');
                    ledElement.classList.add('led-on');
                } else {
                    ledElement.classList.remove('led-on');
                    ledElement.classList.add('led-off');
                }
            }         
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateRackWarningStatus(serverIP) {
    fetch('http://' + serverIP + ':5262/RackWarningStatus', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            warningStatus = (byteArray[1] | (byteArray[0] << 8));
            // Convert uint16 value to array of individual bits
            var faultValues = [];
            for (var k = 0; k < 16; k++) {
                faultValues.push((warningStatus >> k) & 1);
            }

            // Update LED indicators dynamically
            for (var ledIndex = 0; ledIndex < 16; ledIndex++) {
                var ledElement = Rack_WarningLeds[ledIndex]
                if (faultValues[ledIndex] === 1) {
                    ledElement.classList.remove('led-off');
                    ledElement.classList.add('led-on');
                } else {
                    ledElement.classList.remove('led-on');
                    ledElement.classList.add('led-off');
                }
            }         
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateRackFaultStatus(serverIP) {
    fetch('http://' + serverIP + ':5262/RackFaultStatus', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            faultStatus = (byteArray[1] | (byteArray[0] << 8));
            // Convert uint16 value to array of individual bits
            var faultValues = [];
            for (var k = 0; k < 16; k++) {
                faultValues.push((faultStatus >> k) & 1);
            }

            // Update LED indicators dynamically
            for (var ledIndex = 0; ledIndex < 16; ledIndex++) {
                var ledElement = Rack_FaultLeds[ledIndex]
                if (faultValues[ledIndex] === 1) {
                    ledElement.classList.remove('led-off');
                    ledElement.classList.add('led-on');
                } else {
                    ledElement.classList.remove('led-on');
                    ledElement.classList.add('led-off');
                }
            }         
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateExtremeValues(serverIP) {
    fetch('http://' + serverIP + ':5262/BMU_ExtremeValues', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                var values = [];
                values[0] = (byteArray[(0+(j*5))*2 + 1] | (byteArray[(0+(j*5))*2] << 8))* (190.73E-6);
                values[1] = (byteArray[(1+(j*5))*2 + 1] | (byteArray[(1+(j*5))*2] << 8))* (190.73E-6);
                values[2] = (byteArray[(2+(j*5))*2 + 1] | (byteArray[(2+(j*5))*2] << 8))* (0.025);
                values[3] = (byteArray[(3+(j*5))*2 + 1] | (byteArray[(3+(j*5))*2] << 8))* (0.025);
                values[4] = (byteArray[(4+(j*5))*2 + 1] | (byteArray[(4+(j*5))*2] << 8))* (190.73E-6);
                
                updateChartValues(values, j);
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchByteArrayAndUpdateBalancingStatus(serverIP) {
    fetch('http://' + serverIP + ':5262/AFE_BalancingStatus', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get array buffer
        })
        .then(arrayBuffer => {
            const byteArray = new Uint8Array(arrayBuffer); 
            for (var j = 0; j < 24; j++) {
                var values = [];
                var balancingValue = byteArray[(0+(j*1))*2 + 1] | (byteArray[(0+(j*1))*2] << 8);
                // Iterate through each bit position from 0 to 15
                for (var i = 0; i < 16; i++)
                {
                    // Check if the bit at index 'i' is set to 1
                    if (((balancingValue >> i) & 1) == 1)
                    {
                        values[i] = 1;
                    }
                    else{
                        values[i] = 0;
                    }
                }
                // Update the data array with new values
                for (var i = 0; i < values.length; i++) {
                    balancingChart[j].data.datasets[0].data[i].y = values[i];
                }
                
                // Update the chart
                balancingChart[j].update();
            }          
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

setInterval(() => fetchByteArrayAndUpdateBalancingStatus(ServerIP), 200);
setInterval(() => fetchByteArrayAndUpdateParams(ServerIP), 300);
setInterval(() => fetchByteArrayAndUpdateAFEChValues_Voltage(ServerIP), 400);
setInterval(() => fetchByteArrayAndUpdateAnalogDieTemperature(ServerIP), 500);
setInterval(() => fetchByteArrayAndUpdateDigitalDieTemperature(ServerIP), 600);
setInterval(() => fetchByteArrayAndUpdateAFE_UnderVoltageFaultStatus(ServerIP), 700);
setInterval(() => fetchByteArrayAndUpdateAFE_OverVoltageFaultStatus(ServerIP), 800);
setInterval(() => fetchByteArrayAndUpdateRackAlarmStatus(ServerIP), 900);
setInterval(() => fetchByteArrayAndUpdateRackWarningStatus(ServerIP), 1000);
setInterval(() => fetchByteArrayAndUpdateRackFaultStatus(ServerIP), 1100);
setInterval(() => fetchByteArrayAndUpdateExtremeValues(ServerIP), 1200);