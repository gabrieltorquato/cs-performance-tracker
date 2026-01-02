const { spawn } = require("child_process");
const path = require("path");

function parseDemoWithGo(demoPath) {
  return new Promise((resolve, reject) => {
    const parserPath = path.resolve(
      __dirname,
      "../../parsers/cs-demo-parser-cli.exe"
    );

    const process = spawn(parserPath, [demoPath]);

    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Parser falhou (${code}): ${errorOutput}`)
        );
      }

      try {
        const json = JSON.parse(output);
        resolve(json);
      } catch (err) {
        reject(new Error("Falha ao parsear JSON do parser Go"));
      }
    });
  });
}

module.exports = { parseDemoWithGo };
