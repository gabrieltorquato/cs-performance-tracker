const express = require("express");
const app = express();

const demoRoutes = require("./routes/demoRoutes");

app.use(express.json());

// Rotas
app.use("/api", demoRoutes);

app.get("/", (req, res) => {
  res.send("CS Tracker rodando 🔥");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
