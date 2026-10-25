import * as fs from 'node:fs';

const DATA_FILE = new URL('../data.json', import.meta.url);

export function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

export function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
}

export function shortName(person) {
  return `${person.lastname} ${person.firstname[0]}.`;
}

function toPositiveInt(value, fallback) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export function paginate(items, query, basePath) {
  const page = toPositiveInt(query.page, 1);
  const limit = toPositiveInt(query.limit, 50);
  const total = items.length;

  const links = { self: `${basePath}?page=${page}&limit=${limit}` };
  if (page * limit < total) {
    links.next = `${basePath}?page=${page + 1}&limit=${limit}`;
  }
  if (page > 1) {
    links.previous = `${basePath}?page=${page - 1}&limit=${limit}`;
  }

  return {
    data: items.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total },
    links
  };
}
