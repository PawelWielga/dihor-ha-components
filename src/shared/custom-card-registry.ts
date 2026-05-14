interface CustomCardMetadata {
  type: string;
  name: string;
  preview?: boolean;
  description?: string;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardMetadata[];
  }
}

export function registerCustomCard(metadata: CustomCardMetadata): void {
  window.customCards = window.customCards || [];

  const existingIndex = window.customCards.findIndex(
    (card) => card.type === metadata.type
  );

  if (existingIndex >= 0) {
    window.customCards[existingIndex] = metadata;
    return;
  }

  window.customCards.push(metadata);
}
