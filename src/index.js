import _ from 'lodash';

const termRegexp = () => /[\w']+/g;

const getTextTerms = (text = '') => (
  text
    .match(termRegexp())
    .map((term) => term.toLowerCase())
);

const buildDocumentIndex = (({ id, text }) => {
  const documentTerms = getTextTerms(text);
  const totalTermsCount = documentTerms.length;
  const countByTerms = _.countBy(documentTerms);
  return _.mapValues(countByTerms, (rawCount) => {
    const termFrequency = rawCount / totalTermsCount;
    return [{ id, rawCount, termFrequency }];
  });
});

const search = (invertedIndex, getIdf) => (query) => {
  if (query === '') {
    return [];
  }

  const searchTerms = getTextTerms(query);

  const documentsContainingTerms = _.flatMap(searchTerms, (term) => {
    if (!invertedIndex[term]) {
      return {};
    }
    const termIdf = getIdf(term);
    return invertedIndex[term].map(({ id, termFrequency }) => {
      const score = termFrequency * termIdf;
      return { [id]: score };
    });
  });

  const documentsScores = _.mergeWith(
    ...documentsContainingTerms,
    (totalScore, score) => (totalScore || 0) + score,
  );

  const uniqueDocuments = Object.keys(documentsScores);
  return uniqueDocuments.sort((a, b) => documentsScores[b] - documentsScores[a]);
};

const buildSearchEngine = (documents = []) => {
  const documentsCount = documents.length;

  const invertedIndex = _.mergeWith(
    ...documents.map((document) => buildDocumentIndex(document)),
    (objValue, srcValue) => (objValue || []).concat(srcValue),
  );

  const inverseDocumentFrequency = (term) => {
    const documentsContainingTermCount = invertedIndex[term].length;
    return Math.log(1.0 + documentsCount / documentsContainingTermCount);
  };

  return {
    documents,
    search: search(invertedIndex, inverseDocumentFrequency),
  };
};

export default buildSearchEngine;
