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

const buildDocumentIndex = (({ id, text }) => {
  const documentTerms = getTextTerms(text);
  const totalTermsCount = documentTerms.length;
  const termsCount = _.countBy(documentTerms);
  return _.mapValues(termsCount, (rawCount) => {
    const termFrequency = rawCount / totalTermsCount;
    return [{ id, rawCount, termFrequency }];
  });
});

const search = (invertedIndex, getIdf) => (query) => {
  if (query === '') {
    return [];
  }

  const searchTerms = getTextTerms(query);

  const searchResult = searchTerms
    .map((term) => [term, invertedIndex[term] || []])
    .reduce((resultAcc, [term, termData]) => (
      termData.reduce((termAcc, { id, termFrequency }) => {
        const docData = termAcc.find((item) => item.id === id) || [];
        const tfIdf = termFrequency * getIdf(term);
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

const buildSearchEngine = (documents = []) => {
  const documentsCount = documents.length;

  const invertedIndex = _.mergeWith(
    ...documents.map((document) => buildDocumentIndex(document)),
    (objValue, srcValue) => (objValue || []).concat(srcValue),
  );

  const inverseDocumentFrequency = (term) => {
    const docsContainingTermCount = invertedIndex[term].length;
    return Math.log(1.0 + documentsCount / docsContainingTermCount);
  };

  return {
    documents,
    search: search(invertedIndex, inverseDocumentFrequency),
  };
};

export default buildSearchEngine;
