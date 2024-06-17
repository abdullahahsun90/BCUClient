var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');

var ctx = document.getElementById("myChart").getContext('2d');

// Sample data (replace with your actual data points)
var data = []; // Empty array to store data objects

// Loop to generate data points (replace with your data source)
for (var i = 0; i < 1000; i++) { // Adjust loop iterations as needed
  var timestamp = 1710538358 + i; // Generate timestamps starting from 1710538358
  var dataValue = Math.floor(Math.random() * 100); // Generate random data between 0 and 99

  data.push({
    x: timestamp,
    y: dataValue
  });
}

var config = {
  type: 'line',
  data: {
    datasets: [{
      label: id,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: data
    }],
    labels: data.map(function(item) {
        // Convert timestamp to a user-friendly format (optional)
        var date = new Date(item.x * 1000);
        return (date.toLocaleDateString() + " " + date.toLocaleTimeString()); // Adjust format as needed
      })
  },
  options: {
    plugins: {
        zoom: {
            // pan: {
            //     enabled: true,
            //     mode: 'xy'
            //   },
          zoom: {
            wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              drag: {
                enabled: true
              },
            mode: 'x',
          }
        }
      },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'second',  
          stepSize: 1,
        }
      }],
      yAxes: [{
        // Add y-axis specific options if needed
      }]
    }
  }
};

var myChart = new Chart(ctx, config);

document.getElementById('resetZoomBtn').addEventListener('click', function() {
  myChart.resetZoom(); // Reset zoom
});