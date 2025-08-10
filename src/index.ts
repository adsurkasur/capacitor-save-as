import { registerPlugin } from '@capacitor/core';

export interface SaveAsPlugin {
  showSaveAsPicker(options: {
    filename: string;
    mimeType: string;
    data: string; // base64 string
  }): Promise<{ uri: string }>;
}

export const SaveAsPlugin = registerPlugin<SaveAsPlugin>('SaveAsPlugin');
