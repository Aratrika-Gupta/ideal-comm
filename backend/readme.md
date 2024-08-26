# How to run

1. Install the required packages

```bash
npm install
```

2. Run the project

```bash
npm start
```

3. In the Nylas dashboard, create a new application and set the Google connector redirect URL to `http://localhost:3000/oauth/exchange`

4. env variables

```env
NYLAS_CLIENT_ID=
NYLAS_API_KEY=
NYLAS_API_URI=https://api.us.nylas.com
EMAIL=<RECIPIENT_EMAIL_ADDRESS_HERE>
```

5. Open your browser and go to `http://localhost:3000/nylas/auth` and log in and end user account

6. After authenticating an end user account, you can visit the following URLs to get a feel for some of what you can do with the Nylas Email API.

```text
http://localhost:3000/nylas/recent-emails
http://localhost:3000/nylas/send-email
```
