
   // Array of parameter names
    var configurationParametersInfo = [
        [ "OV: Over Voltage" , 1.0],
        ["OV Critical: Over Voltage Critical" , 1.0],
        ["UV: Under Voltage" , 1.0],
        ["UV Critical: Under Voltage Critical" , 1.0],
        ["OT: Over Temperature" , 1.0],
        ["UT: Under Temperature" , 1.0],
        ["Fan 1 Speed" , 1.0],
        ["Fan 2 Speed" , 1.0],
        ["Fan 1 Start Temperature" , 1.0],
        ["Fan 2 Start Temperature" , 1.0],
        ["Fan 1 Start Speed" , 1.0],
        ["Fan 1 Max Speed" , 1.0],
        ["Fan 2 Start Speed" , 1.0],
        ["Fan 2 Max Speed" , 1.0],
        ["OCD: Over Current in Discharging" , 1.0],
        ["OCD Delay: Over Current in Discharging Delay" , 1.0],
        ["OCDC: Over Current in Discharging Continuous" , 1.0],
        ["OCDC Delay: Over Current in Discharging Continuous Delay" , 1.0],
        ["OCC: Over Current in Charging" , 1.0],
        ["UART Baudrate" , 1.0],
        ["Battery Cycle Count" , 1.0],
        ["State of Health (SOH)" , 1.0],
        ["Battery ID (Bat ID)" , 1.0],
        ["Cell Balancing" , 1.0],
        ["OCD Fault Count: Over Current in Discharging Fault Count" , 1.0],
        ["OCDC Fault Count: Over Current in Discharging Continuous Fault Count" , 1.0],
        ["OV Fault Count: Over Voltage Fault Count" , 1.0],
        ["OV Critical Fault Count: Over Voltage Critical Fault Count" , 1.0],
        ["UV Fault Count: Under Voltage Fault Count" , 1.0],
        ["UV Critical Fault Count: Under Voltage Critical Fault Count" , 1.0],
        ["OT Fault Count: Over Temperature Fault Count" , 1.0],
        ["UT Fault Count: Under Temperature Fault Count" , 1.0],
        ["OCC Fault Count: Over Current in Charging Fault Count" , 1.0],
        ["Isolation Fault Count" , 1.0],
        ];

        // Function to create form fields dynamically
        function createFormFields() {
        var formFields = document.getElementById("formFields");
        configurationParametersInfo.forEach(function(parameterName) {
            var formGroup = document.createElement("div");
            formGroup.classList.add("col-md-4", "mb-2"); // Each parameter fills 1/3 of the width on medium screens

            var label = document.createElement("label");
            label.textContent = parameterName[0];
            label.setAttribute("for", parameterName[0].toLowerCase().replace(/\s/g, '_'));

            var input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("step", "0.001"); 
            input.classList.add("form-control");
            input.setAttribute("id", parameterName[0].toLowerCase().replace(/\s/g, '_'));
            input.setAttribute("name", parameterName[0].toLowerCase().replace(/\s/g, '_'));

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            formFields.appendChild(formGroup);
        });
        }

        // Call the function to create form fields
        createFormFields();

        // Form submission event listener
        document.getElementById("parameterForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission

        // Check if any field is empty
        var inputs = document.querySelectorAll("#parameterForm input[type='number']");
        var isEmpty = Array.from(inputs).some(function(input) {
            return input.value.trim() === "";
        });

        // Show alert if any field is empty
        if (isEmpty) {
            alert("Please fill in all parameters.");
        } else {
            setConfigurationParameters();
            // You can perform further actions here
        }
    });

  // Get form elements
  const lengthField = document.getElementById("length");
  const unitIdentifierField = document.getElementById("unitIdentifier");
  const functionCodeField = document.getElementById("functionCode");
  const dataField = document.getElementById("data");
  const sendButton = document.getElementById("sendButton");

  // Initialize transaction identifier
  let transactionId = 0;

  // Event listener for Send button
  sendButton.addEventListener("click", function(event) {
    event.preventDefault();
    
    // Validate form fields before submission
    const lengthValue = parseInt(lengthField.value);
    if (lengthValue < 9 && lengthValue > 18) {
      alert("Length must be greater than 8 and less than 19.");
      return;
    }

    // Validate form fields before submission
    if (!validateFields()) {
        alert("Please fill in all required fields.");
        return;
    }

    // Perform form submission
    // Increment transaction identifier and reset to 0 if it reaches maximum value
    transactionId = (transactionId + 1) % 255;

    // Update Transaction Identifier field in request form
    document.getElementById("transactionId").value = transactionId;

    sendModbusTCPRequestToServer();
  });

  // Event listener for Length field in request form
  lengthField.addEventListener("change", function() {
    const lengthValue = parseInt(lengthField.value);

    // Check if Length is greater than or equal to 8
    if (lengthValue < 9) {
      alert("Length must be greater than 8.");
      lengthField.value = 9;
    }
    else if (lengthValue > 18)
    {
      alert("Length must be less than 19.")
      lengthField.value = 18;
    }

    // Update maximum length of Data field based on Length value
    dataField.maxLength = (lengthValue - 8) * 2;

    dataField.value = "";
  });

  // Event listener for Data field in request form
  dataField.addEventListener("input", function() {
    // Validate input to allow only hexadecimal characters
    const regex = /^[0-9A-Fa-f]*$/;
    if (!regex.test(dataField.value)) {
      dataField.value = dataField.value.replace(/[^0-9A-Fa-f]/g, '');
    }
  });

  // Regular expression for validating Unit Identifier (hexadecimal)
  const unitIdentifierRegex = /^[0-9A-Fa-f]{2}$/;

  // Event listener for Unit Identifier field in request form
  unitIdentifierField.addEventListener("input", function() {
    // Validate input against the regular expression
    if (!unitIdentifierRegex.test(unitIdentifierField.value)) {
      unitIdentifierField.value = unitIdentifierField.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 2);
    }
  });

  // Regular expression for validating Function Code (hexadecimal)
  const functionCodeRegex = /^[0-9A-Fa-f]{2}$/;

  // Event listener for Function Code field in request form
  functionCodeField.addEventListener("input", function() {
    // Validate input against the regular expression
    if (!functionCodeRegex.test(functionCodeField.value)) {
      functionCodeField.value = functionCodeField.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 2);
    }
  });

