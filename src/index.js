import _ from 'lodash';

const wordRegexp = () => /[\w']+/g;

const getTextWords = (text = '') => (
  text.match(wordRegexp())
);

const orderByFreq = (records, order = 'desc') => (
  _.orderBy(Object.values(records), ['freq'], [order])
);

const buildDocumentIndex = (({ id, text }, initialIndex = {}) => {
  const documentWords = getTextWords(text);

  return documentWords.reduce((indexAcc, word) => {
    const wordData = indexAcc[word] || {};
    const docData = wordData[id] || {};
    const freq = (docData.freq || 0) + 1;
    _.set(wordData, [id, 'id'], id);
    _.set(wordData, [id, 'freq'], freq);
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

    const [term] = word.match(wordRegexp());
    const wordOccurences = invertedIndex[term] || [];

    return orderByFreq(wordOccurences, 'desc').map(({ id }) => id);
  };

  return {
    documents,
    search,
  };
};

export default buildSearchEngine;
