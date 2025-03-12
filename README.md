<div align="center">

# Type Prompt 🎭

A powerful TypeScript library for LLM prompt templating, inspired by [Banks](https://github.com/masci/banks)

[![npm version](https://img.shields.io/npm/v/type-prompt.svg)](https://www.npmjs.com/package/type-prompt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

---

## 🚀 Features

- 📝 **Template rendering** - Create prompts using the Nunjucks templating engine
- 💬 **Chat messages** - Easily generate chat-based prompts for modern LLMs
- 🔧 **Filters and extensions** - Apply transformations to your prompt content
- ⚡ **Caching** - Efficiently render prompts by avoiding redundant processing
- 🛠️ **Tool calling** - First-class support for function calling in LLMs
- 🖼️ **Vision support** - Add images to prompts for multimodal models

## 📦 Installation

```bash
npm install type-prompt
```

## 🎯 Quick Start

### Basic Prompt

```typescript
import { Prompt } from "type-prompt";

const p = new Prompt("Write a 500-word blog post on {{ topic }}.");
console.log(p.text({ topic: "AI frameworks" }));
```

## 📚 Examples

### Chat Messages

```typescript
import { Prompt } from "type-prompt";

const p = new Prompt(`
{% chat role="system" %}
You are a {{ persona }}.
{% endchat %}

{% chat role="user" %}
Hello, how are you?
{% endchat %}
`);

const messages = p.chatMessages({ persona: "helpful assistant" });
// Output:
// [
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'user', content: 'Hello, how are you?' }
// ]
```

### Prompt Caching (for Anthropic)

```typescript
import { Prompt } from "type-prompt";

const p = new Prompt(`
{% chat role="user" %}
Analyze this book:

{{ book | cache_control("ephemeral") }}

What is the title of this book? Only output the title.
{% endchat %}
`);

const messages = p.chatMessages({ book: "This is a short book!" });
// The book content will be wrapped in a special content block with cache_control
```

### Function Calling

```typescript
import { Prompt } from "type-prompt";

function getLaptopInfo() {
  /**
   * Get information about the user laptop.
   */
  return "MacBook Pro, macOS 12.3";
}

const p = new Prompt(`
{% chat role="user" %}
{{ query }}
{{ getLaptopInfo | tool }}
{% endchat %}
`);

const messages = p.chatMessages({
  query: "Can you guess the name of my laptop?",
  getLaptopInfo,
});
// The tool will be properly formatted for LLM function calling
```

## �� API Reference

### Prompt

The main class for creating and rendering prompts.

```typescript
new Prompt(template: string, options?: {
  name?: string;
  version?: string;
  metadata?: Record<string, any>;
  canaryWord?: string;
  renderCache?: RenderCache;
})
```

#### Methods

- `text(data?: Record<string, any>)`: Render the prompt as plain text
- `chatMessages(data?: Record<string, any>)`: Render the prompt as an array of chat messages
- `canaryLeaked(text: string)`: Check if a canary word has leaked

### AsyncPrompt

An asynchronous version of the Prompt class with the same API but providing Promise-based methods.

```typescript
new AsyncPrompt(template: string, options?: {
  name?: string;
  version?: string;
  metadata?: Record<string, any>;
  canaryWord?: string;
  renderCache?: RenderCache;
})
```

#### Methods

- `text(data?: Record<string, any>)`: Returns a Promise that resolves to the rendered text
- `chatMessages(data?: Record<string, any>)`: Returns a Promise that resolves to an array of chat messages
- `canaryLeaked(text: string)`: Check if a canary word has leaked

### Filters

- `cache_control(text: string, cacheType: string = "ephemeral")`: Mark text for caching
- `image(source: string)`: Include an image in the prompt
- `tool(function: Function)`: Convert a function to a tool for function calling

### Extensions

- `chat`: Define a chat message block
- `completion`: Generate text using an LLM during template rendering

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/type-prompt/issues).

## 📝 License

This project is [MIT](./LICENSE) licensed.

---

<div align="center">
Made with ❤️ by [Your Name/Organization]
</div>
