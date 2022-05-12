const buildSearchEngine = (docs) => (
  { search: () => docs.map(({ id }) => id) }
);

export default buildSearchEngine;
