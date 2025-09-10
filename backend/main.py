import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import PyPDF2
import pdfplumber
import io
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# LLM Configuration
LLM_API_URL = os.getenv('LLM_API_URL', 'http://localhost:11434/api/generate')
LLM_MODEL = os.getenv('LLM_MODEL', 'llama2')
LLM_API_KEY = os.getenv('LLM_API_KEY', '')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_stream):
    print("\n--- [DEBUG] Starting PDF Text Extraction ---")
    """Extract text from PDF using both PyPDF2 and pdfplumber for better coverage"""
    text = ""
    
    try:
        # Try with pdfplumber first (better for complex layouts)
        print("[DEBUG] Attempting extraction with pdfplumber...")
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        print("[DEBUG] pdfplumber extraction successful.")
    except Exception as e:
        print(f"[DEBUG] pdfplumber failed: {e}")
        
        # Fallback to PyPDF2
        print("[DEBUG] Falling back to PyPDF2 for extraction...")
        try:
            file_stream.seek(0)  # Reset stream position
            pdf_reader = PyPDF2.PdfReader(file_stream)
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            print("[DEBUG] PyPDF2 extraction successful.")
        except Exception as e2:
            print(f"[DEBUG] PyPDF2 also failed: {e2}")
            return None
    
    print(f"[DEBUG] PDF Extraction complete. Total characters: {len(text)}")
    return text.strip() if text.strip() else None

def search_legal_definition(term: str) -> str:
    """Looks up the definition of a legal term. Returns the definition or a not found message."""
    print(f"--- [TOOL CALLED] Searching for definition of: {term} ---")
    definitions = {
        "indemnification": "A contractual obligation of one party (the indemnitor) to compensate the loss incurred by another party (the indemnitee) due to the acts of the indemnitor or any other party. Essentially, it's a promise to cover someone else's potential legal costs.",
        "liability": "Legal responsibility for one's acts or omissions. Failure of a person or entity to meet that responsibility leaves them open to a lawsuit for any resulting damages or a court order to perform.",
        "non-compete": "A clause under which one party (usually an employee) agrees not to enter into or start a similar profession or trade in competition against another party (usually the employer).",
        "termination for cause": "The termination of an employment contract by an employer due to the employee's misconduct or failure to perform their duties. This is distinct from termination without cause, which does not require a specific reason.",
        "arbitration": "A method of resolving disputes outside the courts, where the parties present their case to a neutral third party (the arbitrator) whose decision is usually binding.",
        "force majeure": "A clause freeing both parties from obligation if an extraordinary event or circumstance beyond their control prevents one or both from fulfilling their obligations.",
        "warranty": "A promise or guarantee provided by one party to another regarding the condition, quality, or performance of a product or service.",
        "confidentiality": "An obligation to keep certain information secret and not disclose it to unauthorized parties.",
        "assignment": "The transfer of rights or obligations from one party to another under a contract.",
        "hold harmless": "A clause where one party agrees not to hold the other responsible for any loss, damage, or legal liability."
    }

    return definitions.get(term.lower(), f"No definition found for: {term}")


