import { loadData, saveData, paginate, shortName } from '../lib/helpers.js';

function toDetail(student) {
  return {
    firstName: student.firstname,
    lastName: student.lastname,
    ine: student.ine,
    email: student.email,
    birthDate: student.birthdate,
    _links: {
      followed_modules: {
        href: `/students/${student.ine}/followed_modules`
      }
    }
  };
}

function applyChanges(student, body) {
  if (body.firstName !== undefined) student.firstname = body.firstName;
  if (body.lastName !== undefined) student.lastname = body.lastName;
  if (body.email !== undefined) student.email = body.email;
  if (body.birthDate !== undefined) student.birthdate = body.birthDate;
}

export function list(req, res) {
  const { students } = loadData();
  const items = students.map(student => ({
    name: shortName(student),
    ine: student.ine,
    _links: {
      self: {
        href: `/students/${student.ine}`
      }
    }
  }));

  res.json(paginate(items, req.query, '/students'));
}

export function show(req, res) {
  const { students } = loadData();
  const student = students.find(s => s.ine === req.params.ine);
  if (!student) {
    return res.status(404).json({ error: 'student not found' });
  }

  res.json(toDetail(student));
}

export function followedModules(req, res) {
  const { students } = loadData();
  const student = students.find(s => s.ine === req.params.ine);
  if (!student) {
    return res.status(404).json({ error: 'student not found' });
  }

  const items = student.followed_modules.map(code => ({
    name: code,
    href: `/modules/${code.toLowerCase()}`
  }));

  res.json(paginate(items, req.query, `/students/${student.ine}/followed_modules`));
}

export function create(req, res) {
  const data = loadData();
  const student = {
    lastname: req.body.lastName,
    firstname: req.body.firstName,
    email: req.body.email,
    followed_modules: [],
    birthdate: req.body.birthDate,
    ine: req.body.ine
  };
  data.students.push(student);
  saveData(data);

  res.status(201).json(toDetail(student));
}

export function update(req, res) {
  const data = loadData();
  const student = data.students.find(s => s.ine === req.params.ine);
  if (!student) {
    return res.status(404).json({ error: 'student not found' });
  }

  applyChanges(student, req.body);
  saveData(data);

  res.json(toDetail(student));
}

export function remove(req, res) {
  const data = loadData();
  const index = data.students.findIndex(s => s.ine === req.params.ine);
  if (index === -1) {
    return res.status(404).json({ error: 'student not found' });
  }

  data.students.splice(index, 1);
  saveData(data);

  res.status(204).end();
}
