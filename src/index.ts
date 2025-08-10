import { registerPlugin } from '@capacitor/core';

export interface SaveAs {
  showSaveAsPicker(options: {
    filename: string;
    mimeType: string;
    data: string; // base64 string
  }): Promise<{ uri: string }>;
}

export const SaveAs = registerPlugin<SaveAs>('SaveAs');
