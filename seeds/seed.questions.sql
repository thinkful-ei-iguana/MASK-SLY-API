BEGIN;

    INSERT INTO questions
        (question, topic, answered)
    VALUES
        ('Do you prefer a busy or calm lifestyle?', 'Lifestyle', 0),
        ('Do you have pets?', 'Lifestyle', 0),
        ('Do you live alone?', 'Lifestyle', 0),
        ('Who do you live with?', 'Lifestyle', 0),
        ('Are you the oldest, youngest, middle, or only child?', 'Family', 0),
        ('How many many siblings do you have?', 'Family', 0),
        ('What is your highest level of education?', 'Education', 0),
        ('Do you plan on attaining a higher level of education', 'Education', 0),
        ('Do you prefer indoors or outdoors?', 'Preferences', 0),
        ('What is your favorite time of day?', 'Preferences', 0),
        ('What is your preferred method of transportation?', 'Preferences', 0),
        ('What do you like doing on your vacation?', 'Preferences', 0),
        ('Do you consider yourself an introvert or extrovert?', 'Personality', 0),
        ('Do you like to live dangerously or cautiously?', 'Personality', 0);

    INSERT INTO answers
        (answer, question_id)
    VALUES
        ('Busy', 1),
        ('Calm', 1),
        ('Both', 1),
        ('Yes', 2),
        ('No', 2),
        ('No, but would like some', 2),
        ('Yes', 3),
        ('No', 3),
        ('Family', 4),
        ('Roommates', 4),
        ('Significant other', 4),
        ('N/A, alone', 4),
        ('Youngest', 5),
        ('Middle', 5),
        ('Oldest', 5),
        ('Only child', 5),
        ('0', 6),
        ('1-3', 6),
        ('4-6', 6),
        ('7+', 6),
        ('High School', 7),
        ('Some college / Trade school', 7),
        ('Assocaite', 7),
        ('Bachelor and higher', 7),
        ('Yes', 8),
        ('No', 8),
        ('Not sure', 8),
        ('Yes', 9),
        ('No', 9),
        ('A little bit of both', 9),
        ('I am an early bird', 10),
        ('I am more of a night owl', 10),
        ('I prefer the afternoon', 10),
        ('Car', 11),
        ('Truck', 11),
        ('Bike', 11),
        ('Walking', 11),
        ('Public transit', 11),
        ('Outdoor activities', 12),
        ('Leisurely activities / relaxing', 12),
        ('Shopping', 12),
        ('Trying a new cuisine', 12),
        ('Yes', 13),
        ('No', 13),
        ('A little bit of both', 13),
        ('Yes', 14),
        ('No', 14),
        ('A little bit of both', 14);

    INSERT INTO user_answers
        (user_answer, question_id, user_id)
    VALUES
        (1, 1, 1),
        (4, 2, 1);

END;