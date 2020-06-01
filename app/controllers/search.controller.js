const searchEngine = require('../../utils/searchengine.js')

exports.searchQuestion = async (req, res) => {
  try {
    const searchText = req.body

    const result = await searchEngine.questionSearchEngine(searchText) || {}

    res.status(200).send({
      success: true,
      data: result.data || "No data returned",
      message: result.message
    })
  } catch (error) {
    console.log("Search Question Error ", error);

    res.status(500).send({
      success: false,
      data: error,
      error: "An Unexpected Error Occured"
    })
  }
}

exports.searchAnswer = async (req, res) => {
  try {
    const searchText = req.body

    const result = await searchEngine.answerSearchEngine(searchText) || {}

    res.status(200).send({
      success: true,
      data: result.data || "No data returned",
      message: result.message
    })
  } catch (error) {
    console.log("Search Answer Error ", error);

    res.status(500).send({
      success: false,
      data: error,
      error: "An Unexpected Error Occured"
    })
  }
}