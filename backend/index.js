import "dotenv/config";
import express from "express";
import Nylas from "nylas";
import cors from 'cors';
import { LanguageServiceClient } from "@google-cloud/language";
import { GoogleGenerativeAI } from "@google/generative-ai";

process.env.GOOGLE_APPLICATION_CREDENTIALS = './learnquest-430005-a806ac9f594c.json';

const languageClient = new LanguageServiceClient();

async function analyzeSentiment(text) {
  try {
    const [result] = await languageClient.analyzeSentiment({ document: { content: text, type: 'PLAIN_TEXT', language:"en" } });
    return result.documentSentiment;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
}

function extractSnippet(body, maxLength = 500) {
  // Extracts a snippet from the body up to a specified length
  return body.length > maxLength ? body.substring(0, maxLength) + '...' : body;
}




// Use CORS to allow requests from the frontend
const app = express();
app.use(cors({
  origin: 'http://localhost:3002', // Allow requests from frontend
}));

const document = {
  content: 'Your text here',
  type: 'PLAIN_TEXT',
};

const [result] = await languageClient.analyzeEntities({ document });


const config = {
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri: "http://localhost:3000/oauth/exchange",
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI,
};

const nylas = new Nylas({
  apiKey: config.apiKey,
  apiUri: config.apiUri, // "https://api.us.nylas.com" or "https://api.eu.nylas.com"
});

const port = 3000;

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});

// route to initialize authentication
app.get("/nylas/auth", (req, res) => {
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: config.clientId,
    redirectUri: config.callbackUri,
  });

  res.redirect(authUrl);
});

// auth callback route
app.get("/oauth/exchange", async (req, res) => {
  console.log("Received callback from Nylas");
  const code = req.query.code;

  if (!code) {
    res.status(400).send("No authorization code returned from Nylas");
    return;
  }

  const codeExchangePayload = {
    clientSecret: config.apiKey,
    clientId: config.clientId,
    redirectUri: config.callbackUri,
    code,
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    const { grantId } = response;

    // NB: This stores in RAM
    // In a real app you would store this in a database, associated with a user
    process.env.USER_GRANT_ID = grantId;

    res.redirect("http://localhost:3002/choice");
  } catch (error) {
    res.status(500).send("Failed to exchange authorization code for token");
  }
});

// route to fetch recent emails
app.get("/nylas/recent-emails", async (req, res) => {
  try {
    const identifier = process.env.USER_GRANT_ID;
    const response = await nylas.messages.list({
      identifier,
      queryParams: {
        limit: 5,
      },
    });

    console.log('Full response:', response);
    const messages = response.data ? response.data : response;

    if (!Array.isArray(messages)) {
      throw new Error("Response data is not an array");
    }

    const summaries = await Promise.all(messages.map(async (message) => {
      // Ensure message.body is defined and use a default if not
      const body = message.snippet || 'No content available';
      const snippet = extractSnippet(body);
      const sentiment = await analyzeSentiment(snippet);

      return {
        subject: message.subject,
        snippet: snippet,
        body: message.body,
        sentiment: {
          score: sentiment.score,
          magnitude: sentiment.magnitude,
        },
      };
    }));

    res.json(summaries);
  } catch (error) {
    console.error("Error analyzing emails:", error);
    res.status(500).send("Error analyzing emails");
  }
});


app.get("/nylas/send-email", async (req, res) => {
  try {
    const { recipientEmail, subject, body } = req.query;

    const sentMessage = await nylas.messages.send({
      identifier: process.env.USER_GRANT_ID,
      requestBody: {
        to: [{ name: "Recipient", email: recipientEmail }],
        replyTo: [{ name: "Your Name", email: process.env.EMAIL }],
        subject: subject,
        body: body,
      },
    });

    res.json(sentMessage);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
