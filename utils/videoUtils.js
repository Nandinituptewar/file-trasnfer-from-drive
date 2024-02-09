const { google } = require( 'googleapis' );
const fs = require( 'fs' );
const { Readable } = require( 'stream' );
require( 'dotenv' ).config();

// Google Drive API credentials
// Decode the base64-encoded string to obtain the credentials buffer
const credentialsBuffer = Buffer.from( process.env.CREDENTIALS, 'base64' );
// Convert the buffer to a string and parse it to obtain the credentials object
const credentials = JSON.parse( credentialsBuffer.toString() );

const auth = new google.auth.GoogleAuth( {
    credentials,
    scopes: [ process.env.GOOGLE_API_DRIVE_SCOPE_URL ],
} );

const drive = google.drive( { version: 'v3', auth } );

// Function to download video file from Google Drive
async function downloadVideoFile ( fileId, destinationPath, updateProgressCallback )
{
    // Fetch the video file from Google Drive
    const response = await drive.files.get( { fileId, alt: 'media' }, { responseType: 'stream' } );

    // Get the readable stream for the video data
    const videoStream = response.data;

    // Create a writable stream to save the video to the destination path
    const writableStream = fs.createWriteStream( destinationPath );

    // Initialize variables to track download progress
    let downloadedBytes = 0;
    let totalBytes = parseInt( response.headers[ 'content-length' ], 10 );

    // Listen for data events to track progress
    videoStream.on( 'data', ( chunk ) =>
    {
        // Calculate and update progress in percentage of downloaded file
        downloadedBytes += chunk.length;
        const progress = ( downloadedBytes / totalBytes ) * 100;
        updateProgressCallback( progress );
    } );

    // Pipe the video stream to the writable stream
    videoStream.pipe( writableStream );

    // Return a promise that resolves when the download is complete
    return new Promise( ( resolve, reject ) =>
    {
        videoStream.on( 'end', resolve );
        videoStream.on( 'error', reject );
    } );
}


// Function to upload video file to Google Drive in chunks
async function uploadVideoFileChunked ( file, folderId, updateProgressCallback )
{
    // Get the size of the file
    const fileSize = fs.statSync( file ).size;

    // Create a read stream from the file
    const fileStream = fs.createReadStream( file );

    // Define media object for file creation
    const media = {
        mimeType: 'video/mp4',
        body: fileStream,
    };

    // Define metadata for the file
    const fileMetadata = {
        name: file,
        parents: [ folderId ],
    };

    // Create the file in Google Drive
    const res = await drive.files.create( {
        requestBody: fileMetadata,
        media,
        fields: 'id',
    } );

    // Extract the file ID from the response
    const fileId = res.data.id;

    // Read the file into memory
    const fileBuffer = fs.readFileSync( file );

    // Define chunk size for uploading
    const chunkSize = 5 * 1024 * 1024; // 5MB chunk size

    // Initialize variables for tracking chunk upload progress
    let start = 0;
    let end = Math.min( chunkSize, fileSize );
    let currentChunk = 1;

    // Upload file in chunks
    while ( start < fileSize )
    {
        // Log the current chunk being uploaded
        console.log( `Uploading chunk ${ currentChunk }` );

        // Prepare the chunk of media to upload
        const mediaChunk = {
            mimeType: 'video/mp4',
            body: Readable.from( fileBuffer.slice( start, end ) ),
        };

        // Upload the chunk to Google Drive
        await drive.files.update( {
            fileId,
            media: mediaChunk,
            fields: 'id',
            range: `bytes ${ start }-${ end - 1 }/${ fileSize }`,
        } );

        // Move to the next chunk
        start = end;
        end = Math.min( start + chunkSize, fileSize );
        currentChunk++;

        // Calculate and update upload progress
        const progress = ( start / fileSize ) * 100;
        updateProgressCallback( progress );
    }

    // Log when the upload is complete
    console.log( 'Upload complete' );
}


module.exports = { downloadVideoFile, uploadVideoFileChunked };
