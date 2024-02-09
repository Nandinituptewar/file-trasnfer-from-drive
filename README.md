# File Server Service for Google Drive

This file server service facilitates users to download and upload files from Google Drive while providing real-time status updates on the progress of their uploads and downloads.

## Environment Variables

These are the environment variables to be provided while docker run or local run.
To run the service locally using environment variables we need to create .env file in root directory of the code.
To run this service using docker we need to pass env variables while creating the docker container.
Following are the env varibales used in the service.

-PORT: The port number is retrieved from an environment variable.
-CREDENTIALS: base 64 encoded google drive api credentials
-GOOGLE_API_DRIVE_SCOPE_URL:   google drive scope api url

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.

## How to run on local machine?

You can run this service on your local machine in two ways.

1. By simply updating the configuration values in .env file
2. By using [dotenv](https://www.npmjs.com/package/dotenv) npm module. Just create .env file in root directory of the code. Add all the env variables which are given below with the values. Finally run the service using the command node start

node start


## Features

- **Download and Upload Files**: Allows users to download files from Google Drive and upload to given Drive location.
- **Easy Integration**: Simple to integrate into existing Node.js projects.

## API Documentation

| Method | Url           | Description                 |
| ------ | ------------- | --------------------------- |
| POST   | `/videos/file-transfer`     | file transfer from one drive to another drive  |
| GET    | `/videos/status`     | get the status of file transfer |


**_File_Transfer_**


Request Payload

```
{
    "fileId": "",
    "destinationFolderId": ""
}
```

Response

```
{
"statusCode": 200,
"message": "File transfered successfully",
}
```

## Usage

1. Set up your Google Drive API credentials. Follow the instructions [here](https://developers.google.com/drive/api/v3/quickstart/nodejs) to create and download your credentials file (`credentials.json`).
2. encode  your `credentials.json` file object and add it in the env variable of this project.
3. Start the server by running `npm start`.
4. Access the file server through your browser or HTTP client.


## Dependencies

- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [googleapis](https://github.com/googleapis/google-api-nodejs-client): Google APIs client library for Node.js.

## Authors

- Nandini Ashok Tuptewar

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