def get_llm_analysis(context, document_text):
    print("\n--- [DEBUG] Starting LLM Analysis ---")
    """Send document and context to LLM for analysis, supporting both Ollama and OpenAI-compatible APIs."""

    system_prompt = """You are a legal expert analyzing a contract or legal document. Your task is to identify potentially problematic clauses. 

When you encounter a specific legal term (like 'indemnification' or 'liability'), you MUST use the `search_legal_definition` tool to get its precise definition and incorporate that definition into your explanation for why a clause is risky. This makes your analysis more accurate and helpful.

First, verify if the user-provided context accurately describes the document. If there is a significant mismatch (e.g., the user says it's an employment contract but it's a lease agreement), you MUST add a `context_match_warning` field to your JSON response explaining the discrepancy. Proceed with the analysis based on the document's actual content, not the user's description.

For each issue you find, provide:
1. The exact clause text (quote it directly)
2. Why it might be risky or problematic
3. What the user should clarify, negotiate, or be aware of

Respond ONLY with valid JSON in this exact format. The `context_match_warning` field is OPTIONAL and should only be included if a mismatch is detected:
{
  "summary": "Brief overall assessment of the document's risk level and main concerns",
  "context_match_warning": "A warning if the user's context does not match the document's content. Omit this field if they match.",
  "flagged_clauses": [
    {
      "clause_text": "Exact text of the problematic clause",
      "risk_level": "High|Medium|Low",
      "explanation": "Why this clause is problematic",
      "recommendation": "What the user should do about this clause"
    }
  ],
  "overall_recommendation": "General advice for the user"
}

If no significant issues are found, return a similar JSON but with an empty `flagged_clauses` array."""

    user_prompt = f"""CONTEXT PROVIDED BY USER:
{context}

DOCUMENT TEXT:
{document_text}"""

    headers = {'Content-Type': 'application/json'}
    if LLM_API_KEY:
        headers['Authorization'] = f'Bearer {LLM_API_KEY}'

    # Check if using an OpenAI-compatible API (like LM Studio)
    is_openai_compatible = '/v1/' in LLM_API_URL
    api_type = "OpenAI-compatible" if is_openai_compatible else "Ollama"
    print(f"[DEBUG] Detected API type: {api_type}")
    print(f"[DEBUG] Using model: {LLM_MODEL}")

    if is_openai_compatible:
        # This is the first call to the LLM
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "search_legal_definition",
                    "description": "Gets the definition of a legal term.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "term": {
                                "type": "string",
                                "description": "The legal term to be defined, e.g., 'indemnification'"
                            }
                        },
                        "required": ["term"]
                    }
                }
            }
        ]

        payload = {
            "model": LLM_MODEL,
            "messages": messages,
            "tools": tools,
            "tool_choice": "auto",
            "temperature": 0.3,
            "max_tokens": 4096, # Increased for potentially larger responses
            "stream": False
        }
    else: # Ollama format
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        payload = {
            "model": LLM_MODEL,
            "prompt": full_prompt,
            "format": "json",
            "stream": False,
            "options": {
                "temperature": 0.3,
                "top_p": 0.9
            }
        }

    try:
        print(f"[DEBUG] Sending request to {LLM_API_URL}...")
        response = requests.post(LLM_API_URL, headers=headers, json=payload, timeout=180)
        response.raise_for_status()
        print("[DEBUG] Received successful response from LLM API.")
        
        if is_openai_compatible:
            response_data = response.json()
            response_message = response_data['choices'][0]['message']

            # Check if the model wants to call a tool
            if response_message.get("tool_calls"):
                print("[DEBUG] LLM requested a tool call.")
                # For simplicity, we handle one tool call here. A real app might loop.
                tool_call = response_message["tool_calls"][0]
                function_name = tool_call['function']['name']
                
                if function_name == 'search_legal_definition':
                    function_args = json.loads(tool_call['function']['arguments'])
                    term = function_args.get('term')
                    
                    # Call the actual tool function
                    tool_response_content = search_legal_definition(term)
                    
                    # Append the tool call and its response to the message history
                    messages.append(response_message) # Add the assistant's tool request
                    messages.append({
                        "tool_call_id": tool_call['id'],
                        "role": "tool",
                        "name": function_name,
                        "content": tool_response_content
                    })
                    
                    # Make the second call to the LLM with the tool's result
                    print("[DEBUG] Sending second request to LLM with tool response.")
                    second_payload = {
                        "model": LLM_MODEL,
                        "messages": messages,
                        "temperature": 0.3,
                        "max_tokens": 4096,
                        "stream": False
                    }
                    second_response = requests.post(LLM_API_URL, headers=headers, json=second_payload, timeout=180)
                    second_response.raise_for_status()
                    llm_response = second_response.json()['choices'][0]['message']['content']
                else:
                    # If the tool is not recognized, return an error
                    llm_response = '{"summary": "Error: LLM requested an unknown tool.", "flagged_clauses": []}'
            else:
                # No tool call, just content
                print("[DEBUG] LLM did not request a tool call. Processing content directly.")
                llm_response = response_message['content']
        else: # Ollama format (does not support tool calling in this implementation)
            print("[DEBUG] Parsing Ollama response...")
            llm_response = response.json()['response']
        
        # Try to parse JSON from LLM response
        try:
            # Find JSON in response (in case there's extra text or code fences)
            json_match = re.search(r'```json\n({.*?})\n```', llm_response, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                start = llm_response.find('{')
                end = llm_response.rfind('}') + 1
                if start != -1 and end != 0:
                    json_str = llm_response[start:end]
                else:
                    raise json.JSONDecodeError("No JSON object found", llm_response, 0)
            
            print("[DEBUG] Successfully parsed JSON from LLM response.")
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"[DEBUG] Failed to parse JSON from LLM response: {e}")
            print(f"[DEBUG] Raw LLM response was: {llm_response}")
            # If JSON parsing fails, return a structured error
            return {
                "summary": "Analysis completed but response format was invalid",
                "flagged_clauses": [{
                    "clause_text": "Unable to parse structured response",
                    "risk_level": "Unknown",
                    "explanation": "The LLM provided analysis but in an unexpected format.",
                    "recommendation": "Please try again or review the document manually."
                }],
                "overall_recommendation": f"Raw LLM response: {llm_response[:500]}..."
            }
    
    except requests.exceptions.RequestException as e:
        print(f"[DEBUG] Error connecting to LLM API: {e}")
        return {
            "error": f"Failed to connect to LLM API: {str(e)}",
            "summary": "Analysis failed due to API connection error",
            "flagged_clauses": [],
            "overall_recommendation": "Please check your LLM API configuration and try again"
        }
    except Exception as e:
        print(f"[DEBUG] Unexpected error during LLM analysis: {e}")
        return {
            "error": f"Unexpected error during LLM analysis: {str(e)}",
            "summary": "Analysis failed due to unexpected error",
            "flagged_clauses": [],
            "overall_recommendation": "Please try again or contact support"
        }

