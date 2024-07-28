import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Quiz from "./pages/quiz/quiz";
import { Route, Routes } from "react-router-dom";
import Aos from "aos";
import { useEffect } from "react";
import UserLocation from "./pages/findLocation/location";
import QuizCard from "./pages/quizCard/Card";

function App() {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz/card" element={<QuizCard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/location" element={<UserLocation />} />
      </Routes>
    </div>
  );
}

export default App;
