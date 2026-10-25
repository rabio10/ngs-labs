import { loadData, shortName } from '../lib/helpers.js';

export function index(req, res) {
  const jsonData = loadData();
  const head = jsonData.responsibles.map(id => {
    const prof = jsonData.profs.find(p => p.number === id);
    return {
      name: shortName(prof),
      href: `/profs/${prof.number}`
    };
  });
  const responseData = {
    name: jsonData.name,
    _links: {
      students: {
        href: `/students`
      },
      profs: {
        href: `/profs`
      },
      modules: {
        href: `/modules`
      },
      head: head
    }
  };

  res.json(responseData);
}
