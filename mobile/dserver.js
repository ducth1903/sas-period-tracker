const path = require('path')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
// Add custom routes before JSON Server router...

// Use default router
server.use(router)

router.render = (req, res) => {
    if (req.path.includes("/users")) {
        let user_id = res.locals.data["id"]
        res.locals.data["userId"] = user_id
        delete res.locals.data["id"]
        res.jsonp(res.locals.data)
    } else if (req.path.includes("/periods")) {
        res.jsonp(res.locals.data["fakePeriod"])
    } else {
        res.jsonp(res.locals.data)
    }
}

server.listen(3000, () => {
    console.log('JSON Server is running')
})