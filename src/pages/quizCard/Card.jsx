import React from 'react';
import './QuizCard.css';
import Navbar from '../../components/nanvar';

function QuizCard() {
  const quizzes = [
    { title: 'HTML Quiz', description: 'Test your knowledge of HTML.' },
    { title: 'CSS Quiz', description: 'Test your knowledge of CSS.' },
    { title: 'JavaScript Quiz', description: 'Test your knowledge of JavaScript.' },
    { title: 'React Quiz', description: 'Test your knowledge of React.' },
    { title: 'Node.js Quiz', description: 'Test your knowledge of Node.js.' }
  ];

  return (

    <div className="appss">
        <Navbar/>
      <h1 className='heading'>Please Select The Quiz</h1>
      <div className="quiz-containers">
        {quizzes.map((quiz, index) => (
          <div key={index} className={`quiz-cards breathing-${index % 3}`}>
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <button>Start Quiz</button>
          </div>
        ))}
      </div>   
    </div>
  );
}

export default QuizCard;
