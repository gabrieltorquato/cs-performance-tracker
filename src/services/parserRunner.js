const { execFile } = require("child_process");
const path = require("path");

function runDemoParser(demoPath) {
  return new Promise((resolve, reject) => {
    const parserPath = path.resolve(
      __dirname,
      "../../parsers/cs-demo-parser-cli.exe"
    );

    execFile(
      parserPath,
      [demoPath],
      { maxBuffer: 1024 * 1024 * 10 },
      (error, stdout, stderr) => {
        if (error) {
          console.error("PARSER ERROR:", stderr);
          return reject(error);
        }

        try {
          const data = JSON.parse(stdout);
          resolve(data);
        } catch (err) {
          console.error("JSON PARSE ERROR:", stdout);
          reject(err);
        }
      }
    );
  });
}

module.exports = {
  runDemoParser,
};
