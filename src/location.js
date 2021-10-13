function switchBackground() {
    var time = sessionStorage.getItem("Time");
    if (time == "day") {
        document.getElementById("world").style.background = "linear-gradient(#c9f6ff, #35d6ed)";
        // document.getElementById("foot").style.background = "#35d6ed";
    }
    if (time == "dusk") {
        document.getElementById("world").style.background = "linear-gradient(#4e5481, #264a80)";
        // document.getElementById("foot").style.background = "#264a80";
    }
    if (time == "dawn") {
        document.getElementById("world").style.background = "linear-gradient(#e4e0ba, #f7d9aa)";
        // document.getElementById("foot").style.background = "#f7d9aa";
        
    }
    if (time == "night") {
        document.getElementById("world").style.background = "linear-gradient(#101114, #1b1e23)";
        // document.getElementById("foot").style.background = "#1b1e23";
    }
    if (time == "cloudy") {
        document.getElementById("world").style.background = "linear-gradient(#d2dfe5, #becdd4)";
        // document.getElementById("foot").style.background = "#becdd4";
    }
}
function saveTimeState(input) {
    sessionStorage.setItem("Time", input);
    switchBackground(); 
}
function savePlaceState(input) {
    sessionStorage.setItem("Place", input);
}
function saveControl(input) {
    sessionStorage.setItem("Control", input);
}