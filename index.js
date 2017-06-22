const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server)

// Define the number of cols/rows for the canvas
const CANVAS_ROWS = 50
const CANVAS_COLS = 50

// Create the canvas object so we can store its state locally
var canvas = [ ]

// Populate the canvas with initial values
for(var row = 0; row < CANVAS_ROWS; row++){
  canvas[row] = [ ]
  
  for(var col = 0; col < CANVAS_COLS; col++){
    canvas[row][col] = "#FFF"
  }
}

// Make our `public` folder accessible
app.use(express.static("public"))

// Listen for connections from socket.io clients
io.on("connection", socket => {
  // Send the entire canvas to the user when they connect
  socket.emit("canvas", canvas)

  // This is fired when the client places a color on the canvas
  socket.on("color", data => {
    // First we validate that the position on the canvas exists
    if(data.row <= CANVAS_ROWS && data.row > 0 && data.col <= CANVAS_COLS && data.col > 0){
      // Update the canvas
      canvas[data.row - 1][data.col - 1] = data.color
      // Send the new canvas to all connected clients
      io.emit("canvas", canvas)
    }
  })
})

// Start listening for connections
server.listen(process.env.PORT || 3000)