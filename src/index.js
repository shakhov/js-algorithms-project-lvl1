const wordRegexp = () => /[\w']+/g;

const getTextWords = (text = '') => (
  text.match(wordRegexp())
);

const buildDocumentIndex = (({ id, text }, initialIndex = {}) => {
  const documentWords = getTextWords(text);
  return documentWords.reduce((indexAcc, word) => {
    const documentIds = indexAcc[word] || new Set();
    return { ...indexAcc, [word]: documentIds.add(id) };
  }, initialIndex);
});

const buildSearchEngine = (documents = []) => {
  const invertedIndex = documents.reduce((indexAcc, document) => (
    buildDocumentIndex(document, indexAcc)
  ), {});

  const search = (word) => {
    if (word === '') {
      return [];
    }
    const [term] = word.match(wordRegexp());
    return [...(invertedIndex[term] || [])];
  };

  return {
    documents,
    search,
  };
};

export default buildSearchEngine;
