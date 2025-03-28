# Database Schema Documentation

This document provides an overview of the database schema used in the Next.js SaaS Starter application.

## Tables Overview

The database consists of several interconnected tables:

- `users` - User account information
- `teams` - Team information and subscription details
- `team_members` - Relationship between users and teams
- `activity_logs` - User activity tracking
- `invitations` - Team invitations
- `cv_data` - CV file storage and extracted content

## CV Data Schema

The `cv_data` table stores information about uploaded CV files and their extracted content.

### Table Structure

| Column         | Type         | Description                                      |
| -------------- | ------------ | ------------------------------------------------ |
| `id`           | serial       | Primary key                                      |
| `user_id`      | integer      | Foreign key reference to the users table         |
| `file_name`    | varchar(255) | Original name of the uploaded file               |
| `file_size`    | integer      | Size of the file in bytes                        |
| `file_type`    | varchar(100) | MIME type of the file (e.g., application/msword) |
| `content`      | text         | Plain text content extracted from the CV         |
| `json_content` | jsonb        | Structured JSON representation of the CV content |
| `created_at`   | timestamp    | When the record was created                      |
| `updated_at`   | timestamp    | When the record was last updated                 |

### Relationships

- Each CV record is associated with exactly one user via a foreign key.
- A user can have multiple CV records.

### JSON Content Structure

The `json_content` field contains a structured representation of the CV, which may include:

```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "summary": "Experienced professional...",
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Example Corp",
      "startDate": "2020-01",
      "endDate": "2023-01",
      "description": "Developed..."
    }
  ],
  "education": [
    {
      "institution": "University",
      "degree": "Bachelor's",
      "field": "Computer Science",
      "graduationDate": "2019"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "languages": ["English", "Spanish"],
  "certifications": [],
  "projects": []
}
```

### Usage

The CV data is used primarily in the CV rewriting service:

1. Users upload their CV files on the dashboard
2. The system extracts the content and structure of the CV
3. The structured data is used with an LLM to rewrite the CV based on job descriptions
4. Users can download the rewritten CV in various formats

### API Endpoints

The following API endpoints interact with the CV data:

- `POST /api/cv/upload` - Uploads and processes a new CV file
- `GET /api/cv/get-latest` - Retrieves the latest CV file metadata for the current user
- `DELETE /api/cv/delete` - Deletes a specific CV record

### Database Queries

Common database queries for CV data can be found in `lib/db/queries.ts`, including:

- `getUserLatestCV()` - Retrieves the most recent CV uploaded by the current user

## Migration

The CV data table was added in migration `0001_majestic_lila_cheney.sql`.
