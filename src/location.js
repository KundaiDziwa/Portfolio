function switchBackground(time) {
    if (time == "day") {
        document.getElementById("world").style.background = "linear-gradient(#c9f6ff, #35d6ed)";
    }
    if (time == "dusk") {
        document.getElementById("world").style.background = "linear-gradient(#4e5481, #264a80)";
    }
    if (time == "dawn") {
        document.getElementById("world").style.background = "linear-gradient(#e4e0ba, #f7d9aa)";
    }
    if (time == "night") {
        document.getElementById("world").style.background = "linear-gradient(#101114, #1b1e23)";
    }
    if (time == "cloudy") {
        document.getElementById("world").style.background = "linear-gradient(#d2dfe5, #becdd4)";
    }
}