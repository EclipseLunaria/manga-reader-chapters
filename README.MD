# Manga Reader

This project is a manga reader application that allows users to read their favorite manga online. It provides a user-friendly interface for browsing and reading manga chapters.

**Notice: This project is deprecated**

Please note that this project has been refactored into two separate microservices: Manga Storage Service and Manga Extraction Service. The Manga Storage Service handles manga metadata and chapter information, while the Manga Extraction Service is responsible for extracting and processing manga chapters.

We recommend using the new microservices for any future development or integration. The deprecated codebase will no longer receive updates or bug fixes.

## Features

- Extract Page Images from Manga and store them in s3 avoiding additional external calls 
- View chapter urls for chapter pages for html usage

