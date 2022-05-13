const buildSearchEngine = (docs = []) => {
  const search = (word) => (
    docs
      .filter(({ text }) => text.split(' ').includes(word))
      .map(({ id }) => id)
  );

  return { docs, search };
};

export default buildSearchEngine;
