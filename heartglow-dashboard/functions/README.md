# HeartGlowAI Firebase Functions

This directory contains Firebase Cloud Functions that power the HeartGlowAI message generation with OpenAI integration.

## Setup

1. Install dependencies:
```bash
cd functions
npm install
```

2. Set up environment variables for OpenAI:
```bash
firebase functions:config:set openai.api_key="YOUR_OPENAI_API_KEY"
```

3. Build the functions:
```bash
npm run build
```

## Local Testing

To test the functions locally:

```bash
npm run serve
```

## Deployment

To deploy the functions:

```bash
npm run deploy
```

## Available Functions

### `generateOpenAIMessage`

Primary function for generating messages using OpenAI. It uses GPT-4 for high-quality message generation.

### `directOpenAIMessage`

Fallback function using a simpler approach with GPT-3.5 Turbo. This is used if the primary function fails.

## Environment Variables

The following environment variables need to be set:

- `OPENAI_API_KEY`: Your OpenAI API key

You can set these using the Firebase CLI:

```bash
firebase functions:config:set openai.api_key="YOUR_OPENAI_API_KEY"
```

And then deploy the functions:

```bash
firebase deploy --only functions
```

## Accessing the Keys in Code

The OpenAI API key is accessed in the code via:

```typescript
process.env.OPENAI_API_KEY
```

This is automatically set up by Firebase Functions from your configuration. 