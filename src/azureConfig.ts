// src/azureConfig.ts

export const azureConfig = {
  endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
  apiKey: import.meta.env.VITE_AZURE_OPENAI_KEY,
  deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT,
  apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION,
};

// Console logs for debugging (Bina sensitive data leak kiye)
console.log("--- Azure Config Status ---");
console.log("Deployment:", azureConfig.deployment);
console.log("API Version:", azureConfig.apiVersion);
console.log("Endpoint Status:", azureConfig.endpoint ? "Loaded ✅" : "Missing ❌");