// Function to validate form fields
function validateFields() {
    if (lengthField.value === "" || unitIdentifierField.value === "" || functionCodeField.value === "" || dataField.value === "") {
        return false;
    }
    return true;
}

function getConfigurationParameters() {
  fetch('http://' + ServerIP + ':5262/ConfigurationParameters', { method: 'GET' })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.arrayBuffer(); // Get array buffer
  })
  .then(arrayBuffer => {
      const byteArray = new Uint8Array(arrayBuffer); 
      for (var j = 0; j < configurationParametersInfo.length; j++) {
          //var values = [];
          var scaledValue = (byteArray[(j*4)+3] | (byteArray[(j*4)+ 2] << 8) | (byteArray[(j*4)+ 1] << 16) | (byteArray[(j*4)] << 24)) * configurationParametersInfo[j][1];
          
          var parameter = document.getElementById(configurationParametersInfo[j][0].toLowerCase().replace(/\s/g, '_'));
          parameter.value = scaledValue;

          //updateChartValues(values, j);
      }          
  })
  .catch(error => {
      alert('There was a problem with the fetch operation:', error);
  });
}

function setConfigurationParameters() {
    var byteArray = new Uint8Array((configurationParametersInfo.length * 4) + 1);
    byteArray[0] = 0; // dummy write, server will fill opcode for STM32
    for(var j = 0; j < configurationParametersInfo.length; j++)
    { 
      var parameter = document.getElementById(configurationParametersInfo[j][0].toLowerCase().replace(/\s/g, '_'));
      var scaledValue = parameter.value; 
      var rawValue = scaledValue / configurationParametersInfo[j][1];
      byteArray[(j*4) + 4] = (rawValue & 0x000000ff);
      byteArray[(j*4) + 3] = (rawValue & 0x0000ff00) >> 8;
      byteArray[(j*4) + 2] = (rawValue & 0x00ff0000) >> 16;
      byteArray[(j*4) + 1] = (rawValue & 0xff000000) >> 24;
    }
   
// Make a POST request to the server
fetch('http://' + ServerIP + ':5262/ConfigurationParameters', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream'
  },
  body: byteArray
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  alert('Parameters saved by server');
})
.catch(error => {
  alert('An error occured. Error:' + error);
});
    
}

