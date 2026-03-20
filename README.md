# AI Study Platform

An interactive web platform that helps students and learners absorb material more effectively by transforming their uploaded study resources into automatically generated flashcards, mind maps, quizzes, and more using artificial intelligence.

## Project Access

At the moment, the **AI Study Platform** is not publicly available online.
The system is currently under development and internal testing.

After the current development stage is completed in the coming weeks, public web access will be provided through an official domain, along with a demonstration version and documentation for installation and usage.

All updates regarding access and release will be announced in this repository.

## Overview

Many students struggle to learn new material due to unclear, repetitive, or poorly structured resources.

The **AI Study Platform** aims to solve this problem by allowing users to upload their own study materials (PDF files, presentations, documents, videos, images, etc.), which are then processed by artificial intelligence and transformed into interactive learning tools.

In addition, the platform includes a gamification system that allows users to create groups with friends and classmates, earn points, and compete based on learning activity and quiz results.

## Key Features

* Upload study materials (PDF, DOCX, PPTX, images, videos, etc.)
* Automatic generation of flashcards, mind maps, and quizzes using AI
* Personalized resources based on uploaded content
* Gamification — points, progress, and friendly competition
* Groups for collaborative learning
* Secure authentication and user data management

## How It Works

1. Upload materials – the user uploads files or media.
2. AI processing – the backend analyzes the content and generates new resources.
3. Interactive tools – the user receives flashcards, mind maps, and quizzes.
4. Gamification – the system awards points and tracks user progress.

---

## Project Structure

```
Study-Platform/
│
├── Backend/            # ASP.NET Core API
│   ├── StudyPlatform       # Main backend source code
│   ├── StudyPlatformTests  # Unit tests
│   └── Microservices       # Microservices source code
│
├── Frontend/          # React web application
│
└── README.md          # Project overview
```

* The backend manages authentication, file uploads, AI resource generation, and the database.
* The frontend provides the interface for uploading, learning, and interacting with resources.

## Technologies Used

### Backend

* ASP.NET Core API
* C#
* Entity Framework Core
* SQL Server

### Frontend

* React
* TypeScript / JavaScript
* HTML / CSS

### Additional Tools

* Canva, Draw.io, GIMP, MS Office, Overleaf (for design, diagrams, and documentation)

# Frontend – AI Study Platform

The frontend is built with React and serves as the user interface of the platform.

## Key Features

* Upload study materials (PDF, images, videos, etc.)
* View AI-generated flashcards, mind maps, and quizzes
* Manage groups and leaderboards
* Modern, responsive interface with gamification elements

## Technologies

* React
* TypeScript / JavaScript
* HTML, CSS
* React Router, Context API

# Backend and Microservices – AI Study Platform

## Backend

The backend is a RESTful ASP.NET Core API that serves as the main connection between the user interface, database, and AI microservices.
It handles authentication, frontend requests, and the logic for gamification and learning.

### Main Responsibilities

* Authentication and authorization (JWT)
* File upload and storage
* Gamification logic and progress tracking
* Database management using Entity Framework Core
* Communication with microservices for content processing and AI

### Technologies

* ASP.NET Core API
* C#
* Entity Framework Core
* SQL Server
* REST API architecture

## Running the ASP.NET Core API and Accessing Swagger

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Study-Platform.git
cd Study-Platform/Backend/StudyPlatform
```

### 2. Install dependencies

Make sure you have .NET SDK 7 or newer installed:

```bash
dotnet restore
```

### 3. Run the API

```bash
dotnet run
```

By default, the application will run on:

* HTTPS: `https://localhost:44300` `https://localhost:5163`
* HTTP: `http://localhost:38976`

### 4. Access Swagger documentation

Open your browser and go to:

```bash
https://localhost:44300/swagger
```

There you will find interactive API documentation where you can test all endpoints.

### 5. Additional configuration (optional)

* To change ports or URLs, edit `launchSettings.json` in the `Properties` folder.

## Microservices

The microservices are responsible for processing uploaded files and generating resources using artificial intelligence.
They are separate components that communicate with the main backend via HTTP requests or a message queue (e.g., RabbitMQ).

### Main Responsibilities

* Extracting text and structured data from files (PDF, DOCX, PPTX, images, videos)
* Generating flashcards, mind maps, and quizzes using AI models
* Content analysis and categorization
* Returning generated resources to the main API

### Technologies

* Python
* AI / NLP libraries – OpenAI API, Transformers, spaCy, etc.
* FastAPI

### Backend Integration

1. The user uploads a file through the frontend.
2. The backend receives the file and forwards it to the appropriate microservice.
3. The microservice extracts content and generates resources using AI.
4. The generated data is returned to the backend, which stores and displays it in the frontend.