@app.route('/api/hello')
def hello():
    return {'message': 'Legal Document Analyzer API is running!'}

@app.route('/api/analyze', methods=['POST'])
def analyze_document():
    print("\n--- [INFO] Received new request for /api/analyze ---")
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        print(f"[DEBUG] File received: {file.filename}")
        context = request.form.get('context', '')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        # Extract text from PDF
        file_stream = io.BytesIO(file.read())
        document_text = extract_text_from_pdf(file_stream)
        
        if not document_text:
            return jsonify({'error': 'Could not extract text from PDF. The file may be corrupted or contain only images.'}), 400
        
        if len(document_text.strip()) < 50:
            return jsonify({'error': 'Document appears to be too short or mostly empty'}), 400
        
        # Get LLM analysis
        print(f"[DEBUG] Extracted {len(document_text)} characters from PDF. Proceeding to analysis.")
        analysis = get_llm_analysis(context, document_text)
        
        print("[INFO] Analysis complete. Sending successful response to client.")
        return jsonify({
            'success': True,
            'analysis': analysis,
            'document_length': len(document_text)
        })
    
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred in /api/analyze: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health')
def health():
    """Health check endpoint"""
    try:
        # Test LLM API connection
        headers = {'Content-Type': 'application/json'}
        if LLM_API_KEY:
            headers['Authorization'] = f'Bearer {LLM_API_KEY}'
        
        is_openai_compatible = '/v1/' in LLM_API_URL

        if is_openai_compatible:
            test_payload = {
                "model": LLM_MODEL,
                "messages": [{"role": "user", "content": "Hello"}],
                "max_tokens": 10
            }
        else: # Ollama format
            test_payload = {
                "model": LLM_MODEL,
                "prompt": "Hello",
                "stream": False
            }
        
        response = requests.post(LLM_API_URL, headers=headers, json=test_payload, timeout=10)
        llm_status = "connected" if response.status_code == 200 else f"error ({response.status_code})"
    except:
        llm_status = "disconnected"
    
    return jsonify({
        'status': 'healthy',
        'llm_api_status': llm_status,
        'llm_api_url': LLM_API_URL,
        'llm_model': LLM_MODEL
    })

if __name__ == '__main__':
    app.run(debug=True)
