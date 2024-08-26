import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify'; // For sanitizing HTML content
import { GoogleGenerativeAI } from '@google/generative-ai'; // Adjust according to the actual package name
import { CardSpotlight } from "./ui/card-spotlight.js";

const genAI = new GoogleGenerativeAI("AIzaSyACHRZp8xni8_If55wtKfa5_S2fWRfMi2c");

const generateAIResponse = async (prompt) => {
  try {
    const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    
    if (result && result.response) {
      const responseText = await result.response.text();
      return responseText;
    } else {
      return "Sorry, I couldn't generate a response.";
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return "An error occurred while generating the response.";
  }
};

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/nylas/recent-emails')
      .then(response => {
        console.log('Response data:', response.data);

        if (Array.isArray(response.data)) {
          setEmails(response.data);
          generateResponses(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching emails:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const generateResponses = async (emails) => {
    const newResponses = {};
    for (const email of emails) {
      const responseText = await generateAIResponse(email.snippet);
      newResponses[email.subject] = formatResponse(responseText);
    }
    setResponses(newResponses);
  };

  const formatResponse = (text) => {
    // Split the text into paragraphs
    const paragraphs = text.split("\n").filter((para) => para.trim() !== "");
  
    return paragraphs.map((paragraph, index) => {
      // Replace **text** with <strong>text</strong>
      const boldFormatted = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      
      // Replace _text_ with <em>text</em>
      const italicFormatted = boldFormatted.replace(/_(.*?)_/g, "<em>$1</em>");
  
      // Check if the paragraph starts with a number (for options)
      const isOption = /^\d+\.\s/.test(paragraph);
      return (
        <p
          key={index}
          className={`mb-2 ${isOption ? "font-semibold" : ""}`}
          dangerouslySetInnerHTML={{ __html: italicFormatted }}
        />
      );
    });
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching emails: {error.message}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-bold mb-6 text-center">Recent Emails</h1>
      {emails.length > 0 ? (
        <ul className="space-y-4">
          {emails.map((email, index) => (
            <li key={index} className="p-4 bg-white rounded-lg shadow-md">
              <strong className="text-lg">Subject:</strong> {email.subject}
              <br />
              <strong className="text-md">Entities:</strong>
              <ul className="ml-4">
                {email.entities && email.entities.length > 0 ? (
                  email.entities.map((entity, idx) => (
                    <li key={idx} className="my-2">
                      <div className="text-sm">
                        <strong>Name:</strong> {entity.name}
                        <br />
                        <strong>Type:</strong> {entity.type}
                        <br />
                        <strong>Salience:</strong> {entity.salience}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No entities found.</p>
                )}
              </ul>
              <br />
              <CardSpotlight className="text-white p-4 rounded-md">
                <strong>Sentiment Score:</strong> {email.sentiment?.score ?? 'N/A'}
                <br />
                <strong>Sentiment Magnitude:</strong> {email.sentiment?.magnitude ?? 'N/A'}
                <br />
                <p>
                  <strong>Response:</strong> {responses[email.subject] ?? 'Loading...'}
                </p>
              </CardSpotlight>
              <div className="mt-4">
                <strong>Email Body:</strong>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.body) }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails available.</p>
      )}
    </div>
  );
};  

export default EmailList;
