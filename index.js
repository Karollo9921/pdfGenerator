const express = require("express");
const ApiRoutes = require("./routes/index");

const app = express();
app.use('/api', new ApiRoutes().router);

app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
});