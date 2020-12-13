const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')

// Checks if PORT and PORT_DEV are available and suggests alternatives if not
module.exports = async () => {
  const port = (process.env.PORT && parseInt(process.env.PORT)) || 9090
  const actualPort = await choosePort(process.env.HOST, port)

  return actualPort
}
