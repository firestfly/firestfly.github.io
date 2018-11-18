/**
 * Created by deepsky on 2017/3/29.
 */
// app.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('test.js')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    // Continue to JSON Server router
    next()
})

server.use(router)
server.listen(8081, () => {
    console.log('RM Mock Server is running')
    console.log('> open http://localhost:8081' + '\n')
})