const express = require('express')
const app = express();
const path = require('path')
let PORT = 3500;

app.use(express.static(path.join(__dirname,'public')))

app.use("/home", (req, res) =>{
    res.sendFile(path.join(__dirname,'../frontend/views/index.html'));
});


//starting the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})