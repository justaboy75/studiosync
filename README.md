# StudioSync

A professional document management system designed for accountants and consultants. It streamlines the process of collecting, labeling, and organizing documents (PDFs and images) from multiple clients in a secure, centralized environment.

### Live Demo
Experience the platform in real-time without any setup:
- **URL:** [https://app.just-code.it](https://app.just-code.it)
- **Username:** `demoadmin`
- **Password:** `demoadmin`

## Key Features

* **Client Portal:** Individual accounts for clients to securely upload their documentation.
* **Smart Labeling:** Clients can tag uploads (e.g., "Invoices", "Tax Returns", "Receipts") for easier retrieval.
* **Admin Dashboard:** A bird's-eye view for the professional to manage all clients and browse their documents.
* **User Management:** Admin can easily onboard new clients and manage permissions.
* **File Support:** Full support for PDF and image formats (JPG, PNG).

## Tech Stack
- **Frontend**: React / Next.js / Tailwind CSS
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

## Screenshots
Administrator dashboard:
<img width="995" height="509" alt="image" src="https://github.com/user-attachments/assets/57109aeb-570e-4e1c-b448-20ae84fe63a8" />

Client document upload page:
<img width="999" height="692" alt="image" src="https://github.com/user-attachments/assets/d69cfe79-b9b8-4b6b-aba1-b1c46b233692" />

## License
This project is open-source and available under the MIT License.

_Developed by Andrea Allegri. Available for freelance opportunities and technical collaborations._