function sendModbusTCPRequestToServer()
{
  //Data
  var dataBytes = document.getElementById("data").value;
  
  var dataBytesArraySize = Math.ceil(dataBytes.length / 2);
  var dataByteArray = new Uint8Array(dataBytesArraySize);
  document.getElementById("length").value = 8 + dataBytesArraySize;

  for(i = 0, j=0; j < dataBytes.length; i++, j+=2)
  {
     var valueToSerialize = parseInt(dataBytes[j] + dataBytes[j+1], 16);
     dataByteArray[i] = valueToSerialize;
  }

  //Transaction ID
  var transactionIdByteArray = getByteArrayFromDocumentId("transactionId", 2, false);
  //Protocol ID
   var protocolIdByteArray = getByteArrayFromDocumentId("protocolId", 2, false);
  //Length
  var lengthByteArray = getByteArrayFromDocumentId("length", 2, false);

  //Unit Identifier
  var unitIdentifierByteArray = getByteArrayFromDocumentId("unitIdentifier", 1, true);

  //Function Code
  var functionCodeByteArray = getByteArrayFromDocumentId("functionCode",1, true);

  //CRC
  let crcLength = 2;

  //Packet
  let totalLength = transactionIdByteArray.length + protocolIdByteArray.length + lengthByteArray.length + unitIdentifierByteArray.length + functionCodeByteArray.length + dataByteArray.length + crcLength;
  let packet = new Uint8Array(totalLength);
  let index = 0;
  packet.set(transactionIdByteArray, index);
  index += transactionIdByteArray.length;
  packet.set(protocolIdByteArray, index);
  index += protocolIdByteArray.length;
  packet.set(lengthByteArray, index);
  index += lengthByteArray.length;
  packet.set(unitIdentifierByteArray, index);
  index += unitIdentifierByteArray.length;
  packet.set(functionCodeByteArray, index);
  index += functionCodeByteArray.length;
  packet.set(dataByteArray, index); 
  index += dataByteArray.length;
  let modbusCRC = computeModBusRTU_CRC(packet, packet.length - crcLength);
  var modbusCRCByteArray = new Uint8Array(2);
  modbusCRCByteArray[0] = (modbusCRC >> 8) & 0xFF;
  modbusCRCByteArray[1] = modbusCRC & 0xFF;
  packet.set(modbusCRCByteArray, index);

  // Make a POST request to the server
fetch('http://' + ServerIP + ':5262/ModbusTCP', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream'
  },
  body: packet
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
    return response.arrayBuffer();
})
.then(data => {
  if(data.byteLength > 0) //Validating if server has returned bytes after reading
    {
      var modbusTCPResponseBytes = new Uint8Array(data);
      updateModbusTCPResponse(modbusTCPResponseBytes);
      alert('Server has responded to read command!')
    }
  else
  {
    alert('Server has forwarded write command!');
  }
})
.catch(error => {
  alert('An error occured. Error:' + error);
});
}

function computeModBusRTU_CRC(buf, len) {
  let crc = 0xFFFF;

  for (let pos = 0; pos < len; pos++) {
    crc ^= buf[pos];

    for (let i = 8; i !== 0; i--) {
      if ((crc & 0x0001) !== 0) {
        crc >>= 1;
        crc ^= 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }

  return crc;
}

function getByteArrayFromDocumentId(documentId, byteArraySize, isHexadecimal)
{
  const maxByteArraySize = 4;

if(byteArray > maxByteArraySize)
{
  throw "byteArraySize must be less than or equal to " + maxByteArraySize;
}

  var byteArray = new Uint8Array(byteArraySize);
  
  var valueToSerialize = document.getElementById(documentId).value;

  if(isHexadecimal)
  {
    valueToSerialize = parseInt(valueToSerialize, 16); 
  }

  if(byteArray.length == 2) // only valid for maximum 2 bytes
  {
    byteArray[0] = (valueToSerialize >> 8) & 0xFF;
    byteArray[1] = valueToSerialize & 0xFF;
  }
  else{
    byteArray[0] = valueToSerialize & 0xFF;
  }

  return byteArray;
}

function updateModbusTCPResponse(byteArray)
{
  var responseTransId = document.getElementById("responseTransactionId");
  responseTransId.value = (byteArray[1] | (byteArray[0] << 8)).toString();

  var responseProtocolId = document.getElementById("responseProtocolId");
  responseProtocolId.value = (byteArray[3] | (byteArray[2] << 8)).toString();

  var responseLength = document.getElementById("responseLength");
  responseLength.value = (byteArray[5] | (byteArray[4] << 8)).toString();

  var responseUnitId = document.getElementById("responseUnitId");
  responseUnitId.value = byteArray[6].toString(16).padStart(2, '0');;

  var responseFunctionCodeField = document.getElementById("responseFunctionCode");
  responseFunctionCodeField.value = byteArray[7].toString(16).padStart(2, '0');;

  var responseDataField = document.getElementById("responseData");
  responseDataField.value = "";
  for(i=8; i< responseLength.value; i++)
  {
    responseDataField.value += byteArray[i].toString(16).padStart(2, '0');;
  }
  
}

