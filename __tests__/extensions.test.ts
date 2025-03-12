import nunjucks from "nunjucks";
import { ChatExtension } from "../extensions";
import { ContentBlockType } from "../types";

describe("Extensions", () => {
  describe("ChatExtension", () => {
    let env: nunjucks.Environment;

    beforeEach(() => {
      env = nunjucks.configure({ autoescape: false });
      env.addExtension("ChatExtension", new ChatExtension());
    });

    test("should render a simple chat message", () => {
      const template = `
        {% chat role="user" %}
        Hello, world!
        {% endchat %}
      `;

      const result = env.renderString(template, {});
      const message = JSON.parse(result.trim());

      expect(message.role).toBe("user");
      expect(message.content).toContain("Hello, world!");
    });

    test("should handle chat messages with variables", () => {
      const template = `
        {% chat role="system" %}
        You are a {{ persona }}.
        {% endchat %}
      `;

      const result = env.renderString(template, {
        persona: "helpful assistant",
      });
      const message = JSON.parse(result.trim());

      expect(message.role).toBe("system");
      expect(message.content).toContain("You are a helpful assistant.");
    });

    test("should include name attribute if provided", () => {
      const template = `{% chat role="tool", name="function_name" %}Function result{% endchat %}`;

      const result = env.renderString(template, {});
      const message = JSON.parse(result.trim());

      expect(message.role).toBe("tool");
      expect(message.name).toBe("function_name");
    });

    test("should throw error for invalid role", () => {
      const template = `
        {% chat role="invalid_role" %}
        This should fail
        {% endchat %}
      `;

      expect(() => {
        env.renderString(template, {});
      }).toThrow(/Invalid role/);
    });

    test("should process content blocks", () => {
      const template = `
        {% chat role="user" %}
        Look at this: <content_block>{"type":"image_url","image_url":{"url":"https://example.com/image.jpg"}}</content_block>
        {% endchat %}
      `;

      const result = env.renderString(template, {});
      const message = JSON.parse(result.trim());

      expect(Array.isArray(message.content)).toBe(true);
      if (Array.isArray(message.content)) {
        expect(message.content.length).toBeGreaterThan(1);
        expect(
          message.content.find(
            (block: { type: ContentBlockType }) =>
              block.type === ContentBlockType.image_url
          )
        ).toBeTruthy();
      }
    });
  });
});
