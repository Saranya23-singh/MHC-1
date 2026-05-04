// API Utils for Tranquoria SPA
window.api = {
    chat: async (message) => {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            return (await res.json()).reply;
        } catch (e) {
            console.error('Chat API error:', e);
            return `I'm listening 💚 What's on your mind?`;
        }
    },
    predictStress: async (data) => {
        try {
            const res = await fetch('/api/predict-stress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Stress API error:', e);
            return { stress_level: 'Moderate', confidence: 0.5 };
        }
    },
    saveMood: (mood) => localStorage.setItem('mood', JSON.stringify({ mood, date: new Date().toISOString() })),
