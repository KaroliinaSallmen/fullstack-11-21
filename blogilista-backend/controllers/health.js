const healthRouter = require("express").Router();

healthRouter.get('/', (request, response) => {
    // eslint-disable-next-line no-constant-condition
  if (true) throw('error...  ')
  response.send('ok')
})

module.exports = healthRouter;