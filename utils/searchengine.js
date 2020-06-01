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

exports.createAnswerIndex = async (answer_details) => {
  try {

    await esClient.index({
      index: 'stackoverflow',
      body: {
        answer_id: answer_details._id,
        user_id: answer_details.user_id,
        answer: answer_details.answer,
        upvotes: answer_details.upvote,
        downvotes: answer_details.downvote,
      }
    })

    // force an index refresh at this point, otherwise we will not get any result in the consequent search
    await esClient.indices.refresh({ index: 'stackoverflow' })
  } catch (error) {
    console.log('Create Answer Index Error ', error);
  }
}

exports.questionSearchEngine = async (searchText) => {
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
    console.log('Question Search Engine Error ', error);
  }
}

exports.answerSearchEngine = async (searchText) => {
  try {
    let hits = []
    const result = await esClient.search({
      index: 'stackoverflow',
      body: {
        query: {
          match: { answer: searchText.text }
        },
      }
    });

    if (result.hits.total < 1) {
      return {
        message: "No results for this search"
      }
    }

    result.hits.hits.forEach(function (hit) {
      hits.push({
        answer_id: hit._source.answer_id,
        user_id: hit._source.user_id,
        answer: hit._source.answer,
        upvotes: hit._source.upvotes,
        downvotes: hit._source.downvotes
      })
    })

    return {
      message: "Search results",
      data: hits
    }
  } catch (error) {
    console.log('Answer Search Engine Error ', error);
  }
}