# capacitor-save-as

**Plugin ID:** `capacitor-save-as`
**Main Class:** `CapacitorSaveAs`

A modular Capacitor plugin for Android and iOS that provides a native "Save As" picker using Storage Access Framework (SAF) and UIDocumentPickerViewController.

## Features

## Installation

```bash
npm install capacitor-save-as
npx cap sync
```

## Usage

```ts
import { CapacitorSaveAs } from 'capacitor-save-as';

const saveData = async (json: object) => {
  const data = btoa(JSON.stringify(json)); // base64 encode
  await CapacitorSaveAs.showSaveAsPicker({
    filename: 'habits.json',
    mimeType: 'application/json',
    data,
  });
};
```

## API

### showSaveAsPicker(options)

- `filename`: string (default: 'export.json')
- `mimeType`: string (default: 'application/json')
- `data`: string (base64-encoded file contents)

Returns: `{ uri: string }` on success

## iOS Support

This plugin now supports iOS! On iOS, it presents the native "Save to device" picker using UIDocumentPickerViewController, allowing users to choose location and filename in the Files app or iCloud.

**How it works:**

- The plugin decodes your base64 data and writes it to a temporary file.
- It then presents the iOS "Save to device" picker so the user can select where to save the file.
- After export, the temporary file is cleaned up automatically.

**Note:**

- The API and usage are identical to Android. Just call `SaveAsPlugin.showSaveAsPicker(...)`.
- Returns `{ uri: string }` on success, or rejects if cancelled or failed.
