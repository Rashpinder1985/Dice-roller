let diceChart; // Declare diceChart to avoid re-declaring

// Roll dice function
function rollDice(numOfDice) {
  let results = [];
  for (let i = 0; i < numOfDice; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }
  return results;
}

// Function to display the dice faces
function displayDiceFaces(results) {
  const diceContainer = document.getElementById('dice-faces');
  diceContainer.innerHTML = ''; // Clear previous dice faces

  results.forEach(result => {
    const diceFace = document.createElement('div');
    diceFace.classList.add('dice-face', `dice-${result}`);
    diceFace.textContent = result; // Show the number on the dice face
    diceContainer.appendChild(diceFace);
  });
}

// Function to generate the frequency distribution of sums
function generateDistribution(rollResults, numOfDice) {
  const maxSum = numOfDice * 6; // Max possible sum
  const minSum = numOfDice; // Min possible sum
  const distribution = new Array(maxSum - minSum + 1).fill(0);

  // Count the occurrences of each sum
  rollResults.forEach(result => {
    distribution[result - minSum]++;
  });

  return distribution;
}

// Function to update or create the chart
function updateChart(rollResults, numOfDice) {
  const distribution = generateDistribution(rollResults, numOfDice);
  const ctx = document.getElementById('dice-chart').getContext('2d');

  // Calculate average of sums
  const average = rollResults.reduce((sum, value) => sum + value, 0) / rollResults.length;

  // If chart already exists, destroy it to avoid overlap
  if (diceChart) {
    diceChart.destroy();
  }

  // Create new chart with updated data
  diceChart = new Chart(ctx, {
    type: 'bar', // Use bar chart to visualize the distribution
    data: {
      labels: Array.from({ length: distribution.length }, (_, i) => i + numOfDice),
      datasets: [{
        label: 'Dice Rolls Distribution',
        data: distribution,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequency'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Sum of Dice'
          }
        }
      },
      plugins: {
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              borderColor: 'red',
              borderWidth: 2,
              label: {
                content: `Average: ${average.toFixed(2)}`,
                enabled: true,
                position: 'top'
              },
              scaleID: 'x',
              value: average
            }
          }
        }
      }
    }
  });
}

// Function to calculate and display sum of results
function displaySum(rollResults) {
  const sum = rollResults.reduce((acc, curr) => acc + curr, 0);
  document.getElementById('total-sum').textContent = `Total Sum: ${sum}`;
}

// Event listener for single roll
document.getElementById('roll-button').addEventListener('click', function() {
  const diceCount = parseInt(document.getElementById('dice-count').value);
  const results = rollDice(diceCount);
  document.getElementById('result').textContent = `Rolled ${diceCount} dice: ${results.join(', ')}`;

  // Display dice faces and sum
  displayDiceFaces(results);
  displaySum(results);
});

// Event listener for rolling multiple times
document.getElementById('multi-roll-button').addEventListener('click', function() {
  const diceCount = parseInt(document.getElementById('dice-count').value);
  const rollTimes = parseInt(document.getElementById('roll-times-input').value);
  
  if (rollTimes > 10000000) {
    alert('Maximum roll count is 10M!');
    return;
  }
  
  let rollResults = [];
  let totalSum = 0;

  // Roll dice N times and collect all sums
  for (let i = 0; i < rollTimes; i++) {
    const singleRoll = rollDice(diceCount);
    rollResults.push(singleRoll.reduce((acc, curr) => acc + curr, 0)); // Store sum of each roll
    totalSum += singleRoll.reduce((acc, curr) => acc + curr, 0); // Add the sum for each roll
  }
  
  document.getElementById('result').textContent = `Rolled ${diceCount} dice ${rollTimes} times.`;
  localStorage.setItem('diceResults', JSON.stringify(rollResults));

  // Update chart with the new results
  updateChart(rollResults, diceCount);

  // Display the total sum of all rolls
  document.getElementById('total-sum').textContent = `Total Sum of all rolls: ${totalSum}`;
});

// Event listener for displaying chart
document.getElementById('show-chart').addEventListener('click', function() {
  const diceResults = JSON.parse(localStorage.getItem('diceResults')) || [];
  
  // Display chart only if there are results
  if (diceResults.length > 0) {
    document.getElementById('dice-chart').style.display = 'block';
    updateChart(diceResults, document.getElementById('dice-count').value);
  } else {
    alert('No dice rolls available to display the chart.');
  }
});

// Event listener for the "Get Sum" button
document.getElementById('get-sum-button').addEventListener('click', function() {
  const diceResults = JSON.parse(localStorage.getItem('diceResults')) || [];
  
  // Calculate and display the total sum of all rolls stored
  displaySum(diceResults);
});


