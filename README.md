# FastAPI Serverless Boilerplate

A production-ready FastAPI serverless boilerplate using AWS Lambda, Cognito, DynamoDB, and Terraform.

## Features

- FastAPI on AWS Lambda
- AWS Cognito for authentication
- DynamoDB for data storage
- Terraform for Infrastructure as Code
- AWS Lambda Powertools for observability
- Pytest for testing
- Black for code formatting
- Flake8 for linting

## Prerequisites

- Python 3.12
- Terraform v1.11.3
- AWS CLI configured with appropriate credentials
- Docker (for local development)

## Project Structure

```
.
├── backend/                    # Application code
│   ├── api/               # API routes
│   ├── core/              # Core functionality
│   ├── models/            # Data models
│   └── services/          # Business logic
├── infrastructure/        # Terraform IaC
├── tests/                 # Test files
├── .github/              # GitHub Actions workflows
├── requirements.txt      # Python dependencies
└── terraform.tfvars      # Terraform variables
```

## Setup

1. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize Terraform:
```bash
cd infrastructure
terraform init
```

4. Deploy infrastructure:
```bash
terraform plan
terraform apply
```

## Development

- Run tests: `pytest`
- Format code: `black .`
- Lint code: `flake8`

## Local Development

1. Start local DynamoDB:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

2. Run the application locally:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once deployed, access the API documentation at:
- Swagger UI: `/docs`
- ReDoc: `/redoc`

## License

MIT 