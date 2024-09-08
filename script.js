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

// Function to update or create the chart
function updateChart(rollResults) {
  const chartData = new Array(6).fill(0); // Initialize array for dice outcomes 1-6

  // Count the occurrences of each dice face in rollResults
  rollResults.forEach(result => {
    chartData[result - 1]++;
  });

  const ctx = document.getElementById('dice-chart').getContext('2d');

  // If chart already exists, destroy it to avoid overlap
  if (diceChart) {
    diceChart.destroy();
  }

  // Create new chart with updated data
  diceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [{
        label: 'Dice Rolls Distribution',
        data: chartData,
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FF9933', '#99FF33'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
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
  const diceCount = document.getElementById('dice-count').value;
  const results = rollDice(diceCount);
  document.getElementById('result').textContent = `Rolled ${diceCount} dice: ${results.join(', ')}`;

  // Display dice faces and sum
  displayDiceFaces(results);
  displaySum(results);
});

// Event listener for rolling multiple times
document.getElementById('multi-roll-button').addEventListener('click', function() {
  const diceCount = document.getElementById('dice-count').value;
  const rollTimes = document.getElementById('roll-times-input').value;
  
  if (rollTimes > 10000000) {
    alert('Maximum roll count is 10M!');
    return;
  }
  
  let rollResults = [];
  let totalSum = 0;

  // Roll dice N times and collect all results
  for (let i = 0; i < rollTimes; i++) {
    const singleRoll = rollDice(diceCount);
    rollResults.push(...singleRoll);
    totalSum += singleRoll.reduce((acc, curr) => acc + curr, 0); // Add the sum for each roll
  }
  
  document.getElementById('result').textContent = `Rolled ${diceCount} dice ${rollTimes} times.`;
  localStorage.setItem('diceResults', JSON.stringify(rollResults));

  // Update chart with the new results
  updateChart(rollResults);

  // Display the total sum of all rolls
  document.getElementById('total-sum').textContent = `Total Sum of all rolls: ${totalSum}`;
});

// Event listener for displaying chart
document.getElementById('show-chart').addEventListener('click', function() {
  const diceResults = JSON.parse(localStorage.getItem('diceResults')) || [];
  
  // Display chart only if there are results
  if (diceResults.length > 0) {
    document.getElementById('dice-chart').style.display = 'block';
    updateChart(diceResults);
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

