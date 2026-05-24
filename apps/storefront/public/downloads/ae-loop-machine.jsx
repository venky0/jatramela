/**
 * Loop Machine v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description:
 * An After Effects script to easily apply loopOut expressions to selected layer properties.
 * Eliminates the need to type out expression syntax manually.
 * 
 * How to use:
 * 1. Select one or more properties with keyframes in your timeline (e.g. Position, Rotation).
 * 2. Run this script.
 * 3. Choose your loop type (Cycle, Ping-Pong, Continue, Offset) and click "Apply Loop".
 */

(function(thisObj) {
    function buildUI(container) {
        var myPanel = (container instanceof Panel) ? container : new Window("palette", "Loop Machine", undefined, {resizeable: true});
        
        myPanel.orientation = "column";
        myPanel.alignChildren = ["fill", "top"];
        myPanel.spacing = 12;
        myPanel.margins = 16;

        // Title Header
        var titleGroup = myPanel.add("group");
        titleGroup.orientation = "column";
        titleGroup.alignChildren = ["center", "center"];
        var mainTitle = titleGroup.add("statictext", undefined, "LOOP MACHINE");
        mainTitle.graphics.font = ScriptUI.newFont("sans", "BOLD", 16);
        var subTitle = titleGroup.add("statictext", undefined, "by Venkatesh Narasimha · Jatramela");
        subTitle.graphics.font = ScriptUI.newFont("sans", "REGULAR", 10);

        // Separator
        var divider = myPanel.add("panel");
        divider.height = 2;

        // Options
        var optionsGroup = myPanel.add("group");
        optionsGroup.orientation = "vertical";
        optionsGroup.alignChildren = ["left", "center"];
        
        optionsGroup.add("statictext", undefined, "Select Loop Style:");
        var loopTypeDropdown = optionsGroup.add("dropdownlist", undefined, [
            "Cycle (Repeat from start)",
            "Ping-Pong (Back and forth)",
            "Continue (Keep moving in last direction)",
            "Offset (Relative chain loop)"
        ]);
        loopTypeDropdown.selection = 0;
        loopTypeDropdown.size = [200, 25];

        optionsGroup.add("statictext", undefined, "Loop Mode:");
        var loopMethodDropdown = optionsGroup.add("dropdownlist", undefined, [
            "loopOut (Loop after last keyframe)",
            "loopIn (Loop before first keyframe)"
        ]);
        loopMethodDropdown.selection = 0;
        loopMethodDropdown.size = [200, 25];

        // Apply Button
        var btnApply = myPanel.add("button", undefined, "Apply Loop Expression 🔁");
        btnApply.size = [200, 35];
        
        // Remove Button
        var btnRemove = myPanel.add("button", undefined, "Remove Expressions 🗑️");
        btnRemove.size = [200, 25];

        btnApply.onClick = function() {
            var activeComp = app.project.activeItem;
            if (!activeComp || !(activeComp instanceof CompItem)) {
                alert("Please select a composition first!");
                return;
            }

            var selectedProperties = activeComp.selectedProperties;
            if (selectedProperties.length === 0) {
                alert("Please select at least one property with keyframes (e.g. Position, Rotation)!");
                return;
            }

            app.beginUndoGroup("Apply Loop Expression");

            var loopTypes = ["cycle", "pingpong", "continue", "offset"];
            var loopMethods = ["loopOut", "loopIn"];
            
            var selectedLoopType = loopTypes[loopTypeDropdown.selection.index];
            var selectedLoopMethod = loopMethods[loopMethodDropdown.selection.index];
            
            var expressionString = selectedLoopMethod + '("' + selectedLoopType + '");';
            
            var count = 0;
            for (var i = 0; i < selectedProperties.length; i++) {
                var prop = selectedProperties[i];
                if (prop.canSetExpression) {
                    prop.expression = expressionString;
                    count++;
                }
            }

            app.endUndoGroup();

            if (count > 0) {
                alert("Successfully applied expression to " + count + " property/properties:\n" + expressionString);
            } else {
                alert("Selected properties cannot accept expressions. Please select properties like Position, Scale, Rotation, Opacity, etc.");
            }
        };

        btnRemove.onClick = function() {
            var activeComp = app.project.activeItem;
            if (!activeComp || !(activeComp instanceof CompItem)) {
                alert("Please select a composition first!");
                return;
            }

            var selectedProperties = activeComp.selectedProperties;
            if (selectedProperties.length === 0) {
                alert("Please select at least one property to remove expressions!");
                return;
            }

            app.beginUndoGroup("Remove Expressions");

            var count = 0;
            for (var i = 0; i < selectedProperties.length; i++) {
                var prop = selectedProperties[i];
                if (prop.canSetExpression && prop.expression !== "") {
                    prop.expression = "";
                    count++;
                }
            }

            app.endUndoGroup();
            alert("Removed expressions from " + count + " property/properties.");
        };

        myPanel.layout.layout(true);
        return myPanel;
    }

    var aeLoopMachinePanel = buildUI(thisObj);
    if (aeLoopMachinePanel instanceof Window) {
        aeLoopMachinePanel.center();
        aeLoopMachinePanel.show();
    }
})(this);
