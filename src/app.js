const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const demoRoutes = require("./routes/demoRoutes");
app.use("/api", demoRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
