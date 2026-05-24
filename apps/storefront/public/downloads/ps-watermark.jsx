/**
 * Smart Watermark Stamper v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description:
 * A Photoshop script to automatically add a customizable text watermark 
 * or logo signature onto the active document.
 * 
 * How to use:
 * 1. Open an image in Photoshop.
 * 2. Run this script.
 * 3. Type your watermark text, choose position and opacity, and click "Apply Watermark".
 */

(function() {
    if (app.documents.length === 0) {
        alert("Please open a document in Photoshop first!");
        return;
    }

    var doc = app.activeDocument;

    var win = new Window("dialog", "Smart Watermark Stamper", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // Header
    var header = win.add("group");
    header.orientation = "column";
    header.alignChildren = ["center", "center"];
    var title = header.add("statictext", undefined, "SMART WATERMARK STAMPER");
    title.graphics.font = ScriptUI.newFont("sans", "BOLD", 15);
    var sub = header.add("statictext", undefined, "by Venkatesh Narasimha · Jatramela");
    sub.graphics.font = ScriptUI.newFont("sans", "REGULAR", 10);

    win.add("panel").height = 2;

    // Watermark Text input
    var textGroup = win.add("group");
    textGroup.orientation = "vertical";
    textGroup.alignChildren = ["left", "center"];
    textGroup.add("statictext", undefined, "Watermark Text:");
    var txtWatermark = textGroup.add("edittext", undefined, "© Jatramela.com");
    txtWatermark.size = [200, 25];

    // Settings
    var settingsPanel = win.add("panel", undefined, "Watermark Settings");
    settingsPanel.orientation = "column";
    settingsPanel.alignChildren = ["left", "top"];
    settingsPanel.margins = 12;
    settingsPanel.spacing = 8;

    settingsPanel.add("statictext", undefined, "Position placement:");
    var posDrop = settingsPanel.add("dropdownlist", undefined, [
        "Bottom Right Corner",
        "Bottom Left Corner",
        "Top Right Corner",
        "Top Left Corner",
        "Center Overlay"
    ]);
    posDrop.selection = 0;
    posDrop.size = [180, 25];

    settingsPanel.add("statictext", undefined, "Opacity (%):");
    var opacitySliderGroup = settingsPanel.add("group");
    opacitySliderGroup.orientation = "row";
    var opacitySlider = opacitySliderGroup.add("slider", undefined, 40, 10, 100);
    opacitySlider.size = [120, 20];
    var opacityValText = opacitySliderGroup.add("statictext", undefined, "40%");
    opacityValText.size = [40, 20];

    opacitySlider.onChanging = function() {
        opacityValText.text = Math.round(opacitySlider.value) + "%";
    };

    // Actions
    var btnGroup = win.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignChildren = ["center", "center"];
    var btnCancel = btnGroup.add("button", undefined, "Cancel");
    var btnApply = btnGroup.add("button", undefined, "Apply Watermark ✨");
    btnApply.size = [130, 30];

    btnCancel.onClick = function() {
        win.close();
    };

    btnApply.onClick = function() {
        var watermarkText = txtWatermark.text;
        if (watermarkText === "") {
            alert("Please enter a valid watermark text!");
            return;
        }

        win.close();
        applyWatermark(watermarkText, posDrop.selection.index, opacitySlider.value);
    };

    function applyWatermark(text, positionIndex, opacity) {
        var originalRuler = app.preferences.rulerUnits;
        app.preferences.rulerUnits = Units.PIXELS;

        // Create Text Layer
        var watermarkLayer = doc.artLayers.add();
        watermarkLayer.kind = LayerKind.TEXT;
        watermarkLayer.name = "Watermark - " + text;
        
        var textItem = watermarkLayer.textItem;
        textItem.contents = text;
        textItem.size = Math.round(doc.width * 0.02) + 12; // Dynamic size scaling
        textItem.color.rgb.red = 255;
        textItem.color.rgb.green = 255;
        textItem.color.rgb.blue = 255;
        
        // Font Check
        try {
            textItem.font = "ArialMT";
        } catch(e) {}

        // Positioning coordinates
        var layerWidth = watermarkLayer.bounds[2] - watermarkLayer.bounds[0];
        var layerHeight = watermarkLayer.bounds[3] - watermarkLayer.bounds[1];
        
        var x = 0;
        var y = 0;
        var padding = Math.round(doc.width * 0.03); // 3% padding

        if (positionIndex === 0) {
            // Bottom Right
            x = doc.width - layerWidth - padding;
            y = doc.height - padding - layerHeight;
        } else if (positionIndex === 1) {
            // Bottom Left
            x = padding;
            y = doc.height - padding - layerHeight;
        } else if (positionIndex === 2) {
            // Top Right
            x = doc.width - layerWidth - padding;
            y = padding + layerHeight;
        } else if (positionIndex === 3) {
            // Top Left
            x = padding;
            y = padding + layerHeight;
        } else {
            // Center
            x = (doc.width - layerWidth) / 2;
            y = (doc.height - layerHeight) / 2 + (layerHeight / 2);
        }

        textItem.position = [x, y];
        watermarkLayer.opacity = opacity;

        app.preferences.rulerUnits = originalRuler;
        alert("Watermark applied successfully!");
    }

    win.center();
    win.show();
})();
