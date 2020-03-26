const { exec } = require('child_process')

exec('NODE_ENV=test sequelize db:migrate', function(error, stdout, stderr) {
  // command output is in stdout
  console.log(error ? 'error: ' + error : stdout ? 'Stdout: ' + stdout : 'Stderr' + stderr);
});