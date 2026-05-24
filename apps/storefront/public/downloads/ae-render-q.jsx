/**
 * Smart Render Queue v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description:
 * An After Effects script to speed up rendering workflows by batch-adding selected Compositions 
 * to the Render Queue with custom output names, paths, and settings templates.
 * 
 * How to use:
 * 1. Select one or more compositions in your Project panel.
 * 2. Run this script.
 * 3. Choose your export settings and directory, and click "Batch Render".
 */

(function(thisObj) {
    function buildUI(container) {
        var myPanel = (container instanceof Panel) ? container : new Window("palette", "Smart Render Queue", undefined, {resizeable: true});
        
        myPanel.orientation = "column";
        myPanel.alignChildren = ["fill", "top"];
        myPanel.spacing = 12;
        myPanel.margins = 16;

        // Title Header
        var titleGroup = myPanel.add("group");
        titleGroup.orientation = "column";
        titleGroup.alignChildren = ["center", "center"];
        var mainTitle = titleGroup.add("statictext", undefined, "SMART RENDER QUEUE");
        mainTitle.graphics.font = ScriptUI.newFont("sans", "BOLD", 16);
        var subTitle = titleGroup.add("statictext", undefined, "by Venkatesh Narasimha · Jatramela");
        subTitle.graphics.font = ScriptUI.newFont("sans", "REGULAR", 10);

        // Separator
        var divider = myPanel.add("panel");
        divider.height = 2;

        // Output Settings
        var settingsPanel = myPanel.add("panel", undefined, "Export Configuration");
        settingsPanel.orientation = "column";
        settingsPanel.alignChildren = ["left", "top"];
        settingsPanel.margins = 12;
        settingsPanel.spacing = 8;

        settingsPanel.add("statictext", undefined, "Render Settings Template:");
        var renderSettingsDrop = settingsPanel.add("dropdownlist", undefined, [
            "Best Settings",
            "Draft Settings",
            "DV Settings"
        ]);
        renderSettingsDrop.selection = 0;
        renderSettingsDrop.size = [180, 25];

        settingsPanel.add("statictext", undefined, "Output Module Template:");
        var outputModuleDrop = settingsPanel.add("dropdownlist", undefined, [
            "Lossless",
            "High Quality",
            "H.264 (Match Source)",
            "Alpha Channel Only"
        ]);
        outputModuleDrop.selection = 0;
        outputModuleDrop.size = [180, 25];

        // Folder Select
        var folderGroup = myPanel.add("group");
        folderGroup.orientation = "row";
        folderGroup.alignChildren = ["left", "center"];
        var btnSelectFolder = folderGroup.add("button", undefined, "Choose Dest…");
        btnSelectFolder.size = [100, 25];
        var destFolderLabel = folderGroup.add("statictext", undefined, "No folder selected", {truncate: "middle"});
        destFolderLabel.size = [120, 20];
        
        var selectedFolder = null;
        btnSelectFolder.onClick = function() {
            var f = Folder.selectDialog("Select Output Folder");
            if (f) {
                selectedFolder = f;
                destFolderLabel.text = f.displayName;
            }
        };

        // Actions
        var btnAddQueue = myPanel.add("button", undefined, "Batch Add to Render Queue 📤");
        btnAddQueue.size = [200, 35];

        btnAddQueue.onClick = function() {
            var selectedItems = app.project.selection;
            var comps = [];
            
            for (var i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i] instanceof CompItem) {
                    comps.push(selectedItems[i]);
                }
            }

            if (comps.length === 0) {
                alert("Please select one or more Compositions in the Project panel first!");
                return;
            }

            if (!selectedFolder) {
                alert("Please choose a destination folder first!");
                return;
            }

            app.beginUndoGroup("Batch Add Comps to Render Queue");

            var count = 0;
            for (var j = 0; j < comps.length; j++) {
                var comp = comps[j];
                var renderQueueItem = app.project.renderQueue.items.add(comp);
                
                // Set settings templates
                try {
                    renderQueueItem.applyTemplate(renderSettingsDrop.selection.text);
                } catch(e) {}
                
                try {
                    renderQueueItem.outputModule(1).applyTemplate(outputModuleDrop.selection.text);
                } catch(e) {}

                // Set output path and filename
                var outputModule = renderQueueItem.outputModule(1);
                var originalFile = outputModule.file;
                var formatExt = ".mov"; // Fallback extension
                if (outputModuleDrop.selection.text.indexOf("H.264") !== -1) {
                    formatExt = ".mp4";
                }
                
                var newOutputFile = new File(selectedFolder.fsName + "/" + comp.name + formatExt);
                outputModule.file = newOutputFile;
                count++;
            }

            app.endUndoGroup();
            alert("Successfully added " + count + " composition(s) to the Render Queue!");
        };

        myPanel.layout.layout(true);
        return myPanel;
    }

    var aeRenderQPanel = buildUI(thisObj);
    if (aeRenderQPanel instanceof Window) {
        aeRenderQPanel.center();
        aeRenderQPanel.show();
    }
})(this);
