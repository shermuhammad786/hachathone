import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <header className="flex items-center justify-between w-full p-4 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600"><img width={"100px"} src="/assets/sayl.png" alt="" /></span>
        </div>
        <button className="text-blue-600 border-blue-600 border px-4 py-2 rounded-md hover:bg-blue-100">
          Login
        </button>
      </header>
      <main className="flex flex-col lg:flex-row items-center justify-center flex-1 w-full p-10">
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
            Learn <br />
            new concepts <br />
            for each question
          </h1>
          <p className="text-lg text-gray-600 mb-8">We help you prepare for exams and quizzes</p>
          <button className="w-40 lg:w-48 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Start solving
          </button>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <img
            src={`${process.env.PUBLIC_URL}/assets/landimg.svg`}
            alt="People with questions"
            className="max-w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}


