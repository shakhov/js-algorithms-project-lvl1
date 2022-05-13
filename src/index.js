import _ from 'lodash';

const termRegexp = () => /[\w']+/g;

const getTextTerms = (text = '') => (
  text
    .match(termRegexp())
    .map((term) => term.toLowerCase())
);

const orderByRelevance = (records) => (
  _.orderBy(records, ['totalScore'], ['desc'])
);

const buildDocumentIndex = (({ id, text }, initialIndex = {}) => {
  const documentTerms = getTextTerms(text);
  console.log(documentTerms);
  const termsCount = documentTerms.length;
  return documentTerms.reduce((indexAcc, term) => {
    const termData = indexAcc[term] || [];
    const docData = termData.find((item) => item.id === id);
    const rawCount = (docData?.rawCount || 0) + 1;
    const termFrequency = rawCount / termsCount;

    return {
      ...indexAcc,
      [term]: termData
        .filter((item) => item.id !== id)
        .concat({ id, rawCount, termFrequency }),
    };
  }, initialIndex);
});

const buildSearchEngine = (documents = []) => {
  const documentsCount = documents.length;

  const invertedIndex = documents.reduce((indexAcc, document) => (
    buildDocumentIndex(document, indexAcc)
  ), {});

  const inverseDocumentFrequency = (term) => {
    const docsContainingTermCount = invertedIndex[term].length;
    return Math.log(1.0 + documentsCount / docsContainingTermCount);
  };

  const search = (query) => {
    if (query === '') {
      return [];
    }

    const searchTerms = getTextTerms(query);

    const searchResult = searchTerms
      .map((term) => [term, invertedIndex[term] || []])
      .reduce((resultAcc, [term, termData]) => (
        termData.reduce((termAcc, { id, termFrequency }) => {
          const docData = termAcc.find((item) => item.id === id) || [];
          const tfIdf = termFrequency * inverseDocumentFrequency(term);
          const totalScore = (docData.totalScore || 0) + tfIdf;
          return termAcc
            .filter((item) => item.id !== id)
            .concat({
              id, totalScore,
            });
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
