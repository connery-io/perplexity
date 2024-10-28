import { ActionDefinition, ActionContext, OutputObject } from 'connery';
import axios from 'axios';

const actionDefinition: ActionDefinition = {
  key: 'onlineSearchWithPerplexity',
  name: 'Online Search with Perplexity',
  description: 'Perform online web search using Perplexity AI',
  type: 'read',
  inputParameters: [
    {
      key: 'apiKey',
      name: 'API Key',
      description: 'Perplexity API key',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'query',
      name: 'Search Query',
      description: 'The search query to look up',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'instructions',
      name: 'Response Instructions',
      description: 'Optional instructions for processing the response',
      type: 'string',
      validation: {
        required: false,
      },
    },
  ],
  operation: {
    handler: handler,
  },
  outputParameters: [
    {
      key: 'result',
      name: 'Search Result',
      description: 'The search results from Perplexity',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
};

export async function handler({ input }: ActionContext): Promise<OutputObject> {
  const client = axios.create({
    baseURL: 'https://api.perplexity.ai',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  const response = await client.post('/chat/completions', {
    model: 'llama-3.1-sonar-small-128k-online',
    messages: [
      {
        role: 'system',
        content:
          'Provide accurate and concise search results based on current information. Include citations for all factual claims.',
      },
      {
        role: 'user',
        content: input.query,
      },
    ],
    temperature: 0.2,
    return_citations: true,
    // search_recency_filter: 'month' removed to allow searching across all time periods
  });

  let result = response.data.choices[0].message.content;

  if (input.instructions) {
    result = `Instructions for the following content: ${input.instructions}\n\n${result}`;
  }

  return { result };
}

export default actionDefinition;
