import React, { useState } from 'react';

const AIAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement AI assistant API call here
    setAnswer('This is a placeholder answer. Implement actual AI response here.');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Ask
        </button>
      </form>
      {answer && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-bold">Answer:</p>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
