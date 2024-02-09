const express = require( 'express' );
const videoRoutes = require( './routes/videoRoutes' );
require( 'dotenv' ).config();

const app = express();
const PORT = process.env.PORT;

app.use( express.json() );
app.use( '/videos', videoRoutes );


app.listen( PORT, () =>
{
    console.log( `Server is running on port ${ PORT }` );
} );
