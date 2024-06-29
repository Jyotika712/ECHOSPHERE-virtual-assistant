const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

const apiKey = 'YOUR_API_KEY_HERE';  // Replace with your OpenAI API key

async function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Boss...");
    } else {
        speak("Good Evening Boss...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing ECHOSPHERE...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = async (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    console.log(`User said: ${transcript}`);
    await takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

async function takeCommand(message) {
    try {
        const gptResponse = await getGptResponse(message);
        speak(gptResponse);
        content.textContent = gptResponse;
    } catch (error) {
        console.error('Error taking command:', error);
        speak('I am having trouble processing your request.');
        content.textContent = 'Error processing request.';
    }
}

async function getGptResponse(prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
            })
        });

        const data = await response.json();
        console.log('GPT-3.5 response:', data);
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].text.trim();
        } else {
            throw new Error('No response from GPT-3.5');
        }
    } catch (error) {
        console.error('Error getting GPT-3.5 response:', error);
        return 'I am having trouble accessing the response from GPT-3.5.';
    }
}

