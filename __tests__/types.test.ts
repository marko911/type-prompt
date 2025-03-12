import {
  ChatMessage,
  ContentBlockType,
  CacheControl,
  ContentBlock,
  Tool,
  RenderCache,
  PromptMetadata,
} from "../types";

describe("Types", () => {
  test("ChatMessage interface can be instantiated", () => {
    const message: ChatMessage = {
      role: "user",
      content: "Hello, world!",
    };

    expect(message.role).toBe("user");
    expect(message.content).toBe("Hello, world!");
  });

  test("ChatMessage with content blocks can be instantiated", () => {
    const message: ChatMessage = {
      role: "user",
      content: [
        {
          type: ContentBlockType.text,
          text: "Hello, world!",
        },
      ],
    };

    expect(message.role).toBe("user");
    expect(Array.isArray(message.content)).toBe(true);
    if (Array.isArray(message.content)) {
      expect(message.content[0].type).toBe(ContentBlockType.text);
      expect(message.content[0].text).toBe("Hello, world!");
    }
  });

  test("ContentBlock with image_url can be instantiated", () => {
    const block: ContentBlock = {
      type: ContentBlockType.image_url,
      image_url: {
        url: "https://example.com/image.jpg",
      },
    };

    expect(block.type).toBe(ContentBlockType.image_url);
    expect(block.image_url?.url).toBe("https://example.com/image.jpg");
  });

  test("Tool interface can be instantiated", () => {
    const tool: Tool = {
      type: "function",
      function: {
        name: "test_function",
        description: "A test function",
        parameters: {
          type: "object",
          properties: {
            param1: {
              type: "string",
              description: "A test parameter",
            },
          },
          required: ["param1"],
        },
      },
      import_path: "./test",
    };

    expect(tool.type).toBe("function");
    expect(tool.function.name).toBe("test_function");
    expect(tool.function.parameters.required).toContain("param1");
  });
});
