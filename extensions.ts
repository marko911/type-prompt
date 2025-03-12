import nunjucks from "nunjucks";
import { ChatMessage, ContentBlock, ContentBlockType } from "./types";

/**
 * Chat extension for Nunjucks to handle chat message blocks
 */
export class ChatExtension {
  tags = ["chat"];

  /**
   * Parse the chat block and its attributes
   */
  parse(parser: any, nodes: any) {
    // Get the line number for error reporting
    const token = parser.nextToken();
    const lineno = token.lineno;

    // parse the role="value" part
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    // parse the content until endchat
    const body = parser.parseUntilBlocks("endchat");
    parser.advanceAfterBlockEnd();

    // return a CallExtension node
    return new nodes.CallExtension(this, "run", args, [body]);
  }

  /**
   * Process the chat block and format the output
   */
  run(context: any, args: any, body: any) {
    if (
      !args.role ||
      !["system", "user", "assistant", "tool"].includes(args.role)
    ) {
      throw new Error(
        `Invalid role: ${args.role}. Must be one of: system, user, assistant, tool`
      );
    }

    const content = body();
    const message: ChatMessage = { role: args.role, content };

    if (args.name) {
      message.name = args.name;
    }

    // Process content blocks if any
    const contentBlockRegex = /<content_block>(.*?)<\/content_block>/gs;
    const matches = [...content.matchAll(contentBlockRegex)];

    if (matches.length > 0) {
      const contentBlocks: ContentBlock[] = [];
      let lastEnd = 0;

      for (const match of matches) {
        // Add text before the match as a text content block
        if (match.index! > lastEnd) {
          const textBefore = content.substring(lastEnd, match.index!).trim();
          if (textBefore) {
            contentBlocks.push({
              type: ContentBlockType.text,
              text: textBefore,
            });
          }
        }

        // Add the parsed content block
        try {
          const contentBlock = JSON.parse(match[1]);
          contentBlocks.push(contentBlock);
          lastEnd = match.index! + match[0].length;
        } catch (error) {
          console.error("Failed to parse content block:", error);
        }
      }

      // Add any text after the last match
      if (lastEnd < content.length) {
        const textAfter = content.substring(lastEnd).trim();
        if (textAfter) {
          contentBlocks.push({
            type: ContentBlockType.text,
            text: textAfter,
          });
        }
      }

      // If we have content blocks, use them
      if (contentBlocks.length > 0) {
        message.content = contentBlocks;
      }
    }

    // Return the message as JSON
    return JSON.stringify(message);
  }
}

/**
 * Extension for LLM completions directly in the template
 * This is a simplified version - a full implementation would require
 * connecting to actual LLM providers
 */
export class CompletionExtension {
  tags = ["completion"];

  parse(parser: any, nodes: any) {
    const token = parser.nextToken();
    const lineno = token.lineno;

    // Parse attributes like model="gpt-3.5-turbo"
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    // Parse content until endcompletion
    const body = parser.parseUntilBlocks("endcompletion");
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, "run", args, [body]);
  }

  async run(context: any, args: any, body: any) {
    if (!args.model) {
      throw new Error("Completion requires a model parameter");
    }

    const content = body();

    // Extract chat messages and tools
    const messages = this.extractChatMessages(content);
    const tools = this.extractTools(content);

    // In a complete implementation, this would call an LLM API
    // For now, it returns a placeholder
    return `[Completion would be generated here using ${args.model} with ${messages.length} messages and ${tools.length} tools]`;
  }

  /**
   * Extract chat messages from completion content
   */
  private extractChatMessages(content: string): ChatMessage[] {
    const messages: ChatMessage[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const message = JSON.parse(trimmed);
        if (message.role && message.content) {
          messages.push(message);
        }
      } catch (e) {
        // Not a valid JSON message, skip
      }
    }

    return messages;
  }

  /**
   * Extract tools from completion content
   */
  private extractTools(content: string): any[] {
    const tools: any[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.type === "function" && parsed.function) {
          tools.push(parsed);
        }
      } catch (e) {
        // Not a valid JSON tool, skip
      }
    }

    return tools;
  }
}
