CREATE TABLE "user_answers" (
  "id" SERIAL PRIMARY KEY,
  "user_answer" TEXT NOT NULL,
  "question_id" INTEGER REFERENCES "questions"(id)
    ON DELETE CASCADE NOT NULL,
  "user_id" INTEGER REFERENCES "users"(id)
    ON DELETE CASCADE NOT NULL
);