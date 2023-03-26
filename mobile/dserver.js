const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const committedPath = path.join(__dirname, 'db.json');
const livePath = path.join(__dirname, 'db-live.json');
// TODO Smarter algorithm that merges upstream edits to the mock data without forcing user to delete local mock data
if (!fs.existsSync(livePath)) {
    console.log('*** Copying mock database from db.json to db-live.json... ***');
    fs.copyFileSync(committedPath, livePath);
}
const router = jsonServer.router(livePath);
console.log('To commit changes to the mock database, add them to db.json');
console.log('To test changes to the mock database locally, add them directly to db-live.json');
console.log('To upstream edits to the mock database, delete db-live.json and restart the dummy server');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// Add custom routes before JSON Server router...

// Use default router
server.use(router);

router.render = (req, res) => {
    if (req.path.includes("/users")) {
        res.locals.data["userId"] = res.locals.data["id"];
        delete res.locals.data["id"];
        res.jsonp(res.locals.data);
    } else if (req.path.includes("/periods")) {
        res.jsonp(res.locals.data["fakePeriod"]);
    } else {
        res.jsonp(res.locals.data);
    }
}

server.listen(3000, () => {
    console.log('JSON Server is running');
});
