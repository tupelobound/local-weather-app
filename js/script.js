var date = new Date(); // get the system date
var hour = date.getHours(); // set a variable for the hour in order to change background depending on time of day
var nightState = ""; // set a variable to use so switch between night and day icons

// add a zero before numbers passed into function, and return the resulting string
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// set a variable for the time, using the strings from addZero function
var time = addZero(date.getHours()) + ":" + addZero(date.getMinutes());

// change the state of night depending on the time
if ((hour <= 23 && hour >= 19) || (hour >= 0 && hour < 6)) {
    nightState = "-night";
}

// change the background image based on the current time
if (hour < 21 && hour > 18) {
    $("body").addClass("dusk");
} else if (hour <= 18 && hour > 8) {
    $("body").addClass("day");
} else if (hour <= 8 && hour > 5) {
    $("body").addClass("dawn");
}

// get the location of the user and set the coordinates
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // use the coordinates to get the weather info from the API
        $.getJSON(
            `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`,
            function (json) {
                var weatherId = json.weather[0].id; // get the weather ID number
                var fOrC = "C"; // variable for displaying Celsius or Fahrenheit
                var tempC = Math.round(json.main.temp, 1); // get the current temperature
                var tempF = tempC * 9 / 5 + 32; // change the current temperature to Fahrenheit

                $('#content').animate({ // fade out loading message
                    opacity: 0
                }, 500, function () {
                    $("#location").html(json.name + ", " + json.sys.country); // display the current city and country
                    $("#time").html(time); // display the time
                    $("#weather").html(json.weather[0].description); // display the weather conditions
                    $("#temperature").html(tempC + "&#176" + fOrC); // display the temperature
                    $("#weather-icon").attr("class", `wi wi-owm${nightState}-${weatherId}`); // display a graphical representation of the weather based on the code generated by the API
                });
                $('#content').animate({ // fade in content
                    opacity: 1
                }, 500);

                // toggle the temperature between C and F when the temperature is clicked
                $("#temperature").on("click", function () {
                    $("#temperature").animate( // amimated fade-out
                        {
                            opacity: 0
                        },
                        300,
                        function () {
                            if (fOrC === "C") {
                                fOrC = "F";
                                $("#temperature").html(tempF + "&#176" + fOrC);
                            } else {
                                fOrC = "C";
                                $("#temperature").html(tempC + "&#176" + fOrC);
                            }
                        }
                    );
                    $("#temperature").animate( // animated fade-in
                        {
                            opacity: 1
                        },
                        300
                    );
                });
            }
        );
    });
}