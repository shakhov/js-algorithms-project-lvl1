import _ from 'lodash';

const termRegexp = () => /[\w']+/g;

const getTextTerms = (text = '') => (
  text.match(termRegexp())
);

const orderByRelevance = (records) => (
  _.orderBy(records, ['uniqueCount', 'totalTfIdf'], ['desc', 'desc'])
);

const buildDocumentIndex = (({ id, text }, initialIndex = {}) => {
  const documentTerms = getTextTerms(text);
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
    const docs = invertedIndex[term];
    return Math.log10(documentsCount / docs.length);
  };

  const search = (request) => {
    if (request === '') {
      return [];
    }

    const searchTerms = request.match(termRegexp());

    const searchResult = searchTerms
      .map((term) => [term, invertedIndex[term] || []])
      .reduce((resultAcc, [term, termData]) => (
        termData.reduce((termAcc, { id, termFrequency, rawCount }) => {
          const docData = termAcc.find((item) => item.id === id) || [];
          const uniqueCount = (docData.uniqueCount || 0) + 1;
          const totalCount = (docData.totalCount || 0) + rawCount;
          const tfIdf = termFrequency * inverseDocumentFrequency(term);
          const totalTfIdf = (docData.totalTfIdf || 0) + tfIdf;
          return termAcc
            .filter((item) => item.id !== id)
            .concat({
              id, uniqueCount, totalCount, totalTfIdf,
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
