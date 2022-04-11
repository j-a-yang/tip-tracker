const express = require("express");
require('./db/mongoose'); /* ensure mongoose.js runs, connecting to db */
const userRouter = require("./routers/user");
const shiftRouter = require("./routers/shift");
const auth = require("./middleware/auth");

const app = express();

/* deployment environment specified port or 3000 */
const port = process.env.PORT || 3000;

// app.use(auth);
/* configure express: this will automatically parse incoming json to object
so we can easily access data with request handlers  */
app.use(express.json());
app.use(userRouter);
app.use(shiftRouter);

app.listen(port, () => {
    console.log("server started on port " + port);
});