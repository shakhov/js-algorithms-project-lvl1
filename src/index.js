import _ from 'lodash';

const wordRegexp = () => /[\w']+/g;

const getTextWords = (text = '') => (
  text.match(wordRegexp())
);

const orderByRelevance = (records) => (
  _.orderBy(records, ['uniqueCount', 'totalCount'], ['desc', 'desc'])
);

const buildDocumentIndex = (({ id, text }, initialIndex = {}) => {
  const documentWords = getTextWords(text);

  return documentWords.reduce((indexAcc, word) => {
    const wordData = indexAcc[word] || {};
    const docData = wordData[id] || {};
    const freq = (docData.freq || 0) + 1;
    wordData[id] = { id, freq };
    return { ...indexAcc, [word]: wordData };
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

    const terms = word.match(wordRegexp());

    const searchResult = terms
      .map((term) => invertedIndex[term] || [])
      .map((termData) => Object.values(termData))
      .reduce((resultAcc, termData) => (
        termData.reduce((termAcc, { id, freq }) => {
          const docData = termAcc[id] || {};
          const uniqueCount = (docData.uniqueCount || 0) + 1;
          const totalCount = (docData.totalCount || 0) + freq;
          return { ...termAcc, [id]: { id, uniqueCount, totalCount } };
        }, resultAcc)
      ), {});

    return orderByRelevance(Object.values(searchResult)).map(({ id }) => id);
  };

  return {
    documents,
    search,
  };
};

export default buildSearchEngine;
