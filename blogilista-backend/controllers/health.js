const healthRouter = require("express").Router();

healthRouter.get('/', (request, response) => {
  response.send('ok')
})

module.exports = healthRouter;