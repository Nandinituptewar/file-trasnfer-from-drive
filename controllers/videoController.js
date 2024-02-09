const { downloadVideoFile, uploadVideoFileChunked } = require( '../utils/videoUtils.js' );

let downloadProgress = 0;
let uploadProgress = 0;

//download the file from a given drive location(ie. fileId) and uploads to destinationFolderId
async function fileTransfer ( req, res )
{
    try
    {
        //Ensure that both the fileId and destinationFolderId fields are provided in the request.
        if ( !req.body.hasOwnProperty( 'fileId' ) || !req.body.hasOwnProperty( 'destinationFolderId' ) )
        {
            return res.status( 400 ).json( { error: 'fileId and destinationFolderId are required' } );
        }
        const { fileId, destinationFolderId } = req.body;

        //download path in a project folder
        const downloadPath = 'video.mp4';

        // Reset progress
        downloadProgress = 0;
        uploadProgress = 0;

        // Download video file
        await downloadVideoFile( fileId, downloadPath, updateDownloadProgress );

        // Upload video file
        await uploadVideoFileChunked( downloadPath, destinationFolderId, updateUploadProgress );

        res.status( 200 ).send( 'File transfered successfully' );
    } catch ( error )
    {
        console.error( 'Error:', error );
        res.status( 400 ).send( error.toString() || 'Internal Server Error' );
    }
}


//get the status of downloadProgress and uploadProgress in percentages
function getStatus ( req, res )
{
    // Implement logic to monitor status
    res.json( {
        downloadProgress,
        uploadProgress
    } );
}


//update the downloaded progress
function updateDownloadProgress ( progress )
{
    downloadProgress = progress;
}


//update the upload progress
function updateUploadProgress ( progress )
{
    uploadProgress = progress;
}

module.exports = { fileTransfer, getStatus };
