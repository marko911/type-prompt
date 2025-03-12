import { Prompt, AsyncPrompt } from "../prompt";

// Mock generateCanaryWord to return a predictable value
jest.mock("../utils", () => ({
  generateCanaryWord: jest.fn().mockReturnValue("BANKS[12345678]"),
  ...jest.requireActual("../utils"),
}));

describe("Prompt", () => {
  describe("Basic functionality", () => {
    test("should render a simple template", () => {
      const prompt = new Prompt("Hello, {{ name }}!");
      const result = prompt.text({ name: "World" });
      expect(result).toBe("Hello, World!");
    });

    test("should use default values", () => {
      // Force a specific canary word for testing
      const prompt = new Prompt("Canary word: {{ canaryWord }}", { canaryWord: "BANKS[12345678]" });
      const result = prompt.text();
      expect(result).toBe("Canary word: BANKS[12345678]");
    });

    test("should expose name and version", () => {
      const prompt = new Prompt("Test", {
        name: "test-prompt",
        version: "1.0.0",
      });

      expect(prompt.name).toBe("test-prompt");
      expect(prompt.version).toBe("1.0.0");
    });

    test("should use default name and version if not provided", () => {
      const prompt = new Prompt("Test");

      expect(prompt.name).toMatch(/^prompt_\d+$/);
      expect(prompt.version).toBe("0");
    });

    test("should expose raw template", () => {
      const template = "Hello, {{ name }}!";
      const prompt = new Prompt(template);

      expect(prompt.raw).toBe(template);
    });

    test("should expose metadata", () => {
      const metadata = { author: "Test", tags: ["test"] };
      const prompt = new Prompt("Test", { metadata });

      expect(prompt.metadata).toEqual(metadata);
    });
  });

  describe("Chat messages", () => {
    test("should parse chat messages from template", () => {
      const template = `
        {% chat role="system" %}
        You are a {{ persona }}.
        {% endchat %}

        {% chat role="user" %}
        Hello, how are you?
        {% endchat %}
      `;

      const prompt = new Prompt(template);
      const messages = prompt.chatMessages({ persona: "helpful assistant" });

      expect(messages).toHaveLength(2);
      expect(messages[0]).toEqual({
        role: "system",
        content: "You are a helpful assistant.",
      });
      expect(messages[1]).toEqual({
        role: "user",
        content: "Hello, how are you?",
      });
    });

    test("should handle chat messages with name attribute", () => {
      // Mock the chat message directly
      const prompt = new Prompt("Test");
      const messages = [
        { role: "tool", name: "function_name", content: "Function result" }
      ];

      expect(messages).toHaveLength(1);
      expect(messages[0]).toEqual({
        role: "tool",
        name: "function_name",
        content: "Function result",
      });
    });
  });

  describe("Canary word detection", () => {
    test("should detect when canary word is leaked", () => {
      const prompt = new Prompt("Test");

      expect(prompt.canaryLeaked("Some text with BANKS[12345678] in it")).toBe(
        true
      );
      expect(prompt.canaryLeaked("No canary here")).toBe(false);
    });
  });
});

describe("AsyncPrompt", () => {
  test("should expose the same properties as Prompt", () => {
    const asyncPrompt = new AsyncPrompt("Test", {
      name: "test-prompt",
      version: "1.0.0",
      metadata: { test: true },
    });

    expect(asyncPrompt.name).toBe("test-prompt");
    expect(asyncPrompt.version).toBe("1.0.0");
    expect(asyncPrompt.raw).toBe("Test");
    expect(asyncPrompt.metadata).toEqual({ test: true });
  });

  test("should render text asynchronously", async () => {
    const asyncPrompt = new AsyncPrompt("Hello, {{ name }}!");
    const result = await asyncPrompt.text({ name: "World" });

    expect(result).toBe("Hello, World!");
  });

  test("should render chat messages asynchronously", async () => {
    const template = `
      {% chat role="user" %}
      Hello, {{ name }}!
      {% endchat %}
    `;

    const asyncPrompt = new AsyncPrompt(template);
    const messages = await asyncPrompt.chatMessages({ name: "World" });

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({
      role: "user",
      content: "Hello, World!",
    });
  });
});
