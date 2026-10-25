import { loadData, saveData, paginate, shortName } from '../lib/helpers.js';

function toDetail(prof) {
  return {
    firstName: prof.firstname,
    lastName: prof.lastname,
    number: prof.number,
    email: prof.email,
    birthDate: prof.birthdate,
    _links: {
      taught_modules: {
        href: `/profs/${prof.number}/taught_modules`
      }
    }
  };
}

function applyChanges(prof, body) {
  if (body.firstName !== undefined) prof.firstname = body.firstName;
  if (body.lastName !== undefined) prof.lastname = body.lastName;
  if (body.email !== undefined) prof.email = body.email;
  if (body.birthDate !== undefined) prof.birthdate = body.birthDate;
  if (body.office !== undefined) prof.office = body.office;
  if (body.category !== undefined) prof.category = body.category;
}

export function list(req, res) {
  const { profs } = loadData();
  const items = profs.map(prof => ({
    name: shortName(prof),
    number: prof.number,
    _links: {
      self: {
        href: `/profs/${prof.number}`
      }
    }
  }));

  res.json(paginate(items, req.query, '/profs'));
}

export function show(req, res) {
  const { profs } = loadData();
  const prof = profs.find(p => p.number === req.params.number);
  if (!prof) {
    return res.status(404).json({ error: 'prof not found' });
  }

  res.json(toDetail(prof));
}

export function taughtModules(req, res) {
  const { profs } = loadData();
  const prof = profs.find(p => p.number === req.params.number);
  if (!prof) {
    return res.status(404).json({ error: 'prof not found' });
  }

  const items = prof.taught_modules.map(code => ({
    name: code,
    href: `/modules/${code.toLowerCase()}`
  }));

  res.json(paginate(items, req.query, `/profs/${prof.number}/taught_modules`));
}

export function create(req, res) {
  const data = loadData();
  const prof = {
    lastname: req.body.lastName,
    firstname: req.body.firstName,
    email: req.body.email,
    taught_modules: [],
    birthdate: req.body.birthDate,
    number: req.body.number,
    office: req.body.office,
    category: req.body.category
  };
  data.profs.push(prof);
  saveData(data);

  res.status(201).json(toDetail(prof));
}

export function update(req, res) {
  const data = loadData();
  const prof = data.profs.find(p => p.number === req.params.number);
  if (!prof) {
    return res.status(404).json({ error: 'prof not found' });
  }

  applyChanges(prof, req.body);
  saveData(data);

  res.json(toDetail(prof));
}

export function remove(req, res) {
  const data = loadData();
  const index = data.profs.findIndex(p => p.number === req.params.number);
  if (index === -1) {
    return res.status(404).json({ error: 'prof not found' });
  }

  data.profs.splice(index, 1);
  saveData(data);

  res.status(204).end();
}
