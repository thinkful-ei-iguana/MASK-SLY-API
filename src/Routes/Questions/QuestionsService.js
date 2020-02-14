// Create the questions service object
const QuestionsService = {

  // Gets all questions from the database
  getQuestions(db) {
    return db('questions')
      .select('*');
  },

  // Gets paginated questions
  paginateQuestions(db, page, pSize) {
    
    // Set the offset for the page
    const offset = pSize * (page - 1);
    
    // Returns all of the questions within the appropriate page
    return db('questions')
      .select('*')
      .limit(pSize)
      .offset(offset);
  },

  // Checks if the question exists in the database
  checkIfQuestion(db, question_id) {
    
    // Create a container to hold the question
    const question = db('questions')
      .select('*')
      .where('question.id', question_id);

    // If question is found returns true
    if (question) {
      return true;
    }

    // Otherwise return false
    return false;
  },

  // Gets the answers for a specific question
  getQuestionAnswers(db, question_id) {
    return db('answers')
      .select('*')
      .where('answers.question_id', question_id);
  }
};

module.exports = QuestionsService;