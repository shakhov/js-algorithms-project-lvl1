const getTextWords = (text = '') => (
  text.split(' ').filter((w) => w !== '')
);

const buildDocumentIndex = (({ id, text }, initialIndex = {}) => {
  const documentWords = getTextWords(text);
  return documentWords.reduce((acc, word) => {
    const documentIds = acc[word] || new Set();
    return { ...acc, [word]: documentIds.add(id) };
  }, initialIndex);
});

const buildSearchEngine = (documents = []) => {
  const invertedIndex = documents.reduce((indexAcc, document) => (
    buildDocumentIndex(document, indexAcc)
  ), {});

  const search = (word) => [...(invertedIndex[word] || [])];
  return {
    documents,
    search,
  };
};

export default buildSearchEngine;
