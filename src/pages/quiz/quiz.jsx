import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Progress, Typography, Input, Modal } from "antd";
import questionsJson from "./dummyQuiz.json";
import "./Quiz.css";
import { FieldTimeOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const { Title } = Typography;

const QuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const [clicked, setClicked] = useState(false);
  const [pass, setPass] = useState(null);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [value, setValue] = useState(0);
  const [currentPer, setCurrentPer] = useState(0);
  const [maxPer, setMaxPer] = useState(100);
  const [minPer, setMinPer] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(true);
  const [quizEnded, setQuizEnded] = useState(false);
  const [showSkippedQuestions, setShowSkippedQuestions] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          handleSkipQuestion();
          setWrongAnswer((prev) => prev + 1);
          return 45;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const questions = questionsJson.map((eachQuestion) => {
    return {
      ...eachQuestion,
      options: [...eachQuestion.incorrect_answers, eachQuestion.correct_answer],
    };
  });

  const data = [
    {
      val: 100,
      color: "green",
    },
    {
      val: currentPer,
      color: "yellow",
    },
    {
      val: maxPer,
      color: "orange",
    },
    {
      val: minPer,
      color: "red",
    },
  ];

  const handleNextQuestion = useCallback(() => {
    console.log(selectedOption, " ==>>> selected option ");

    if (selectedOption === questions[currentQuestionIndex]?.correct_answer) {
      setPass(true);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setPass(false);
      setWrongAnswer((prev) => prev + 1);
    }

    setSeconds(45);
    setValue((prevValue) => prevValue + 1);

    if (showSkippedQuestions) {
      if (currentQuestionIndex === skippedQuestions.length - 1) {
        // Last skipped question
        setShowResult(true);
        setQuizCompleted(true);
      } else {
        // Move to next skipped question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      if (currentQuestionIndex === questions.length - 1) {
        if (skippedQuestions.length > 0) {
          setShowSkippedQuestions(true);
          setCurrentQuestionIndex(0);
        } else {
          setShowResult(true);
          setQuizCompleted(true);
        }
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }

    setClicked(false);
    setSelectedOption(null);

    const totalQuestions = questions.length + skippedQuestions.length;
    const answeredQuestions =
      currentQuestionIndex +
      1 +
      skippedQuestions.length -
      skippedQuestions.length +
      (showSkippedQuestions ? skippedQuestions.length : 0);
    setMinPer((correctAnswers * 100) / totalQuestions);
    setCurrentPer((correctAnswers * 100) / answeredQuestions);
    setMaxPer(
      ((correctAnswers + (totalQuestions - answeredQuestions)) * 100) /
        totalQuestions
    );
  }, [
    selectedOption,
    questions,
    correctAnswers,
    currentQuestionIndex,
    skippedQuestions.length,
    showSkippedQuestions,
  ]);

  const handleOptionSelect = useCallback((option) => {
    setSelectedOption(option);
    setClicked(true);
  }, []);

  const handleSkipQuestion = useCallback(() => {
    setSkippedQuestions((prev) => [...prev, questions[currentQuestionIndex]]);
    handleNextQuestion();
  }, [currentQuestionIndex, handleNextQuestion, questions]);

  const handleFlagQuestion = useCallback(() => {
    setFlaggedQuestions((prev) => {
      const currentQuestion = questions[currentQuestionIndex];

      const isFlagged = prev.find(
        (question) => question.correct_answer === currentQuestion.correct_answer
      );
      console.log(isFlagged, "=>>> is flagged");
      if (isFlagged) {
        return prev.filter(
          (question) =>
            question.correct_answer !== currentQuestion.correct_answer
        );
      } else {
        return [...prev, currentQuestion];
      }
    });
    console.log(flaggedQuestions, "=>>> flagged questions");
  }, [currentQuestionIndex, questions, flaggedQuestions]);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    setIsFeedbackModalVisible(false);
    console.log("Feedback submitted: ", feedback);
  };

  const handleSubmitQuiz = () => {
    const totalScore = correctAnswers * 5;
    console.log("Quiz submitted. Total score:", totalScore);
    setQuizCompleted(true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsQuizActive(false);
        setQuizEnded(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (quizEnded) {
    return (
      <div>
        <h1>Quiz Application</h1>
        <div style={{ color: "red", fontWeight: "bold" }}>
          The quiz has ended because you switched tabs. Please restart the quiz.
        </div>
      </div>
    );
  }

  const renderQuestions = (questionsList) => (
    <div className="app">
      <div className="bar">
        <Progress
          percent={(value / (questions.length + skippedQuestions.length)) * 100}
          status="active"
          showInfo={false}
        />
      </div>
      <div className="first-row">
        <Title level={3}>
          Question {currentQuestionIndex + 1} / {questionsList.length}
        </Title>
        <span>
          <FieldTimeOutlined />
          {seconds} seconds
        </span>
      </div>
      <div className="star">
        <FontAwesomeIcon
          style={{
            color:
              questionsList[currentQuestionIndex]?.difficulty === "easy" ||
              questionsList[currentQuestionIndex]?.difficulty === "medium" ||
              questionsList[currentQuestionIndex]?.difficulty === "hard"
                ? "#FCA120"
                : "#dedede",
          }}
          icon={faStar}
        />
        <FontAwesomeIcon
          style={{
            color:
              questionsList[currentQuestionIndex]?.difficulty === "medium" ||
              questionsList[currentQuestionIndex]?.difficulty === "hard"
                ? "#FCA120"
                : "#dedede",
          }}
          icon={faStar}
        />
        <FontAwesomeIcon
          style={{
            color:
              questionsList[currentQuestionIndex]?.difficulty === "hard"
                ? "#FCA120"
                : "#dedede",
          }}
          icon={faStar}
        />
      </div>
      <div className="second-row">
        <span className="question">
          {decodeURIComponent(questionsList[currentQuestionIndex]?.question)}
        </span>
      </div>
      <div className="main-container">
        <div className="main-contain">
          {questionsList[currentQuestionIndex]?.options?.map(
            (option, index) => (
              <div className="middle-contain" key={index}>
                <Button
                  style={{
                    margin: 5,
                    color: "black",
                    width: 230,
                    height: 45,
                    backgroundColor:
                      option === selectedOption ? "green" : "white",
                  }}
                  onClick={() => handleOptionSelect(option)}
                >
                  {decodeURIComponent(option)}
                </Button>
              </div>
            )
          )}
        </div>
      </div>
      <div
        className="next-button"
        style={{ position: "relative", left: 0, top: 0, bottom: 0, right: 0 }}
      >
        <Button onClick={handleFlagQuestion} className="flagButton">
          Flag
        </Button>
        <Button
          onClick={handleNextQuestion}
          className="button"
          disabled={!clicked}
        >
          Next
        </Button>
        {!showSkippedQuestions && (
          <Button
            onClick={handleSkipQuestion}
            className="button"
            style={{ marginLeft: 10 }}
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1>Quiz Application</h1>
      {isQuizActive ? (
        <div>
          <div className="contain-quiz">
            {!showResult ? (
              showSkippedQuestions ? (
                renderQuestions(skippedQuestions)
              ) : (
                renderQuestions(questions)
              )
            ) : (
              <div className="quiz-result">
                <h2>Quiz Result</h2>
                <p>
                  You scored {correctAnswers} out of {questions.length}
                </p>
                <Progress
                  percent={Math.floor(
                    (correctAnswers * 100) / questions.length
                  )}
                  status="active"
                  type="circle"
                  size={130}
                />

                <Button
                  onClick={() => setIsFeedbackModalVisible(true)}
                  className="button"
                >
                  Submit Feedback
                </Button>
                <Modal
                  title="Feedback"
                  visible={isFeedbackModalVisible}
                  onOk={handleFeedbackSubmit}
                  onCancel={() => setIsFeedbackModalVisible(false)}
                >
                  <Input.TextArea
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Enter your feedback"
                    rows={4}
                  />
                </Modal>
              </div>
            )}
          </div>
          {showResult && (
            <Button onClick={handleSubmitQuiz} className="button">
              Submit Quiz
            </Button>
          )}
        </div>
      ) : (
        <div style={{ color: "red", fontWeight: "bold" }}>
          The quiz is paused. Please return to the quiz tab.
        </div>
      )}
    </div>
  );
};

export default QuizApp;
