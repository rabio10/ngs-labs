import express from 'express';
import bodyParser from 'body-parser';
import * as MainController from './controllers/MainController.js';
import * as StudentController from './controllers/StudentController.js';
import * as ProfController from './controllers/ProfController.js';
import * as ModuleController from './controllers/ModuleController.js';

const app = express()
const port = 3000

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

app.use(bodyParser.json())

app.get('/', MainController.index)

app.get('/students', StudentController.list)
app.get('/students/:ine', StudentController.show)
app.get('/students/:ine/followed_modules', StudentController.followedModules)
app.post('/students', StudentController.create)
app.put('/students/:ine', StudentController.update)
app.delete('/students/:ine', StudentController.remove)

app.get('/profs', ProfController.list)
app.get('/profs/:number', ProfController.show)
app.get('/profs/:number/taught_modules', ProfController.taughtModules)
app.post('/profs', ProfController.create)
app.put('/profs/:number', ProfController.update)
app.delete('/profs/:number', ProfController.remove)

app.get('/modules', ModuleController.list)
app.get('/modules/:code', ModuleController.show)
app.get('/modules/:code/enrolled_students', ModuleController.enrolledStudents)
app.get('/modules/:code/teachers', ModuleController.teachers)
app.post('/modules', ModuleController.create)
app.put('/modules/:code', ModuleController.update)
app.delete('/modules/:code', ModuleController.remove)

app.use((err, req, res, next) => {
  if (err.expose) {
    return res.status(err.status).json({ error: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
