import { createServer } from 'rabiis-package';
import * as MainController from './controllers/MainController.js';
import * as StudentController from './controllers/StudentController.js';
import * as ProfController from './controllers/ProfController.js';
import * as ModuleController from './controllers/ModuleController.js';

const port = 3000

const server = createServer()

server.addRoute('get', '/', MainController.index)

server.addRoute('get', '/students', StudentController.list)
server.addRoute('get', '/students/:ine', StudentController.show)
server.addRoute('get', '/students/:ine/followed_modules', StudentController.followedModules)
server.addRoute('post', '/students', StudentController.create)
server.addRoute('put', '/students/:ine', StudentController.update)
server.addRoute('delete', '/students/:ine', StudentController.remove)

server.addRoute('get', '/profs', ProfController.list)
server.addRoute('get', '/profs/:number', ProfController.show)
server.addRoute('get', '/profs/:number/taught_modules', ProfController.taughtModules)
server.addRoute('post', '/profs', ProfController.create)
server.addRoute('put', '/profs/:number', ProfController.update)
server.addRoute('delete', '/profs/:number', ProfController.remove)

server.addRoute('get', '/modules', ModuleController.list)
server.addRoute('get', '/modules/:code', ModuleController.show)
server.addRoute('get', '/modules/:code/enrolled_students', ModuleController.enrolledStudents)
server.addRoute('get', '/modules/:code/teachers', ModuleController.teachers)
server.addRoute('post', '/modules', ModuleController.create)
server.addRoute('put', '/modules/:code', ModuleController.update)
server.addRoute('delete', '/modules/:code', ModuleController.remove)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
