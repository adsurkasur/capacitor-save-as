package com.adsurkasur.saveas;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginMethod;
import java.io.OutputStream;

@CapacitorPlugin(name = "SaveAs")
public class SaveAs extends Plugin {
    private PluginCall savedCall;
    private ActivityResultLauncher<Intent> saveAsLauncher;

    @Override
    public void load() {
        saveAsLauncher = getActivity().registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (savedCall == null) return;
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                    Uri uri = result.getData().getData();
                    String data = savedCall.getString("data");
                    try (OutputStream out = getContext().getContentResolver().openOutputStream(uri)) {
                        byte[] bytes = Base64.decode(data, Base64.DEFAULT);
                        out.write(bytes);
                        JSObject ret = new JSObject();
                        ret.put("uri", uri.toString());
                        savedCall.resolve(ret);
                    } catch (Exception e) {
                        savedCall.reject("Failed to write file: " + e.getMessage());
                    }
                } else {
                    savedCall.reject("User cancelled");
                }
                savedCall = null;
            }
        );
    }

    @PluginMethod
    public void showSaveAsPicker(PluginCall call) {
        savedCall = call;
        String filename = call.getString("filename", "export.json");
        String mimeType = call.getString("mimeType", "application/json");
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(mimeType);
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        saveAsLauncher.launch(intent);
    }
}
