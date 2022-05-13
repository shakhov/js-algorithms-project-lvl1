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
    const wordData = indexAcc[word] || [];
    const docData = wordData.find((item) => item.id === id);
    const rawCount = (docData?.rawCount || 0) + 1;
    const newWordData = wordData
          .filter((item) => item.id !== id)
          .concat({ id, rawCount });
    return {...indexAcc, [word]: newWordData };
  }, initialIndex);
});

const buildSearchEngine = (documents = []) => {
  const invertedIndex = documents.reduce((indexAcc, document) => (
    buildDocumentIndex(document, indexAcc)
  ), {});

  console.log(invertedIndex);

  const search = (word) => {
    if (word === '') {
      return [];
    }

    const terms = word.match(wordRegexp());

    const searchResult = terms
      .map((term) => invertedIndex[term] || [])
      .reduce((resultAcc, termData) => (
        termData.reduce((termAcc, { id, rawCount }) => {
          const docData = termAcc.find((item) => item.id === id) || [];
          const uniqueCount = (docData.uniqueCount || 0) + 1;
          const totalCount = (docData.totalCount || 0) + rawCount;
          return termAcc
            .filter((item) => item.id !== id)
            .concat({ id, uniqueCount, totalCount });
        }, resultAcc)
      ), []);

    return orderByRelevance(searchResult).map(({ id }) => id);
  };

  return {
    documents,
    search,
  };
};

export default buildSearchEngine;
