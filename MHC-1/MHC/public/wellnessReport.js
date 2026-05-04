// Professional Wellness Report - Complete Rebuild
// Fixed calculations, charts, gauge, fallbacks - Medical Dashboard

let sleepChart, heartChart, trendsChart;

document.addEventListener('DOMContentLoaded', async () => {
    await generateReport();
});

async function generateReport() {
    const sleepData = JSON.parse(localStorage.getItem('sleepData') || '[]');

    const heartData = JSON.parse(localStorage.getItem('heartRateData') || '[]');
    const assessment = JSON.parse(localStorage.getItem('lastAssessment') || null);

    // Header
    document.getElementById('reportDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Analysis
    const sleepStats = analyzeSleep(sleepData);
    const heartStats = analyzeHeartRate(heartData);
    const anxietyStats = analyzeAnxiety(assessment);
    // AI ML Stress Prediction
    let stressStats = { score: 50, status: 'moderate' };
    try {
        const response = await fetch('/api/predict-stress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                avgSleep: parseFloat(sleepStats.avg) || 7,
                avgHR: parseInt(heartStats.avg) || 75,
                anxietyScore: parseInt(anxietyStats.avg) || 10
            })
        });
        const aiData = await response.json();
        stressStats = {
            score: parseInt(aiData.stress_level) || 50,
            status: aiData.risk.toLowerCase(),
            aiData
        };
        // Add AI badge
        document.querySelector('.stress-gauge h3').innerHTML += ' <span class="ai-badge">🤖 ML-Powered</span>';
    } catch (error) {
        console.log('ML unavailable, using rule-based');
        const sleepDeficit = Math.max(0, 8 - parseFloat(sleepStats.avg || 0)) * 3;
        const heartExcess = Math.max(0, (parseInt(heartStats.avg || 0) - 70)) * 0.2;
        const anxiety = parseInt(anxietyStats.avg || 0) * 4;
        stressStats.score = Math.round(Math.max(0, Math.min(100, sleepDeficit + heartExcess + anxiety)));
        stressStats.status = stressStats.score > 60 ? 'high' : stressStats.score > 30 ? 'moderate' : 'low';
    }

    const wellnessScore = Math.max(0, Math.min(100, 100 - stressStats.score));

    // Update UI
    document.getElementById('wellnessScore').textContent = `${wellnessScore.toFixed(0)}%`;
    const statusType = getStatusLevel(wellnessScore);
    document.getElementById('overallStatus').textContent = getStatusText(wellnessScore);
    document.getElementById('overallStatus').className = `status-badge status-${statusType}`;

    // Metrics
    updateMetricCard('sleep', sleepStats);
    updateMetricCard('heart', heartStats);
    updateMetricCard('anxiety', anxietyStats);

    // Stress Gauge
    updateStressGauge(stressStats.score, stressStats.status);

    // Charts
    createSleepChart(sleepData);
    createHeartChart(heartData);
    createTrendsChart(sleepData, heartData, assessment);

    // Recommendations
    generateRecommendations(sleepStats, heartStats, anxietyStats, stressStats);
}

