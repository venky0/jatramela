/**
 * Layer Auto-Organiser v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description:
 * A Photoshop script to automatically sort and group active layers based on 
 * their prefix name (e.g., bg_, txt_, btn_, shape_). Creates neat, structured groups.
 * 
 * How to use:
 * 1. Open a PSD document with several layers.
 * 2. Prefix your layers to categorise them, e.g., 'txt_Title', 'bg_Sky', 'btn_Search'.
 * 3. Run this script.
 * 4. Your layers will be automatically grouped into folders named "Backgrounds", "Texts", "Buttons", etc.
 */

(function() {
    if (app.documents.length === 0) {
        alert("Please open a Photoshop document first!");
        return;
    }

    var doc = app.activeDocument;
    
    // Group categories mapping (prefix -> group name)
    var categories = {
        "bg": { name: "Backgrounds", color: "gray", layers: [] },
        "txt": { name: "Text Elements", color: "blue", layers: [] },
        "btn": { name: "Buttons", color: "green", layers: [] },
        "icon": { name: "Icons & Badges", color: "orange", layers: [] },
        "img": { name: "Images & Artwork", color: "red", layers: [] },
        "shape": { name: "Shapes & Vectors", color: "yellow", layers: [] }
    };

    // Scan all top-level layers
    var layers = doc.layers;
    var toOrganiseCount = 0;

    for (var i = layers.length - 1; i >= 0; i--) {
        var layer = layers[i];
        if (layer.isBackgroundLayer) continue;
        
        var nameLower = layer.name.toLowerCase();
        for (var prefix in categories) {
            if (nameLower.indexOf(prefix + "_") === 0) {
                categories[prefix].layers.push(layer);
                toOrganiseCount++;
                break;
            }
        }
    }

    if (toOrganiseCount === 0) {
        alert("No layers found with matching prefix (bg_, txt_, btn_, icon_, img_, shape_).\nExample rename: Rename a text layer to 'txt_Header' and try again!");
        return;
    }

    // Process grouping
    var groupsCreated = 0;
    
    for (var key in categories) {
        var cat = categories[key];
        if (cat.layers.length === 0) continue;

        // Check if group already exists
        var group = null;
        try {
            group = doc.layerSets.getByName(cat.name);
        } catch (e) {
            // Create new group folder
            group = doc.layerSets.add();
            group.name = cat.name;
            groupsCreated++;
        }

        // Move matching layers into group
        for (var j = 0; j < cat.layers.length; j++) {
            var lyr = cat.layers[j];
            lyr.move(group, ElementPlacement.INSIDE);
        }
    }

    alert("Auto-Organisation Complete!\n- Sorted " + toOrganiseCount + " layers.\n- Created/updated " + groupsCreated + " folder group(s).");
})();
