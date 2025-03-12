import { Prompt, AsyncPrompt } from "./index";

// Example 1: Basic text prompt
const blogPrompt = new Prompt(
  "Write a 500-word blog post on {{ topic }}.\n\nBlog post:"
);
console.log(blogPrompt.text({ topic: "AI frameworks" }));

// Example 2: Chat messages prompt
const chatPrompt = new Prompt(`
{% chat role="system" %}
You are a {{ persona }}.
{% endchat %}

{% chat role="user" %}
Hello, how are you?
{% endchat %}
`);

const messages = chatPrompt.chatMessages({ persona: "helpful assistant" });
console.log(messages);

// Example 3: Using cache control for Anthropic
const cacheControlPrompt = new Prompt(`
{% chat role="user" %}
Analyze this book:

{{ book | cache_control("ephemeral") }}

What is the title of this book? Only output the title.
{% endchat %}
`);

const cacheMessages = cacheControlPrompt.chatMessages({
  book: "This is a short book!",
});
console.log(JSON.stringify(cacheMessages, null, 2));

// Example 4: Function calling with tools
function getLaptopInfo() {
  /**
   * Get information about the user laptop.
   *
   * @returns {string} System information
   */
  return "MacBook Pro (2021), macOS 12.3";
}

const toolPrompt = new Prompt(`
{% chat role="user" %}
{{ query }}
{{ getLaptopInfo | tool }}
{% endchat %}
`);

const toolMessages = toolPrompt.chatMessages({
  query: "Can you guess the name of my laptop?",
  getLaptopInfo,
});
console.log(JSON.stringify(toolMessages, null, 2));

// Example 5: Using AsyncPrompt for asynchronous rendering
const asyncPrompt = new AsyncPrompt(`
{% chat role="user" %}
Tell me about {{ topic }}
{% endchat %}
`);

// Using with async/await
async function runAsyncExample() {
  const messages = await asyncPrompt.chatMessages({ topic: "prompt engineering" });
  console.log("Async result:", messages);
}

// Run the async example
runAsyncExample().catch(console.error);
