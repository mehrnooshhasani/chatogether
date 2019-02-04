const app = require('./app');
const http = require('http');
const { connectMongo } = require('./config/db');
const io = require('./libs/io');

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Connect to mongoDB.
connectMongo();

// Connect to Socket.io
io(server);

// Listen on provided port, on all network interfaces.
server.listen(port, () => console.log(`Server listening on port ${port}`));
