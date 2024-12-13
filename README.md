# Azure AI + Vercel AI SDK RAG Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnicoalbanese%2Fai-sdk-rag-template&env=OPENAI_API_KEY&envDescription=You%20will%20need%20an%20OPENAI%20API%20Key.&project-name=ai-sdk-rag&repository-name=ai-sdk-rag&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D&skippable-integrations=1)

A [Next.js](https://nextjs.org/) application, powered by the Vercel AI SDK, that uses retrieval-augmented generation (RAG) to reason and respond with information outside of the model's training data.

## Features

- Information retrieval and addition through tool calls using the [`streamText`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text) function
- Real-time streaming of model responses to the frontend using the [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) hook
- Vector embedding retrieval with [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search) using embeddings from [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)
- Generative text streaming with [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)
- Animated UI with [Framer Motion](https://www.framer.com/motion/)

## Getting Started

To get the project up and running, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Create prerequisite resources in Azure AI:
- Azure AI Search index
  - Optionally create a semantic search configuration and include vector fields in the index (to create a vector-enabled search index, see [here](https://learn.microsoft.com/en-us/azure/search/))
- Azure OpenAI Chat model
- Azure OpenAI Embedding model, if using vector search


4. Add your Azure OpenAI and Azure AI Search variables to the `.env` file:

   ```
   AZURE_SEARCH_ENDPOINT=your_azure_search_endpoint_here
   AZURE_SEARCH_KEY=your_azure_search_key_here
   AZURE_SEARCH_INDEX_NAME=your_azure_search_index_name_here
   AZURE_SEARCH_CONTENT_FIELD=your_azure_search_content_field_here
   AZURE_SEARCH_VECTOR_FIELD=your_azure_search_vector_field_here # include if using vector search
   AZURE_SEARCH_SEMANTIC_CONFIGURATION_NAME=your_azure_search_semantic_configuration_name_here # include if using semantic search

   AZURE_OPENAI_API_ENDPOINT=your_azure_openai_api_endpoint_here
   AZURE_RESOURCE_NAME=your_azure_resource_name_here
   AZURE_DEPLOYMENT_NAME=your_azure_deployment_name_here # chat model deployment name
   AZURE_EMBEDDING_DEPLOYMENT_NAME=your_azure_embedding_deployment_name_here # embedding model deployment name
   AZURE_API_KEY=your_azure_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Your project should now be running on [http://localhost:3000](http://localhost:3000).

# Appendix

This template includes code from Vercel's [AI SDK RAG Template](https://github.com/vercel-labs/ai-sdk-preview-rag), which is licensed under the MIT license.
