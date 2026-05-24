/**
 * Auto Text Animator v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description: 
 * An After Effects script to apply dynamic animations to selected text layers 
 * without manually creating keyframes. Uses advanced expression templates.
 * 
 * How to use:
 * 1. Open After Effects.
 * 2. Go to File -> Scripts -> Run Script File...
 * 3. Select this file (ae-auto-text.jsx).
 * 4. Select a Text Layer in your composition, choose an animation style, and click "Apply Animation".
 */

(function(thisObj) {
    function buildUI(container) {
        var myPanel = (container instanceof Panel) ? container : new Window("palette", "Auto Text Animator", undefined, {resizeable: true});
        
        myPanel.orientation = "column";
        myPanel.alignChildren = ["fill", "top"];
        myPanel.spacing = 10;
        myPanel.margins = 16;

        // Title Header
        var titleGroup = myPanel.add("group");
        titleGroup.orientation = "column";
        titleGroup.alignChildren = ["center", "center"];
        var mainTitle = titleGroup.add("statictext", undefined, "AUTO TEXT ANIMATOR");
        mainTitle.graphics.font = ScriptUI.newFont("sans", "BOLD", 16);
        var subTitle = titleGroup.add("statictext", undefined, "by Venkatesh Narasimha · Jatramela");
        subTitle.graphics.font = ScriptUI.newFont("sans", "REGULAR", 10);

        // Separator
        var divider = myPanel.add("panel");
        divider.height = 2;

        // Dropdown selection
        var selectionGroup = myPanel.add("group");
        selectionGroup.orientation = "vertical";
        selectionGroup.alignChildren = ["left", "center"];
        
        selectionGroup.add("statictext", undefined, "Select Animation Style:");
        var styleDropdown = selectionGroup.add("dropdownlist", undefined, [
            "Kinetic Type Pop & Bounce",
            "Glitch Text",
            "Smooth Slide Reveal",
            "Fade Word-by-Word",
            "Decay Bounce Back"
        ]);
        styleDropdown.selection = 0;
        styleDropdown.size = [200, 25];

        // Apply Button
        var btnApply = myPanel.add("button", undefined, "Apply Animation ✨");
        btnApply.size = [200, 35];
        
        // Help Text
        var helpText = myPanel.add("statictext", undefined, "Select a text layer in your active comp before applying.", {multiline: true});
        helpText.size = [200, 45];
        helpText.graphics.font = ScriptUI.newFont("sans", "ITALIC", 9);

        btnApply.onClick = function() {
            var activeComp = app.project.activeItem;
            if (!activeComp || !(activeComp instanceof CompItem)) {
                alert("Please select a composition first!");
                return;
            }
            
            var selectedLayers = activeComp.selectedLayers;
            if (selectedLayers.length === 0) {
                alert("Please select a Text Layer in your composition!");
                return;
            }

            app.beginUndoGroup("Apply Auto Text Animation");

            var count = 0;
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                if (layer instanceof TextLayer) {
                    applyAnimationExpression(layer, styleDropdown.selection.index);
                    count++;
                }
            }

            app.endUndoGroup();

            if (count > 0) {
                alert("Successfully applied '" + styleDropdown.selection.text + "' to " + count + " text layer(s)!");
            } else {
                alert("No Text Layers were found in your selection.");
            }
        };

        myPanel.layout.layout(true);
        return myPanel;
    }

    function applyAnimationExpression(textLayer, animIndex) {
        var textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
        var transformProp = textLayer.property("ADBE Transform Group");
        
        // Let's apply expressions based on chosen style
        if (animIndex === 0) {
            // Kinetic Type Pop & Bounce (Scale Expression)
            var scaleProp = transformProp.property("ADBE Scale");
            var bounceExpr = 
                "// Kinetic Bounce by Venkatesh Narasimha\n" +
                "amp = 0.08;\n" +
                "freq = 3.0;\n" +
                "decay = 6.0;\n" +
                "n = 0;\n" +
                "if (numKeys > 0){\n" +
                "n = nearestKey(time).index;\n" +
                "if (key(n).time > time){n--;}\n" +
                "}\n" +
                "if (n == 0){ t = 0; }else{ t = time - key(n).time; }\n" +
                "if (n > 0 && t < 1.0){\n" +
                "v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n" +
                "value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n" +
                "}else{ value; }";
            
            // Add scale keyframes to give it a trigger if none exist
            if (scaleProp.numKeys === 0) {
                scaleProp.setValueAtTime(0, [0, 0, 100]);
                scaleProp.setValueAtTime(0.2, [100, 100, 100]);
            }
            scaleProp.expression = bounceExpr;

        } else if (animIndex === 1) {
            // Glitch Text (Character Offset / Source Text expression or Position Glitch)
            var posProp = transformProp.property("ADBE Position");
            var glitchExpr = 
                "// Glitch Expression by Venkatesh Narasimha\n" +
                "posterizeTime(12);\n" +
                "probability = 0.15;\n" +
                "glitchRange = 30;\n" +
                "if(random(0, 1) < probability){\n" +
                "  value + [random(-glitchRange, glitchRange), random(-glitchRange, glitchRange)];\n" +
                "} else {\n" +
                "  value;\n" +
                "}";
            posProp.expression = glitchExpr;

        } else if (animIndex === 2) {
            // Smooth Slide Reveal (Position with Expression-based ease)
            var posProp = transformProp.property("ADBE Position");
            var slideExpr = 
                "// Smooth Slide Reveal Expression\n" +
                "t = time - inPoint;\n" +
                "duration = 0.5;\n" +
                "startPos = value + [0, 150];\n" +
                "endPos = value;\n" +
                "easeOutQuad = function(t, b, c, d) {\n" +
                "  t /= d;\n" +
                "  return -c * t*(t-2) + b;\n" +
                "};\n" +
                "if (t < duration) {\n" +
                "  easeOutQuad(t, startPos, endPos - startPos, duration);\n" +
                "} else {\n" +
                "  endPos;\n" +
                "}";
            posProp.expression = slideExpr;

        } else if (animIndex === 3) {
            // Fade Word-by-Word (Using Text Animator Opacity)
            var anims = textLayer.property("ADBE Text Properties").property("ADBE Text Animators");
            var animator = anims.addProperty("ADBE Text Animator");
            var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Range Selector");
            
            // Set word based selection
            selector.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2); // Words
            
            var opacityProp = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
            opacityProp.setValue(0);
            
            // Keyframe range start
            var startProp = selector.property("ADBE Text Percent Start");
            startProp.setValueAtTime(0, 0);
            startProp.setValueAtTime(1.5, 100);

        } else if (animIndex === 4) {
            // Decay Bounce Back
            var scaleProp = transformProp.property("ADBE Scale");
            var decayExpr = 
                "// Decay Bounce Back Expression\n" +
                "freq = 4;\n" +
                "decay = 8;\n" +
                "t = time - inPoint;\n" +
                "if (t < 0) t = 0;\n" +
                "w = Math.sin(t*freq*Math.PI*2)/Math.exp(t*decay);\n" +
                "value + [w*20, w*20];";
            scaleProp.expression = decayExpr;
        }
    }

    var aeAutoTextPanel = buildUI(thisObj);
    if (aeAutoTextPanel instanceof Window) {
        aeAutoTextPanel.center();
        aeAutoTextPanel.show();
    }
})(this);
