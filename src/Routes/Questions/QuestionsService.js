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

  // Gets a specific question
  getQuestion(db, id) {
    return db
      .from('questions')
      .select('*')
      .where({ id });
  },

  // Gets the answers for a specific question
  getQuestionAnswers(db, question_id) {
    return db('answers')
      .select('*')
      .where('question_id', question_id );
  }
};

module.exports = QuestionsService;