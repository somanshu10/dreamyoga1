# Chatbot Setup Instructions

The chatbot requires a backend proxy because OpenAI's API blocks direct browser calls due to CORS restrictions.

## Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   cd dreamyoga1
   vercel
   ```

3. **Set Environment Variable:**
   - Go to your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = `your-api-key-here`

4. **Update index.html:**
   ```javascript
   const BACKEND_PROXY_URL = 'https://your-project.vercel.app/api/chatbot';
   ```

## Option 2: Netlify Functions

1. **Create `netlify/functions/chatbot.js`:**
   ```javascript
   exports.handler = async (event, context) => {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method Not Allowed' };
     }

     const { messages } = JSON.parse(event.body);
     const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

     const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${OPENAI_API_KEY}`
       },
       body: JSON.stringify({
         model: 'gpt-3.5-turbo',
         messages,
         temperature: 0.7,
         max_tokens: 500
       })
     });

     const data = await response.json();

     return {
       statusCode: 200,
       headers: { 'Access-Control-Allow-Origin': '*' },
       body: JSON.stringify(data)
     };
   };
   ```

2. **Set environment variable in Netlify dashboard**

3. **Update index.html:**
   ```javascript
   const BACKEND_PROXY_URL = 'https://your-site.netlify.app/.netlify/functions/chatbot';
   ```

## Option 3: Cloudflare Workers

1. **Create `workers/chatbot.js`:**
   ```javascript
   export default {
     async fetch(request) {
       if (request.method !== 'POST') {
         return new Response('Method not allowed', { status: 405 });
       }

       const { messages } = await request.json();
       const OPENAI_API_KEY = YOUR_WORKER_SECRET; // Set in Cloudflare dashboard

       const response = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${OPENAI_API_KEY}`
         },
         body: JSON.stringify({
           model: 'gpt-3.5-turbo',
           messages,
           temperature: 0.7,
           max_tokens: 500
         })
       });

       const data = await response.json();

       return new Response(JSON.stringify(data), {
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
         }
       });
     }
   };
   ```

## Quick Test (Development Only)

For quick testing, you can temporarily use a CORS proxy, but **DO NOT use this in production**:

```javascript
// In index.html, temporarily use:
const BACKEND_PROXY_URL = 'https://cors-anywhere.herokuapp.com/https://api.openai.com/v1/chat/completions';
```

Then pass the API key in headers (but this exposes your key, so only for testing).

## After Setup

1. Update `BACKEND_PROXY_URL` in `index.html` with your deployed function URL
2. Make sure your API key is set as an environment variable (not in code)
3. Test the chatbot

## Security Notes

- ✅ Never commit your API key to code
- ✅ Always use environment variables
- ✅ Use rate limiting on your proxy
- ✅ Monitor API usage to avoid unexpected costs
- ❌ Don't expose API keys in frontend code
