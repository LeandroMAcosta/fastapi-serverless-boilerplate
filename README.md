# Simple FastAPI Serverless Boilerplate

A production-ready FastAPI serverless boilerplate using AWS Lambda, Cognito, DynamoDB, and Terraform, with a React frontend.

## Features

- FastAPI on AWS Lambda
- React frontend with modern UI components
- AWS Cognito for authentication
- DynamoDB for data storage
- Terraform for Infrastructure as Code
- AWS Lambda Powertools for observability
- Pytest for testing
- Black for code formatting
- Flake8 for linting
- Mercado Pago integration for payments

## Prerequisites

- Python 3.12
- Node.js 18+ and npm
- Terraform v1.11.3
- AWS CLI configured with appropriate credentials
- Docker (for local development)

## Project Structure

```
.
├── frontend/                  # React frontend application
│   ├── src/                  # Source code
│   │   ├── components/      # React components
│   │   ├── config.js        # Configuration
│   │   └── App.js          # Main application
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                  # FastAPI backend
│   ├── api/                # API routes
│   │   └── v1/            # API version 1
│   ├── core/              # Core functionality
│   ├── package/           # Lambda package
│   └── main.py           # Application entry point
├── infrastructure/          # Terraform IaC
│   ├── main.tf           # Main Terraform configuration
│   ├── variables.tf      # Terraform variables
│   └── outputs.tf        # Terraform outputs
├── scripts/                # Deployment and utility scripts
│   └── deploy.sh         # Deployment script
└── requirements.txt        # Python dependencies
```

## Setup

1. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Initialize Terraform:
```bash
cd infrastructure
terraform init
```

5. Deploy infrastructure:
```bash
terraform plan
terraform apply
```

## Development

### Backend
- Run tests: `pytest`
- Format code: `black .`
- Lint code: `flake8`

### Frontend
- Start development server: `npm start`
- Build for production: `npm run build`
- Run tests: `npm test`

## Local Development

1. Start local DynamoDB:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

2. Run the backend locally:
```bash
uvicorn app.main:app --reload
```

3. Run the frontend locally:
```bash
cd frontend
npm start
```

## Deployment

Use the deployment script to deploy both frontend and backend:
```bash
./scripts/deploy.sh
```

## API Documentation

Once deployed, access the API documentation at:
- Swagger UI: `/docs`
- ReDoc: `/redoc`

## License

MIT 