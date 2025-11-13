// Chatbot functionality for Amma's Healing
const CHATBOT_API = 'http://localhost:5001/api/chatbot';

let chatbotOpen = false;
let chatHistory = [];

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    createChatbotUI();
    loadPresetPrompts();
});

function createChatbotUI() {
    const chatbotHTML = `
        <div id="chatbot-container" class="chatbot-container">
            <button id="chatbot-toggle" class="chatbot-toggle">
                <span class="chatbot-icon">💬</span>
                <span class="chatbot-text">Help</span>
            </button>
            
            <div id="chatbot-window" class="chatbot-window">
                <div class="chatbot-header">
                    <h3>Amma's Healing Assistant</h3>
                    <button id="chatbot-close" class="chatbot-close">×</button>
                </div>
                
                <div class="chatbot-preset-prompts" id="preset-prompts">
                    <p class="preset-title">Quick Questions:</p>
                    <div id="prompts-list" class="prompts-list">
                        <!-- Prompts will be loaded here -->
                    </div>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-message bot-message">
                        <p>Hello! I'm here to help you with any questions about Amma's Healing. Click on a question above or type your own below.</p>
                    </div>
                </div>
                
                <div class="chatbot-input-container">
                    <input 
                        type="text" 
                        id="chatbot-input" 
                        placeholder="Type your question..." 
                        class="chatbot-input"
                    />
                    <button id="chatbot-send" class="chatbot-send">Send</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Add event listeners
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    document.getElementById('chatbot-close').addEventListener('click', toggleChatbot);
    document.getElementById('chatbot-send').addEventListener('click', sendMessage);
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (chatbotOpen) {
        window.classList.add('open');
        toggle.style.display = 'none';
    } else {
        window.classList.remove('open');
        toggle.style.display = 'flex';
    }
}

async function loadPresetPrompts() {
    try {
        const response = await fetch(`${CHATBOT_API}/prompts`);
        const data = await response.json();
        
        if (data.success) {
            const promptsList = document.getElementById('prompts-list');
            promptsList.innerHTML = data.prompts.map(prompt => `
                <button class="preset-prompt-btn" data-question="${prompt.question}">
                    ${prompt.question}
                </button>
            `).join('');
            
            // Add click handlers to preset prompts
            document.querySelectorAll('.preset-prompt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const question = btn.dataset.question;
                    askQuestion(question);
                });
            });
        }
    } catch (error) {
        console.error('Error loading prompts:', error);
        // If chatbot API is not running, show offline message
        const promptsList = document.getElementById('prompts-list');
        promptsList.innerHTML = '<p class="offline-message">Chatbot is currently offline. Please try again later.</p>';
    }
}

async function askQuestion(question) {
    // Add user message to chat
    addMessage(question, 'user');
    
    // Clear input
    document.getElementById('chatbot-input').value = '';
    
    // Show typing indicator
    const typingDiv = addTypingIndicator();
    
    try {
        const response = await fetch(`${CHATBOT_API}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        typingDiv.remove();
        
        if (data.success) {
            addMessage(data.answer, 'bot');
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    } catch (error) {
        typingDiv.remove();
        addMessage('Sorry, I\'m currently offline. Please try again later.', 'bot');
        console.error('Error asking question:', error);
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const question = input.value.trim();
    
    if (!question) return;
    
    askQuestion(question);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatHistory.push({ text, sender, timestamp: new Date() });
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingDiv;
}
