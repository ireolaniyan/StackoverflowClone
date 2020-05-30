const esClient = require('../config/elastic.connection')

// es documentation: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/introduction.html

// esClient.cluster.health({}, function (err, resp, status) {
//   console.log("-- Client Health --", resp);
// });


exports.createQuestionIndex = async (question_details) => {
  try {

    await esClient.index({
      index: 'stackoverflow',
      body: {
        question_id: question_details._id,
        user_id: question_details.user_id,
        question_title: question_details.title,
        question_content: question_details.content,
        upvotes: question_details.upvote,
        downvotes: question_details.downvote,
      }
    })

    // force an index refresh at this point, otherwise we will not get any result in the consequent search
    await esClient.indices.refresh({ index: 'stackoverflow' })
  } catch (error) {
    console.log('Create Question Index Error ', error);
  }
}

exports.searchEngine = async (searchText) => {
  try {

    let hits = []
    const result = await esClient.search({
      index: 'stackoverflow',
      body: {
        query: {
          match: { question_title: searchText.text }
        },
      }
    });

    // console.log("result ", result);

    if (result.hits.total < 1) {
      return {
        message: "No results for this search"
      }
    }

    result.hits.hits.forEach(function (hit) {
      // console.log("hits ", hit);
      hits.push({
        eSearchId: hit._id,
        question_id: hit._source.question_id,
        user_id: hit._source.user_id,
        question_title: hit._source.question_title,
        question_content: hit._source.question_content,
        upvotes: hit._source.upvotes,
        downvotes: hit._source.downvotes
      })
    })

    return {
      message: "Search results",
      data: hits
    }
  } catch (error) {
    console.log('Search Engine Error ', error);
  }
}

// async function deleteQuestionIndex() {
//   try {
//     const result = await esClient.delete({
//       index: 'stackoverflow',
//       id: 'HP2sYnIBn79N8XlC2zBf'
//     })

//     console.log('delete res ', result);

//   } catch (error) {
//     console.log('error ', error);
//   }
// }

// async function countQuestionIndices() {
//   try {
//     const result = await esClient.count({
//       index: 'stackoverflow'
//     })

//     console.log('count ', result);

//   } catch (error) {
//     console.log('error ', error);

//   }
// }

// deleteQuestionIndex()