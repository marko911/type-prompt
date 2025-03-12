import {
  generateCanaryWord,
  typeToJsonSchema,
  parseParamsFromDocstring,
} from "../utils";

// Mock crypto for generateCanaryWord
const mockRandomValues = jest.fn();
Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: mockRandomValues,
  },
});

describe("Utils", () => {
  describe("generateCanaryWord", () => {
    beforeEach(() => {
      mockRandomValues.mockImplementation((arr) => {
        // Fill with predictable values for testing
        for (let i = 0; i < arr.length; i++) {
          arr[i] = i;
        }
      });
    });

    test("should generate a canary word with default parameters", () => {
      const canary = generateCanaryWord();
      expect(canary).toMatch(/^BANKS\[[0-9a-f]{8}\]$/);
    });

    test("should use custom prefix and suffix", () => {
      const canary = generateCanaryWord("PREFIX-", "-SUFFIX");
      expect(canary).toMatch(/^PREFIX-[0-9a-f]{8}-SUFFIX$/);
    });

    test("should generate a token with specified length", () => {
      const canary = generateCanaryWord("", "", 4);
      expect(canary).toMatch(/^[0-9a-f]{4}$/);
    });
  });

  describe("typeToJsonSchema", () => {
    test("should convert string type", () => {
      expect(typeToJsonSchema("string")).toBe("string");
    });

    test("should convert number type", () => {
      expect(typeToJsonSchema("number")).toBe("number");
    });

    test("should convert boolean type", () => {
      expect(typeToJsonSchema("boolean")).toBe("boolean");
    });

    test("should convert object type", () => {
      expect(typeToJsonSchema("object")).toBe("object");
    });

    test("should convert array type", () => {
      expect(typeToJsonSchema("array")).toBe("array");
    });

    test("should default to string for unknown types", () => {
      expect(typeToJsonSchema("unknown")).toBe("string");
    });

    test("should be case insensitive", () => {
      expect(typeToJsonSchema("STRING")).toBe("string");
      expect(typeToJsonSchema("Number")).toBe("number");
    });
  });

  describe("parseParamsFromDocstring", () => {
    test("should return empty object for empty docstring", () => {
      expect(parseParamsFromDocstring("")).toEqual({});
    });

    test("should parse parameters from JSDoc-style docstring", () => {
      const docstring = `
        /**
         * Test function
         * @param {string} name - The name parameter
         * @param {number} age - The age parameter
         */
      `;

      const result = parseParamsFromDocstring(docstring);

      expect(result).toEqual({
        name: { description: "The name parameter" },
        age: { description: "The age parameter" },
      });
    });

    test("should handle docstring without parameters", () => {
      const docstring = `
        /**
         * Test function with no parameters
         */
      `;

      expect(parseParamsFromDocstring(docstring)).toEqual({});
    });
  });
});
