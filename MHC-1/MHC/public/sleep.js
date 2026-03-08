document.getElementById('sleepForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const sleepStart = document.getElementById('sleepStart').value;
    const sleepEnd = document.getElementById('sleepEnd').value;
    const points = parseInt(document.getElementById('points').value);

    // Calculate sleep duration
    const startTime = new Date(`2000-01-01T${sleepStart}`);
    const endTime = new Date(`2000-01-01T${sleepEnd}`);
    let sleepDuration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours

    // Classify sleep quality
    let classification = '';
    if (points >= 8 && sleepDuration >= 7) {
        classification = 'Good Sleep';
    } else if (points >= 6 && sleepDuration >= 5) {
        classification = 'Average Sleep';
    } else {
        classification = 'Bad Sleep';
    }

    // Generate recommendations
    let recommendations = '';
    switch(classification) {
        case 'Good Sleep':
            recommendations = 'Keep up the good sleep habits!';
            break;
        case 'Average Sleep':
            recommendations = 'Try to improve sleep consistency and duration.';
            break;
        case 'Bad Sleep':
            recommendations = 'Consider adjusting your sleep schedule and environment.';
            break;
    }

    // Display result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `<p>Your sleep is classified as: <strong>${classification}</strong></p><p>Recommendations: ${recommendations}</p>`;
});
