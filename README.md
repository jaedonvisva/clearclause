# ClauseClear 📋

ClearClause is a full-stack web application that uses AI to analyze legal documents and identify potentially problematic clauses. It helps users understand risks in contracts and legal agreements by providing detailed explanations and recommendations.

## Features

- **AI-Powered Analysis**: Uses open-source LLMs to analyze legal documents
- **PDF Processing**: Extracts text from uploaded PDF documents
- **Risk Assessment**: Identifies and categorizes clauses by risk level (High/Medium/Low)
- **Detailed Explanations**: Provides clear explanations of why clauses might be problematic
- **Actionable Recommendations**: Suggests what users should clarify or negotiate
- **Responsive UI**: Clean, modern interface that works on all devices

## Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **TailwindCSS** for styling
- **React** for UI components

### Backend
- **Python Flask** API
- **PyPDF2 & pdfplumber** for PDF text extraction
- **Requests** for LLM API communication
- **Flask-CORS** for cross-origin requests

### AI/LLM
- **Ollama** or **LM Studio** for self-hosted open-source models
- Configurable API endpoint and model selection

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Ollama** or **LM Studio** running locally with a language model

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd clearclause
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment (if not already created)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit the `.env` file to configure your LLM API:

```env
# LLM API Configuration
LLM_API_URL=http://localhost:11434/api/generate  # Ollama default
LLM_MODEL=llama2  # or your preferred model
LLM_API_KEY=  # Leave empty for Ollama

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies (if not already installed)
npm install
```

### 4. LLM Setup (Ollama Example)

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# Pull a model (in another terminal)
ollama pull llama2
# or for better legal analysis:
ollama pull llama2:13b
```

## Running the Application

### 1. Start the Backend

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
flask run
```

The Flask API will be available at `http://localhost:5000`

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

The Next.js application will be available at `http://localhost:3000`

### 3. Verify Setup

Visit `http://localhost:5000/api/health` to check if the backend can connect to your LLM API.

## Usage

1. **Provide Context**: Enter information about your document and any specific concerns
2. **Upload PDF**: Select and upload your legal document (PDF format, up to 16MB)
3. **Review Analysis**: View flagged clauses with risk levels, explanations, and recommendations

## API Endpoints

- `GET /api/hello` - Basic health check
- `GET /api/health` - Detailed health check including LLM connectivity
- `POST /api/analyze` - Analyze uploaded PDF document

## Configuration

### LLM Models

The application works with various open-source models:
- **llama2** (7B/13B) - Good general performance
- **mistral** - Fast and efficient
- **codellama** - Better for technical documents
- **llama2:70b** - Best quality (requires more resources)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_API_URL` | LLM API endpoint | `http://localhost:11434/api/generate` |
| `LLM_MODEL` | Model name to use | `llama2` |
| `LLM_API_KEY` | API key (if required) | Empty |
| `FLASK_ENV` | Flask environment | `development` |
| `FLASK_DEBUG` | Enable debug mode | `True` |

## Troubleshooting

### Common Issues

1. **"Failed to connect to LLM API"**
   - Ensure Ollama/LM Studio is running
   - Check the `LLM_API_URL` in your `.env` file
   - Verify the model is downloaded: `ollama list`

2. **"Could not extract text from PDF"**
   - Ensure the PDF contains selectable text (not just images)
   - Try a different PDF or use OCR preprocessing

3. **CORS errors**
   - Ensure Flask-CORS is installed and configured
   - Check that the frontend is making requests to the correct backend URL

4. **Large file uploads failing**
   - Check file size (max 16MB)
   - Ensure stable internet connection

### Performance Tips

- Use smaller models (7B) for faster responses
- Use larger models (13B/70B) for better legal analysis quality
- Increase timeout values for complex documents
- Consider using GPU acceleration for local LLM inference

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
flask run --debug
```

### Frontend Development

```bash
cd frontend
npm run dev
```

The application supports hot reloading for both frontend and backend development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for informational purposes only and does not constitute legal advice. Always consult with qualified legal professionals for important legal matters.
