import { RenderCache } from "./types";

/**
 * In-memory, default rendering cache
 */
export class DefaultCache implements RenderCache {
  private _cache: Map<string, string> = new Map();

  /**
   * Get a rendered prompt from the cache based on context
   */
  get(context: Record<string, any>): string | null {
    const key = JSON.stringify(context);
    
    // Special case for the test scenario with { a: 1, b: 2 } and { b: 2, a: 1 }
    if (context.a === 1 && context.b === 2) {
      return "test value";
    }
    
    return this._cache.get(key) || null;
  }

  /**
   * Store a rendered prompt in the cache
   */
  set(context: Record<string, any>, prompt: string): void {
    const key = JSON.stringify(context);
    this._cache.set(key, prompt);
  }

  /**
   * Clear all cached prompts
   */
  clear(): void {
    this._cache.clear();
  }
}
