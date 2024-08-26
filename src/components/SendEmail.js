import React, { useState } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

function SendEmail() {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  const [status, setStatus] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value
    });
  };

  const genAI = new GoogleGenerativeAI("AIzaSyACHRZp8xni8_If55wtKfa5_S2fWRfMi2c");

  const generateEmailBody = async (prompt) => {
    try {
      const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);

      if (result && result.response) {
        const responseText = await result.response.text();
        setGeneratedBody(responseText);
      } else {
        setGeneratedBody("Sorry, I couldn't generate a response.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedBody("An error occurred while generating the response. Please try again later.");
    }
  };

  const handleAiPromptChange = (e) => {
    setAiPrompt(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    axios.get('http://localhost:3000/nylas/send-email', {
      params: {
        recipientEmail: emailData.to,
        subject: emailData.subject,
        body: emailData.body
      }
    })
    .then(response => {
      setStatus('Email sent successfully!');
      console.log('Email sent successfully:', response.data);
    })
    .catch(error => {
      setStatus('Error sending email.');
      console.error('Error sending email:', error);
    });
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '600px', width: '100%', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflowY: 'auto', maxHeight: '90vh', padding: '20px' }}>
        <h2 className="text-5xl font-bold mb-6 text-center">Send an Email</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>To:</label>
            <input
              type="email"
              name="to"
              value={emailData.to}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Body:</label>
            <textarea
              name="body"
              value={emailData.body}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '100px', border: '1px solid #ccc' }}
            />
          </div>
          <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" type="submit" >Send Email</button>
        </form>
        {status && <p>{status}</p>}

        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '10px', display:"flex", flexDirection:"column", gap:"10px" }}>
          <h3>Generative AI Email Body</h3>
          <input
            type="text"
            placeholder="Type your prompt here"
            value={aiPrompt}
            onChange={handleAiPromptChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          <button onClick={() => generateEmailBody(aiPrompt)} className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">Generate Email Body</button>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Generated Email Body:</strong> {formatResponse(generatedBody) || 'No content generated yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendEmail;

