const express = require('express')
const route = require("./routers/api-router");
const app = express();
const cors = require('cors')

app.use(cors());
app.use("/", route);

let PORT = 3000;

//starting the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})