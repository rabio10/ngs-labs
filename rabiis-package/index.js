import http from 'node:http';
import bodyParser from 'body-parser';

function handleError(err, res) {
  if (err.expose) {
    return res.status(err.status).json({ error: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

export function createServer() {
  const routes = []
  const jsonParser = bodyParser.json()

  const server = http.createServer((req, res) => {
    res.status = code => {
      res.statusCode = code
      return res
    }
    res.json = data => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(data))
    }
    res.setHeader('Access-Control-Allow-Origin', '*')

    const url = new URL(req.url, 'http://localhost')
    req.query = Object.fromEntries(url.searchParams)

    const route = routes.find(r => r.method === req.method && r.regexp.test(url.pathname))
    if (!route) {
      res.statusCode = 404
      return res.end(`Cannot ${req.method} ${url.pathname}`)
    }

    const values = url.pathname.match(route.regexp).slice(1)
    req.params = Object.fromEntries(route.names.map((name, i) => [name, values[i]]))

    jsonParser(req, res, err => {
      if (err) {
        return handleError(err, res)
      }
      try {
        route.handler(req, res)
      } catch (err) {
        handleError(err, res)
      }
    })
  })

  server.addRoute = (method, path, handler) => {
    const names = [...path.matchAll(/:([a-zA-Z0-9]+)/g)].map(m => m[1])
    const regexp = new RegExp('^' + path.replace(/:[a-zA-Z0-9]+/g, '([a-zA-Z0-9-]+)') + '/?$')
    routes.push({ method: method.toUpperCase(), regexp, names, handler })
  }

  return server
}
