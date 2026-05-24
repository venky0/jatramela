/**
 * Social Media Batch Resizer v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description:
 * A Photoshop script to batch-process a folder of images, resizing them 
 * automatically to standard social media resolutions in one operation.
 * 
 * How to use:
 * 1. Open Photoshop.
 * 2. Go to File -> Scripts -> Browse...
 * 3. Select this file (ps-batch-resize.jsx).
 * 4. Choose input/output directories and resolutions, and click "Run Resizer".
 */

(function() {
    var win = new Window("dialog", "Social Media Batch Resizer", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // Header
    var header = win.add("group");
    header.orientation = "column";
    header.alignChildren = ["center", "center"];
    var title = header.add("statictext", undefined, "SOCIAL MEDIA BATCH RESIZER");
    title.graphics.font = ScriptUI.newFont("sans", "BOLD", 16);
    var sub = header.add("statictext", undefined, "by Venkatesh Narasimha · Jatramela");
    sub.graphics.font = ScriptUI.newFont("sans", "REGULAR", 10);

    win.add("panel").height = 2;

    // Directories
    var dirPanel = win.add("panel", undefined, "Folders Selection");
    dirPanel.orientation = "column";
    dirPanel.alignChildren = ["left", "top"];
    dirPanel.margins = 12;
    dirPanel.spacing = 8;

    var inputGrp = dirPanel.add("group");
    var btnInput = inputGrp.add("button", undefined, "Input Folder…");
    btnInput.size = [120, 25];
    var txtInput = inputGrp.add("statictext", undefined, "No input folder selected", {truncate: "middle"});
    txtInput.size = [200, 20];

    var outputGrp = dirPanel.add("group");
    var btnOutput = outputGrp.add("button", undefined, "Output Folder…");
    btnOutput.size = [120, 25];
    var txtOutput = outputGrp.add("statictext", undefined, "No output folder selected", {truncate: "middle"});
    txtOutput.size = [200, 20];

    var inputFolder = null;
    var outputFolder = null;

    btnInput.onClick = function() {
        var f = Folder.selectDialog("Select input folder containing source images");
        if (f) {
            inputFolder = f;
            txtInput.text = f.displayName;
        }
    };

    btnOutput.onClick = function() {
        var f = Folder.selectDialog("Select output folder for resized images");
        if (f) {
            outputFolder = f;
            txtOutput.text = f.displayName;
        }
    };

    // Target Sizes
    var sizePanel = win.add("panel", undefined, "Social Media Formats");
    sizePanel.orientation = "column";
    sizePanel.alignChildren = ["left", "top"];
    sizePanel.margins = 12;
    sizePanel.spacing = 6;

    var chkInstaSquare = sizePanel.add("checkbox", undefined, "Instagram Square (1080 × 1080)");
    var chkInstaPortrait = sizePanel.add("checkbox", undefined, "Instagram Portrait (1080 × 1350)");
    var chkYoutubeThumb = sizePanel.add("checkbox", undefined, "YouTube Thumbnail (1280 × 720)");
    var chkStories = sizePanel.add("checkbox", undefined, "Stories / Reels (1080 × 1920)");

    chkInstaSquare.value = true;
    chkYoutubeThumb.value = true;

    // Actions
    var btnGroup = win.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignChildren = ["center", "center"];
    var btnCancel = btnGroup.add("button", undefined, "Cancel");
    var btnRun = btnGroup.add("button", undefined, "Run Resizer 🚀");
    btnRun.size = [120, 30];

    btnCancel.onClick = function() {
        win.close();
    };

    btnRun.onClick = function() {
        if (!inputFolder) {
            alert("Please choose an input folder!");
            return;
        }
        if (!outputFolder) {
            alert("Please choose an output folder!");
            return;
        }

        var sizes = [];
        if (chkInstaSquare.value) sizes.push({name: "insta_square", w: 1080, h: 1080});
        if (chkInstaPortrait.value) sizes.push({name: "insta_portrait", w: 1080, h: 1350});
        if (chkYoutubeThumb.value) sizes.push({name: "youtube_thumb", w: 1280, h: 720});
        if (chkStories.value) sizes.push({name: "story_reels", w: 1080, h: 1920});

        if (sizes.length === 0) {
            alert("Please select at least one social media size format!");
            return;
        }

        var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|psd)$/i);
        if (files.length === 0) {
            alert("No supported images found in input folder!");
            return;
        }

        win.close();
        processBatch(files, sizes, outputFolder);
    };

    function processBatch(files, sizes, destFolder) {
        var originalRuler = app.preferences.rulerUnits;
        app.preferences.rulerUnits = Units.PIXELS;

        var count = 0;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            
            for (var j = 0; j < sizes.length; j++) {
                var size = sizes[j];
                var doc = open(file);
                
                // Resize with aspect ratio preservation (using Fit Image approach or canvas resize)
                var widthRatio = size.w / doc.width;
                var heightRatio = size.h / doc.height;
                var scale = Math.max(widthRatio, heightRatio); // Cover mode
                
                doc.resizeImage(doc.width * scale, doc.height * scale, undefined, ResampleMethod.BICUBICSHARPER);
                doc.resizeCanvas(size.w, size.h, AnchorPosition.MIDDLECENTER);

                // Save as JPEG
                var newName = file.name.substring(0, file.name.lastIndexOf(".")) + "_" + size.name + ".jpg";
                var saveFile = new File(destFolder.fsName + "/" + newName);
                
                var saveOptions = new JPEGSaveOptions();
                saveOptions.quality = 9; // High quality
                saveOptions.embedColorProfile = true;
                saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;

                doc.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);
                doc.close(SaveOptions.DONOTSAVECHANGES);
            }
            count++;
        }

        app.preferences.rulerUnits = originalRuler;
        alert("Batch resize complete! Successfully processed " + count + " source image(s) into " + (count * sizes.length) + " files.");
    }

    win.center();
    win.show();
})();