function analyzeSleep(data) {
    if (data.length === 0) return getNoDataStats('sleep');

    const durations = data.map(d => parseFloat(d.duration)).filter(isFinite);
    if (durations.length === 0) return getNoDataStats('sleep');

    const avg = durations.reduce((sum, val) => sum + val, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    let status = 'moderate', message = `Avg: ${avg.toFixed(1)} hrs (7-9 recommended)`;
    if (avg >= 7 && avg <= 9) status = 'good';
    else if (avg < 6) status = 'poor';

    return {
        avg: avg.toFixed(1), min: min.toFixed(1), max: max.toFixed(1),
        status, message,
        score: Math.max(0, Math.min(100, (avg / 8) * 100))
    };
}

function analyzeHeartRate(data) {
    if (data.length === 0) return getNoDataStats('heart');

    const rates = data.map(d => parseInt(d.heartRate)).filter(isFinite);
    if (rates.length === 0) return getNoDataStats('heart');

    const avg = rates.reduce((sum, val) => sum + val, 0) / rates.length;
    const min = Math.min(...rates);
    const max = Math.max(...rates);

    let status = 'normal', message = `Avg: ${Math.round(avg)} bpm (60-100 normal)`;
    if (avg < 60) status = 'low';
    else if (avg > 100) status = 'elevated';

    return {
        avg: Math.round(avg), min: Math.round(min), max: Math.round(max),
        status, message,
        score: Math.max(0, Math.min(100, 100 - Math.abs(avg - 80)))
    };
}

function analyzeAnxiety(assessment) {
    if (!assessment || !assessment.score) return getNoDataStats('anxiety');

    const score = assessment.score;
    let status = 'moderate', message = `Score: ${score}/21 (${assessment.category || 'Moderate'})`;
    if (score <= 4) status = 'good';
    else if (score > 14) status = 'poor';

    return {
        avg: score, min: '-', max: '/21',
        status, message,
        score: Math.max(0, (21 - score) / 21 * 100)
    };
}

function getNoDataStats(type) {
    const messages = {
        sleep: 'No sleep data. Track your sleep patterns.',
        heart: 'No heart rate data. Monitor your pulse.',
        anxiety: 'Complete anxiety assessment.'
    };
    return { avg: 'No Data', min: '-', max: '-', status: 'no-data', message: messages[type], score: 0 };
}

function calculateStressScore(avgSleep, avgHeart, anxietyScore) {
    const sleepDeficit = Math.max(0, 8 - parseFloat(avgSleep || 0)) * 3;
    const heartExcess = Math.max(0, (parseInt(avgHeart || 0) - 70)) * 0.2;
    const anxiety = parseInt(anxietyScore || 0) * 4;

    const rawScore = sleepDeficit + heartExcess + anxiety;
    const score = Math.max(0, Math.min(100, rawScore));

    let status = 'low';
    if (score > 60) status = 'high';
    else if (score > 30) status = 'moderate';

    return { score: Math.round(score), status, raw: rawScore };
}

function getStatusLevel(score) {
    if (score >= 80) return 'good';
    if (score >= 60) return 'moderate';
    return 'poor';
}

function getStatusText(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Moderate Stress';
    return 'High Stress - Action Needed';
}

function updateMetricCard(type, stats) {
    const card = document.getElementById(`${type}-card`);
    const avgEl = card.querySelector('.metric-value');
    const rangeEl = card.querySelector('.metric-range');
    const descEl = card.querySelector('.metric-desc');
    const statusEl = card.querySelector('.metric-status');

    avgEl.textContent = stats.avg;
    rangeEl.textContent = stats.status === 'no-data' ? '' : `${stats.min} - ${stats.max}`;
    descEl.textContent = stats.message;

    statusEl.className = `metric-status ${stats.status}`;
    statusEl.innerHTML = stats.status === 'no-data' ?
        '<i class="fas fa-question-circle"></i>' :
        `<i class="fas fa-${stats.status === 'good' ? 'check-circle' : stats.status === 'poor' ? 'exclamation-triangle' : 'info-circle'}"></i>`;

    if (stats.status !== 'no-data') {
        card.classList.add(stats.status);
    }
}

function updateStressGauge(score, status) {
    const fill = document.getElementById('gaugeFill');
    const scoreEl = document.getElementById('stressScore');
    const labelEl = document.getElementById('stressLabel');
    const msgEl = document.getElementById('stressMessage');

    const maxDash = 400;
    const dashOffset = maxDash - (score / 100) * maxDash;
    fill.style.strokeDashoffset = dashOffset;

    scoreEl.textContent = score;
    labelEl.textContent = status.toUpperCase();
    labelEl.className = `stress-label ${status}`;

    msgEl.textContent = `Your stress level is ${status}. ${getStressAdvice(status)}`;
}

function getStressAdvice(status) {
    const advice = {
        low: 'Continue current wellness practices.',
        moderate: 'Consider breathing exercises and better sleep.',
        high: 'Prioritize relaxation techniques and professional support.'
    };
    return advice[status] || '';
}

function createSleepChart(data) {
    const ctx = document.getElementById('sleepTrendChart').getContext('2d');
    const recent = getRecentData(data, 7, 'sleepTime');

    sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: recent.labels,
            datasets: [{
                label: 'Sleep Hours',
                data: recent.values,
                backgroundColor: recent.values.map(v => v >= 7 ? '#7BAE7F60' : v >= 6 ? '#F47C3C60' : '#FF6B6B60'),
                borderColor: recent.values.map(v => v >= 7 ? '#7BAE7F' : v >= 6 ? '#F47C3C' : '#FF6B6B'),
                borderRadius: 8,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 12, title: { display: true, text: 'Hours' } }
            }
        }
    });
}

function createHeartChart(data) {
    const ctx = document.getElementById('heartTrendChart').getContext('2d');
    const recent = getRecentData(data, 14, 'timestamp');

    heartChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: recent.labels,
            datasets: [{
                label: 'Heart Rate',
                data: recent.values,
                borderColor: '#F47C3C',
                backgroundColor: 'rgba(244,124,60,0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 50, max: 160, title: { display: true, text: 'BPM' } }
            }
        }
    });
}

