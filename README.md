# The Quest Board [IN CONSTRUCTION]

The Quest Board is a web application designed to assist artists in finding commissions on Reddit. It aggregates client posts from various subreddits, bringing them to one centralized platform. Users can customize their preferences, and the platform notifies them when relevant commissions match their criteria.

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Flow](#project-flow)
- [Key Features](#key-features)
- [How to Use](#how-to-use)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Quest Board aims to simplify the commission-seeking process for artists on Reddit. By consolidating client posts and providing personalized notifications, artists can efficiently find and secure commissions that match their skills and preferences.

The project consists of a Vue.js frontend, a Nest.js backend, and utilizes Prisma as the ORM for PostgreSQL. Docker is employed for containerization, and GitHub Actions is set up for continuous integration.

## Technologies Used

- **Frontend:**
  - Vue.js
  - Vite
  - TypeScript
  - Pinia (State Management)
  - NUXT 3 (Routing)
  
- **Backend:**
  - Nest.js
  - TypeScript
  - Prisma (ORM)
  - PostgreSQL (Database)
  - Docker

- **Testing:**
  - Jest (Unit Testing)

- **Web Scraping:**
  - Puppeteer

- **CI/CD:**
  - GitHub Actions

## Project Flow

1. Users interact with the frontend, navigating through the application.
2. Frontend makes HTTP requests to the backend API to fetch and display data.
3. Backend handles API requests, interacts with the database using Prisma, and performs business logic.
4. Newsletter subscriptions trigger an email service storing emails in the database.
5. Web scraping is performed using Puppeteer to gather data from Reddit, within the bounds of their TOS.

## Key Features

- Compact frontend interface, to the point
- Mailing list system with personalized alerts set via a user account
- Compliant with GDPR privacy regulations
- Containerized application for easy deployment and scalability

## How to Use

User : Simply go to the URL ! Coming soon.
If you're a developer contributing to this project:
- Clone the repository
- Make sure you have Docker installed
- Make sure you have enough memory space available (3 GB+ at minimum)
- Fill in the .env file using the .env.example
- docker-compose up !

## License

