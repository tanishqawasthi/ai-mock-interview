import { Lightbulb } from "lucide-react";
import React from "react";

const Questions = ({ mockInterviewQuestions, activeQuestionIndex }) => {
  return (
    mockInterviewQuestions && (
      <div className="p-5 border rounded-lg my-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {mockInterviewQuestions &&
            mockInterviewQuestions.map((question, index) => (
              <h2
                className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQuestionIndex == index ? "font-bold" : ""
                }`}
              >
                Question {index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-sm md:text-lg">
          {mockInterviewQuestions[activeQuestionIndex]?.question}
        </h2>
        <div className="border rounded-lg p-5 bg-orange-50">
          <h3 className="flex gap-2 items-center text-primary">
            <Lightbulb/>
              <span className="font-bold">Note: </span>
          </h3>
          <p className="text-sm mt-2 text-primary">
              Click on Record Answer when you want to answer the question. At the end of the interview, we will give you the feedback along with the correct answer for each question and you can compare them.
              </p>
        </div>
      </div>
    )
  );
};

export default Questions;
