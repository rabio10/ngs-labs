import { loadData, saveData, paginate, shortName } from '../lib/helpers.js';

function findModule(modules, code) {
  return modules.find(m => m.code_module.toLowerCase() === code);
}

function toDetail(module) {
  const href = `/modules/${module.code_module.toLowerCase()}`;
  return {
    name: module.code_module,
    label: module.label,
    description: module.description,
    coefficient: module.coefficient,
    evaluations: module.evaluations,
    _links: {
      enrolled_students: {
        href: `${href}/enrolled_students`
      },
      teachers: {
        href: `${href}/teachers`
      }
    }
  };
}

function applyChanges(module, body) {
  if (body.label !== undefined) module.label = body.label;
  if (body.description !== undefined) module.description = body.description;
  if (body.coefficient !== undefined) module.coefficient = body.coefficient;
  if (body.evaluations !== undefined) module.evaluations = body.evaluations;
}

export function list(req, res) {
  const { modules } = loadData();
  const items = modules.map(module => ({
    name: module.code_module,
    _links: {
      self: {
        href: `/modules/${module.code_module.toLowerCase()}`
      }
    }
  }));

  res.json(paginate(items, req.query, '/modules'));
}

export function show(req, res) {
  const { modules } = loadData();
  const module = findModule(modules, req.params.code);
  if (!module) {
    return res.status(404).json({ error: 'module not found' });
  }

  res.json(toDetail(module));
}

export function enrolledStudents(req, res) {
  const { modules } = loadData();
  const module = findModule(modules, req.params.code);
  if (!module) {
    return res.status(404).json({ error: 'module not found' });
  }

  const items = module.registeredStudents.map(ine => ({
    ine,
    href: `/students/${ine}`
  }));

  res.json(paginate(items, req.query, `/modules/${req.params.code}/enrolled_students`));
}

export function teachers(req, res) {
  const { modules, profs } = loadData();
  const module = findModule(modules, req.params.code);
  if (!module) {
    return res.status(404).json({ error: 'module not found' });
  }

  const items = module.profs
    .map(number => profs.find(p => p.number === number))
    .filter(Boolean)
    .map(prof => ({
      name: shortName(prof),
      href: `/profs/${prof.number}`
    }));

  res.json(paginate(items, req.query, `/modules/${req.params.code}/teachers`));
}

export function create(req, res) {
  const data = loadData();
  const module = {
    code_module: req.body.name,
    coefficient: req.body.coefficient,
    description: req.body.description,
    label: req.body.label,
    evaluations: req.body.evaluations,
    registeredStudents: [],
    profs: []
  };
  data.modules.push(module);
  saveData(data);

  res.status(201).json(toDetail(module));
}

export function update(req, res) {
  const data = loadData();
  const module = findModule(data.modules, req.params.code);
  if (!module) {
    return res.status(404).json({ error: 'module not found' });
  }

  applyChanges(module, req.body);
  saveData(data);

  res.json(toDetail(module));
}

export function remove(req, res) {
  const data = loadData();
  const index = data.modules.findIndex(m => m.code_module.toLowerCase() === req.params.code);
  if (index === -1) {
    return res.status(404).json({ error: 'module not found' });
  }

  data.modules.splice(index, 1);
  saveData(data);

  res.status(204).end();
}
