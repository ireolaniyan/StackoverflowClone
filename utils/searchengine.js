const esClient = require('../config/elastic.connection')


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

    // console.log("res ", result);

    await esClient.indices.refresh({ index: 'stackoverflow' })
  } catch (error) {
    console.log('Create Question Index Error ', error);
  }
}

exports.searchEngine = async (searchText) => {
  try {

    const result = await esClient.search({
      index: 'stackoverflow',
      body: {
        query: {
          match: { question_title: searchText.text }
        },
      }
    });

    console.log("--- Response ---");
    console.log(result);

    if (result.hits.total < 1) {
      return {
        message: "No results for this search"
      }
    }

    console.log("--- Hits ---");
    result.hits.hits.forEach(function (hit) {
      console.log(hit);
    })
  } catch (error) {
    console.log('error ', error);
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