declare module "*.html" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

// Typing for Lovelace custom card metadata used by HACS / Lovelace editor
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name?: string;
      preview?: boolean;
      description?: string;
    }>;
  }
}