function createTrendsChart(sleepData, heartData, assessment) {
    const ctx = document.getElementById('weeklyTrendsChart').getContext('2d');
    const days = 7;
    const labels = [];
    const sleepTrend = [];
    const heartTrend = [];
    const anxietyTrend = [];

    for (let i = days - 1; i >= 0; i--) {
        const dateStr = new Date(Date.now() - i * 86400000).toDateString();
        labels.push(new Date(Date.now() - i * 86400000).toLocaleDateString());

        const daySleep = sleepData.filter(d => new Date(d.sleepTime).toDateString() === dateStr);
        sleepTrend.push(daySleep.length ? daySleep[0].duration : null);

        const dayHeart = heartData.filter(d => new Date(d.timestamp).toDateString() === dateStr);
        heartTrend.push(dayHeart.length ? dayHeart.reduce((sum, h) => sum + h.heartRate, 0) / dayHeart.length : null);

        anxietyTrend.push(null); // Single assessment, spread across week
    }

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Sleep (hrs)',
                data: sleepTrend,
                borderColor: '#7BAE7F',
                backgroundColor: 'rgba(123,174,127,0.1)',
                yAxisID: 'y1',
                tension: 0.4,
                fill: false
            }, {
                label: 'Heart Rate',
                data: heartTrend,
                borderColor: '#F47C3C',
                backgroundColor: 'rgba(244,124,60,0.1)',
                yAxisID: 'y2',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y1: { type: 'linear', display: true, position: 'left', min: 0, max: 12 },
                y2: { type: 'linear', display: true, position: 'right', min: 50, max: 150, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function getRecentData(data, count, dateField) {
    const sorted = data.slice().sort((a, b) => new Date(b[dateField]) - new Date(a[dateField]));
    const recent = sorted.slice(0, count);

    const labels = recent.map(d => new Date(d[dateField]).toLocaleDateString()).reverse();
    const values = recent.map(d => parseFloat(d.duration || d.heartRate)).reverse();

    return { labels, values };
}

function generateRecommendations(sleep, heart, anxiety, stress) {
    const container = document.getElementById('recommendations');
    let recs = [];

    if (parseFloat(sleep.avg) < 6 || sleep.status === 'poor') {
        recs.push({
            title: 'Sleep Improvement',
            advice: ['Consistent bedtime routine', 'No screens 1hr before bed', '4-7-8 breathing before sleep'],
            icon: 'fa-moon'
        });
    }

    if (parseInt(heart.avg) > 90 || heart.status === 'elevated') {
        recs.push({
            title: 'Heart Rate Management',
            advice: ['Daily 20min walk', 'Reduce caffeine', 'Breathing exercises'],
            icon: 'fa-heartbeat'
        });
    }

    if (anxiety.avg > 10) {
        recs.push({
            title: 'Anxiety Reduction',
            advice: ['Grounding technique (5-4-3-2-1)', 'Journal daily reflections', 'Peer support chat'],
            icon: 'fa-brain'
        });
    }

    if (stress.score > 40) {
        recs.push({
            title: 'Stress Relief',
            advice: ['Autogenic training: "My arms heavy"', 'Progressive muscle relaxation', 'Nature sounds meditation'],
            icon: 'fa-spa'
        });
    }

    if (recs.length === 0) {
        container.innerHTML = '<div class="rec-placeholder">Excellent wellness metrics! Keep up the great work 🌿</div>';
        return;
    }

    container.innerHTML = recs.map(rec => `
        <div class="rec-card">
            <h4><i class="fas ${rec.icon}"></i> ${rec.title}</h4>
            <ul>${rec.advice.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFontSize(24);
    doc.setTextColor(47, 62, 70);
    doc.text('Wellness Medical Report', 20, 30);

    doc.setFontSize(12);
    doc.text(`Date: ${document.getElementById('reportDate').textContent}`, 20, 50);
    doc.text(`Wellness Score: ${document.getElementById('wellnessScore').textContent}`, 20, 60);
    doc.text(`Stress Level: ${document.getElementById('stressScore').textContent} - ${document.getElementById('stressLabel').textContent}`, 20, 70);

    doc.text('Health Metrics:', 20, 90);
    doc.setFontSize(11);
    doc.text(`Sleep: ${document.querySelector('#sleepAvg .main-value')?.textContent || 'N/A'} hours avg`, 25, 100);
    doc.text(`Heart Rate: ${document.querySelector('#heartAvg .main-value')?.textContent || 'N/A'} bpm avg`, 25, 110);

    doc.save('Tranquoria-Wellness-Report.pdf');
}

// Utility
function isFinite(n) { return !isNaN(n) && isFinite(n); }

