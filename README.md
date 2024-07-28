# Files Management API

This project is a NestJS application that provides APIs to handle file uploads, process file metadata, store data in DynamoDB, and manage file storage in AWS S3.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Create File Attribute](#create-file-attribute)
  - [Create Zip Metadata](#create-zip-metadata)
  - [Upload File](#upload-file)
- [Task Breakdown](#task-breakdown)

## Introduction

This project provides a set of APIs for managing files. The main functionalities include:
- Uploading files to an S3 bucket.
- Creating metadata for uploaded files.
- Storing metadata in DynamoDB.
- Generating a CSV file from metadata and zipping it with the original file.

## Features

- **File Upload**: Upload files and store them in an S3 bucket.
- **Metadata Management**: Generate and store metadata in DynamoDB.
- **File Processing**: Create and download zipped files containing original files and their metadata.

## Setup

### Prerequisites

- Node.js and npm
- AWS account with access to S3 and DynamoDB
- Docker (for containerized environments)

### Installation

## Running Using Docker

1. Clone the repository:
   ```sh
   git clone https://github.com/UdhbhavSinghRana/S3MetaManager.git
   cd S3MetaManager
   ```
2. Set up environment variables:
   
   Create a .env file in the src directory and add your AWS credentials and other necessary configuration.
   
   ```sh
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=your_region
   S3_BUCKET_NAME=your_bucket_name
   DYNAMODB_TABLE_NAME=your_table_name
   ```
   
4. Build the Docker Image:
   ```sh
   docker build -t nestjs-app .
   ```

5. Run Docker Image:
   ```sh
   docker run --rm -p 3001:3001 nestjs-app
   ```

## Running locally 

1. Clone the repository:
   ```sh
   git clone https://github.com/UdhbhavSinghRana/S3MetaManager.git
   cd S3MetaManager
   ```

2. Install Dependencies:
   ```sh
   npm install
   ```
   
3. Set up environment variables:
   
   Create a .env file in the src directory and add your AWS credentials and other necessary configuration.
   
   ```sh
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=your_region
   S3_BUCKET_NAME=your_bucket_name
   DYNAMODB_TABLE_NAME=your_table_name
   ```

5. Running in Dev Mode:
   ```sh
   npm run start:dev
   ```

## API Endpoints

### Upload File

**Endpoint:** `POST /files/`

**Description:** Uploads a file to the S3 bucket.

**Parameters:**

- `file` (multipart/form-data): The file to be uploaded.

**Example Request:**

```http
POST /files
Content-Type: multipart/form-data
```

### Create File Attribute

**Endpoint:** `POST /files/:filename`

**Description:** Creates file attributes for the specified file in DynamoDb.

**Parameters:**

- `filename` (string): The name of the file.

**Example Request:**

```http
POST /files/example.txt
```

### Create Zip Metadata

**Endpoint:** `POST /files/meta/:filename`

**Description:** Generates metadata for a given file and returns the result.

**Parameters:**

- `filename` (string): The name of the file.

**Example Request:**

```http
POST /files/meta/example.txt
```

## Task Breakdown

### 1. Create an S3 Bucket and Generate Presigned URL

- Create an S3 bucket in your AWS personal account.
- Generate a presigned URL for uploading files to this S3 bucket.
- Use the presigned URL to securely upload files to S3.

### 2. Upload Files and Process Metadata

- Upload files using the `uploadFile` endpoint.
- Once files are uploaded, call an API to read the file and calculate:
  - The total number of rows.
  - The number of unique IDs in the file.
- Store the metadata in a DynamoDB table with the following details:
  - Name of the file.
  - Number of rows.
  - Number of unique IDs in the file.

### 3. Create Metadata CSV and Zip Files

- Create an API to read the metadata from the DynamoDB table for a given file.
- Generate a CSV file (`metadata.csv`) containing the metadata.
- Zip the original file and the `metadata.csv` file.
- Use the presigned URL to upload the zipped file back to the S3 bucket.

   
