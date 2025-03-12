// Core types for the prompt library

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | ContentBlock[];
  name?: string;
  tool_call_id?: string;
}

export enum ContentBlockType {
  text = "text",
  image_url = "image_url",
}

export interface CacheControl {
  type: string;
}

export interface ImageUrl {
  url: string;
}

export interface ContentBlock {
  type: ContentBlockType;
  cache_control?: CacheControl;
  text?: string;
  image_url?: ImageUrl;
}

export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<
        string,
        {
          type: string;
          description: string;
        }
      >;
      required: string[];
    };
  };
  import_path: string;
}

export interface RenderCache {
  get(context: Record<string, any>): string | null;
  set(context: Record<string, any>, prompt: string): void;
  clear(): void;
}

export interface PromptMetadata {
  [key: string]: any;
}
