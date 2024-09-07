// Roll dice function
function rollDice(numOfDice) {
  let results = [];
  for (let i = 0; i < numOfDice; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }
  return results;
}

// Event listener for single roll
document.getElementById('roll-button').addEventListener('click', function() {
  const diceCount = document.getElementById('dice-count').value;
  const results = rollDice(diceCount);
  document.getElementById('result').textContent = `Rolled ${diceCount} dice: ${results.join(', ')}`;
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
  for (let i = 0; i < rollTimes; i++) {
    rollResults.push(...rollDice(diceCount));
  }
  
  document.getElementById('result').textContent = `Rolled ${diceCount} dice ${rollTimes} times.`;
  localStorage.setItem('diceResults', JSON.stringify(rollResults));
});

// Event listener for displaying chart
document.getElementById('show-chart').addEventListener('click', function() {
  const diceResults = JSON.parse(localStorage.getItem('diceResults')) || [];
  
  const chartData = new Array(6).fill(0);
  diceResults.forEach(result => {
    chartData[result - 1]++;
  });

  document.getElementById('dice-chart').style.display = 'block';

  const ctx = document.getElementById('dice-chart').getContext('2d');
  
  // If a chart already exists, destroy it to avoid overlapping
  if (window.diceChart) {
    window.diceChart.destroy();
  }

  window.diceChart = new Chart(ctx, {
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
      responsive: true,  // Ensure the chart is responsive
      maintainAspectRatio: false, // Allow chart height to adjust
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
