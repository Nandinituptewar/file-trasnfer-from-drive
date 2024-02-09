const express = require( 'express' );
const router = express.Router();
const videoController = require( '../controllers/videoController' );

router.post( '/file-transfer', videoController.fileTransfer );
router.get( '/status', videoController.getStatus );

module.exports = router;
