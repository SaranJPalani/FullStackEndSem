import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

genai.configure()

model = genai.GenerativeModel('models/gemini-pro-latest')

app = Flask(__name__)
CORS(app)

# Website context for AI
WEBSITE_CONTEXT = """
You are a helpful AI assistant for "Amma's Healing", an e-commerce healthcare platform.

Website Information:
- Name: Amma's Healing
- Type: Healthcare and medical supplies e-commerce platform
- Categories: Refreshments, Home & Kitchen, Medicine
- Features: 
  * Browse 500+ healthcare and wellness products
  * Secure user authentication and profile management
  * Shopping cart and order tracking
  * Flash sales with countdown timers
  * Email notifications for orders
  * Admin dashboard with analytics and leaderboard
  * Top buyers leaderboard
  * Order history and status tracking

Answer questions about the website in a helpful, friendly, and professional manner.
Keep responses concise (2-3 sentences) unless more detail is requested.
"""

# Preset prompts for users to click
PRESET_PROMPTS = [
    {
        "id": 1,
        "question": "What products can I buy on Amma's Healing?",
        "category": "products"
    },
    {
        "id": 2,
        "question": "How do I track my order?",
        "category": "orders"
    },
    {
        "id": 3,
        "question": "What are flash sales and how do they work?",
        "category": "features"
    },
    {
        "id": 4,
        "question": "How do I create an account and manage my profile?",
        "category": "account"
    }
]

def get_ai_response(user_question):
    """Get AI response for user question about the website"""
    try:
        prompt = f"""{WEBSITE_CONTEXT}

User Question: {user_question}

Provide a helpful, accurate answer based on the website information above.
If the question is outside the scope of the website, politely redirect to relevant topics.
"""
        
        response = model.generate_content(prompt)
        ai_response = response.text.strip()
        
        return {
            "success": True,
            "answer": ai_response
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error generating response: {str(e)}"
        }

@app.route('/api/chatbot/prompts', methods=['GET'])
def get_prompts():
    """Return the list of preset prompts"""
    return jsonify({
        "success": True,
        "prompts": PRESET_PROMPTS
    })

@app.route('/api/chatbot/ask', methods=['POST'])
def ask_question():
    """Handle user questions (preset or custom)"""
    data = request.json
    question = data.get('question', '')
    
    if not question:
        return jsonify({
            "success": False,
            "error": "No question provided"
        }), 400
    
    response = get_ai_response(question)
    return jsonify(response)

@app.route('/api/chatbot/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "message": "Chatbot API is running"
    })

if __name__ == "__main__":
    print("🤖 Amma's Healing AI Chatbot starting on port 5001...")
    print("\nPreset Questions:")
    for prompt in PRESET_PROMPTS:
        print(f"  {prompt['id']}. {prompt['question']}")
    print("\nChatbot API running at http://localhost:5001")
    app.run(debug=True, port=5001)
