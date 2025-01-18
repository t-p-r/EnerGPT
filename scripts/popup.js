document.addEventListener('DOMContentLoaded', () => {
    const counterDisplay = document.getElementById('counter');
    const incrementButton = document.getElementById('increment');
    const resetButton = document.getElementById('reset');

    // Initialize counter value
    let counter = 0;

    // Update the counter display
    function updateDisplay() {
        counterDisplay.textContent = counter;
    }

    // Event listeners
    incrementButton.addEventListener('click', () => {
        counter++;
        updateDisplay();
    });

    resetButton.addEventListener('click', () => {
        counter = 0;
        updateDisplay();
    });

    // Set initial display
    updateDisplay();

    
});
