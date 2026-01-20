# StudioSync

A professional document management system designed for accountants and consultants. It streamlines the process of collecting, labeling, and organizing documents (PDFs and images) from multiple clients in a secure, centralized environment.

## Key Features

* **Client Portal:** Individual accounts for clients to securely upload their documentation.
* **Smart Labeling:** Clients can tag uploads (e.g., "Invoices", "Tax Returns", "Receipts") for easier retrieval.
* **Admin Dashboard:** A bird's-eye view for the professional to manage all clients and browse their documents.
* **User Management:** Admin can easily onboard new clients and manage permissions.
* **File Support:** Full support for PDF and image formats (JPG, PNG).

## Tech Stack
- **Frontend**: React / Next.js
- **Backend**: PHP 8.3 (FPM)
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker & Docker Compose
- **Structure:**:
    * `/backend`: Core logic and API endpoints.
    * `/frontend`: Clean and intuitive UI.
    * `/uploads`: Secure storage for client documentation.

## Getting Started
To get a local instance of StudioSync up and running, follow these steps:

1. **Clone the repository**
```bash
   git clone https://github.com/justaboy75/StudioSync.git
   cd StudioSync
```
2. **Spin up the environment** 
Ensure you have Docker installed, then run:
```bash
docker-compose up -d --build
```
3. **Access the application** 
Open your browser and navigate to:
 - `http://localhost:3000` for UI
 - `http://localhost:8080` for API

## Project structure
```
.
├── /backend      # Server-side logic & Database interactions
├── /frontend     # Client-side interface
├── /uploads      # User-uploaded documents (gitignored for security)
├── docker-compose.yml
└── README.md
```

## Security and performance
 - **Postgres**: Used for its robustness and data integrity, ensuring client records are never lost.
 - **Dockerized**: Ensures the same environment from development to production.
 - **Privacy**: Designed with a clear separation between client data.

## License
This project is open-source and available under the MIT License.

_Developed by Andrea Allegri. Available for freelance opportunities and technical collaborations._
