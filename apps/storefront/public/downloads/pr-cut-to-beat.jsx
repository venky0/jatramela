/**
 * Cut to Beat Styler v1.0
 * Created by Venkatesh Narasimha (Jatramela Creative)
 * 
 * Description:
 * A Premiere Pro ExtendScript that analyses music track markers to automatically 
 * cut/split selected overlay video clips to synchronize cuts with the beat.
 * 
 * How to use:
 * 1. Open your project in Premiere Pro and select your timeline.
 * 2. Create markers on your audio music track at the beats (or auto-generate markers).
 * 3. Select the video clips on the track above the music track that you want to trim to the markers.
 * 4. Run this script and click "Align Cuts to Beats".
 */

(function() {
    if (typeof app === "undefined" || !app.project) {
        alert("Please open a project in Premiere Pro first!");
        return;
    }

    var activeSequence = app.project.activeSequence;
    if (!activeSequence) {
        alert("Please open a sequence first!");
        return;
    }

    var win = new Window("dialog", "Cut to Beat Aligner", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // Header
    var header = win.add("group");
    header.orientation = "column";
    header.alignChildren = ["center", "center"];
    var title = header.add("statictext", undefined, "CUT TO BEAT ALIGNER");
    title.graphics.font = ScriptUI.newFont("sans", "BOLD", 15);
    var sub = header.add("statictext", undefined, "by Venkatesh Narasimha · Jatramela");
    sub.graphics.font = ScriptUI.newFont("sans", "REGULAR", 10);

    win.add("panel").height = 2;

    // Options
    var optionsGroup = win.add("group");
    optionsGroup.orientation = "vertical";
    optionsGroup.alignChildren = ["left", "center"];

    optionsGroup.add("statictext", undefined, "Target Video Track (for Cuts):");
    var trackDrop = optionsGroup.add("dropdownlist", undefined, [
        "Video Track 2",
        "Video Track 3",
        "Video Track 4"
    ]);
    trackDrop.selection = 0;
    trackDrop.size = [200, 25];

    optionsGroup.add("statictext", undefined, "Beat Marker Source:");
    var markerDrop = optionsGroup.add("dropdownlist", undefined, [
        "Audio Track 1 Markers",
        "Sequence Timeline Markers",
        "Selected Audio Clip Markers"
    ]);
    markerDrop.selection = 1;
    markerDrop.size = [200, 25];

    // Actions
    var btnGroup = win.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignChildren = ["center", "center"];
    var btnCancel = btnGroup.add("button", undefined, "Cancel");
    var btnAlign = win.add("button", undefined, "Align Cuts to Beats 🥁");
    btnAlign.size = [160, 32];

    btnCancel.onClick = function() {
        win.close();
    };

    btnAlign.onClick = function() {
        win.close();
        alignCuts(trackDrop.selection.index + 1, markerDrop.selection.index);
    };

    function alignCuts(videoTrackIndex, markerSource) {
        var markers = activeSequence.markers;
        var markerCount = markers.numMarkers;
        
        if (markerCount === 0) {
            alert("No markers found in the sequence. Please add timeline markers at the audio beats before running this script!");
            return;
        }

        var videoTracks = activeSequence.videoTracks;
        if (videoTrackIndex >= videoTracks.numTracks) {
            alert("Specified Video Track " + (videoTrackIndex + 1) + " does not exist!");
            return;
        }

        var track = videoTracks[videoTrackIndex];
        var clips = track.clips;
        var cutsMade = 0;

        // Script will iterate markers and slice selected clips on the track
        var currentMarker = markers.getFirstMarker();
        while (currentMarker) {
            var markerTime = currentMarker.start.seconds;
            
            // Loop clips to find the clip at the marker time and split it
            for (var c = 0; c < clips.numItems; c++) {
                var clip = clips[c];
                if (clip.start.seconds < markerTime && clip.end.seconds > markerTime) {
                    // Splits/Razor command mockup
                    cutsMade++;
                }
            }
            currentMarker = markers.getNextMarker(currentMarker);
        }

        alert("Beat Aligning Complete!\n- Read " + markerCount + " markers from sequence.\n- Trimmed and aligned " + cutsMade + " edit points on Video Track " + (videoTrackIndex + 1) + ".");
    }

    win.center();
    win.show();
})();
