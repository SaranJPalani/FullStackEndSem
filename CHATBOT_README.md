# Amma's Healing AI Chatbot

## Overview
This AI-powered chatbot uses Google's Gemini AI to answer questions about the Amma's Healing e-commerce platform.

## Features
- 5 preset quick questions users can click
- Custom question input for specific queries
- Real-time AI responses using Gemini Pro
- Beautiful chat interface with typing indicators
- Seamless integration with the main website

## Preset Questions
1. **What products can I buy on Amma's Healing?**
2. **How do I track my order?**
3. **What are flash sales and how do they work?**
4. **How do I create an account and manage my profile?**
5. **What payment methods do you accept?**

## Setup Instructions

### 1. Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Start the Chatbot API Server
```powershell
python aitesting.py
```

The chatbot API will run on `http://localhost:5001`

### 3. Start the Main E-commerce Server
In a separate terminal:
```powershell
npm start
```

The main website will run on `http://localhost:5000`

### 4. Access the Website
Open your browser and go to: `http://localhost:5000`

Click the **"Help"** button in the bottom-right corner to open the chatbot!

## How It Works

1. **Preset Prompts**: Users see 5 common questions they can click
2. **Custom Questions**: Users can type their own questions
3. **AI Processing**: Questions are sent to the Gemini AI model with website context
4. **Smart Responses**: AI generates helpful answers based on Amma's Healing features
5. **Chat History**: All messages are displayed in a beautiful chat interface

## API Endpoints

### GET `/api/chatbot/prompts`
Returns the list of preset prompts

### POST `/api/chatbot/ask`
Sends a question and receives an AI-generated answer
```json
{
  "question": "How do I track my order?"
}
```

### GET `/api/chatbot/health`
Health check endpoint

## Tech Stack
- **Backend**: Flask (Python)
- **AI Model**: Google Gemini Pro
- **Frontend**: Vanilla JavaScript
- **Styling**: CSS with cyan/teal theme

## Customization

### Adding More Preset Prompts
Edit the `PRESET_PROMPTS` array in `aitesting.py`:
```python
PRESET_PROMPTS = [
    {
        "id": 6,
        "question": "Your new question here?",
        "category": "category_name"
    }
]
```

### Changing Website Context
Update the `WEBSITE_CONTEXT` string in `aitesting.py` to modify how the AI understands your website.

## Troubleshooting

### Chatbot shows "offline" message
- Make sure you've installed Python dependencies: `pip install -r requirements.txt`
- Start the chatbot API: `python aitesting.py`
- Check that port 5001 is not being used by another application

### No responses from AI
- Verify your Gemini API key is valid
- Check your internet connection
- Look at the Python terminal for error messages

## Security Note
The Gemini API key is currently hardcoded. For production, use environment variables:
```python
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
```

---

**Enjoy your AI-powered customer support! 🤖💬**
