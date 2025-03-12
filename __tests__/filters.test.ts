import { cacheControl, tool } from "../filters";
import { ContentBlockType } from "../types";

// Mock fetchImageAsDataUrl for image filter tests
jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  fetchImageAsDataUrl: jest
    .fn()
    .mockResolvedValue("data:image/jpeg;base64,abc123"),
}));

describe("Filters", () => {
  describe("cacheControl", () => {
    test("should wrap text in a content block with default cache type", () => {
      const result = cacheControl("Test text");
      const parsed = JSON.parse(
        result.replace("<content_block>", "").replace("</content_block>", "")
      );

      expect(parsed.type).toBe(ContentBlockType.text);
      expect(parsed.text).toBe("Test text");
      expect(parsed.cache_control.type).toBe("ephemeral");
    });

    test("should use custom cache type", () => {
      const result = cacheControl("Test text", "persistent");
      const parsed = JSON.parse(
        result.replace("<content_block>", "").replace("</content_block>", "")
      );

      expect(parsed.cache_control.type).toBe("persistent");
    });

    test("should wrap the content in content_block tags", () => {
      const result = cacheControl("Test");
      expect(result).toMatch(/^<content_block>.*<\/content_block>$/);
    });
  });

  describe("tool", () => {
    test("should create a tool definition from a function", () => {
      function testFunction(param1: string, param2: number) {
        /**
         * Test function description
         * @param {string} param1 - First parameter
         * @param {number} param2 - Second parameter
         * @returns {string} The result
         */
        return `${param1}: ${param2}`;
      }

      const result = tool(testFunction);
      const parsed = JSON.parse(result);

      expect(parsed.type).toBe("function");
      expect(parsed.function.name).toBe("testFunction");
      expect(parsed.function.description).toBe("Test function description");
      expect(parsed.function.parameters.properties.param1.type).toBe("string");
      expect(parsed.function.parameters.properties.param1.description).toBe(
        "First parameter"
      );
      expect(parsed.function.parameters.properties.param2.type).toBe("number");
      expect(parsed.function.parameters.properties.param2.description).toBe(
        "Second parameter"
      );
    });

    test("should handle functions without docstrings", () => {
      function simpleFunction(a: string) {
        return a;
      }

      const result = tool(simpleFunction);
      const parsed = JSON.parse(result);

      expect(parsed.function.name).toBe("simpleFunction");
      expect(parsed.function.parameters.properties.a.type).toBe("string");
    });

    test("should include import path in tool definition", () => {
      function testFunction() {
        return "test";
      }

      const result = tool(testFunction);
      const parsed = JSON.parse(result);

      expect(parsed.import_path).toBeDefined();
    });
  });
});
