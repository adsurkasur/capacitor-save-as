import Foundation
import Capacitor

@objc(SaveAs)
public class SaveAs: CAPPlugin {
    @objc func showSaveAsPicker(_ call: CAPPluginCall) {
        guard let filename = call.getString("filename"),
              let mimeType = call.getString("mimeType"),
              let base64Data = call.getString("data"),
              let data = Data(base64Encoded: base64Data) else {
            call.reject("Missing or invalid parameters")
            return
        }

        // Write to temp file
        let tempDir = NSTemporaryDirectory()
        let tempFileURL = URL(fileURLWithPath: tempDir).appendingPathComponent(filename)
        do {
            try data.write(to: tempFileURL)
        } catch {
            call.reject("Failed to write temp file: \(error.localizedDescription)")
            return
        }

        DispatchQueue.main.async {
            let picker = UIDocumentPickerViewController(forExporting: [tempFileURL], asCopy: true)
            picker.delegate = self
            picker.modalPresentationStyle = .formSheet
            self.bridge?.viewController?.present(picker, animated: true, completion: nil)

            // Store call and tempFileURL for delegate
            self.currentCall = call
            self.tempFileURL = tempFileURL
        }
    }

    // MARK: - Delegate and state
    private var currentCall: CAPPluginCall?
    private var tempFileURL: URL?
}

// MARK: - UIDocumentPickerDelegate
extension SaveAs: UIDocumentPickerDelegate {
    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        // Success: file exported
        currentCall?.resolve(["uri": urls.first?.absoluteString ?? ""])
        cleanup()
    }

    public func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        currentCall?.reject("User cancelled export")
        cleanup()
    }

    private func cleanup() {
        if let tempFileURL = tempFileURL {
            try? FileManager.default.removeItem(at: tempFileURL)
        }
        currentCall = nil
        tempFileURL = nil
    }
}
