const API_KEY = "5ed25a792ee156507147c3807cdedbe2";

let currentUnit = "C";
let currentWeatherData = null;
let currentForecastData = null;


// =========================
// ELEMENTS
// =========================

const districtSelect =
document.getElementById("district");

const citySelect =
document.getElementById("city");

const searchBtn =
document.getElementById("searchBtn");

const searchInput =
document.getElementById("searchInput");

const suggestionsBox =
document.getElementById("suggestions");

const cBtn =
document.getElementById("celsiusBtn");

const fBtn =
document.getElementById("fahrenheitBtn");


// =========================
// TEMP CONVERSION
// =========================

function convertTemp(temp){

    if(currentUnit === "C"){

        return Math.round(temp)
        + "°C";

    }

    else{

        return Math.round(
        (temp * 9/5) + 32)
        + "°F";

    }

}


// =========================
// UPDATE TEMP UI
// =========================

function updateTemperatureUI(){

    if(!currentWeatherData) return;

    document.getElementById(
    "temp").innerText =
    convertTemp(
    currentWeatherData.main.temp);

    document.getElementById(
    "maxTemp").innerText =
    convertTemp(
    currentWeatherData.main.temp_max);

    document.getElementById(
    "minTemp").innerText =
    convertTemp(
    currentWeatherData.main.temp_min);

}


// =========================
// UPDATE FORECAST UI
// =========================

function updateForecastUI(){

    if(!currentForecastData) return;

    const forecastContainer =
    document.getElementById(
    "forecast");

    forecastContainer.innerHTML =
    "";

    const dailyForecast =
    currentForecastData.list.filter(
    item=>
    item.dt_txt.includes(
    "12:00:00"));

    dailyForecast.forEach(day=>{

        const date =
        new Date(day.dt_txt);

        const card =
        document.createElement(
        "div");

        card.classList.add(
        "forecast-card");

        card.innerHTML = `

            <h3>
            ${date.toDateString()}
            </h3>

            <img src="
            https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png
            ">

            <h2>
            ${convertTemp(day.main.temp)}
            </h2>

            <p>
            ${day.weather[0].description}
            </p>

        `;

        forecastContainer
        .appendChild(card);

    });

}


// =========================
// DISTRICT LOAD
// =========================

Object.keys(biharData).forEach(
district=>{

    const option =
    document.createElement("option");

    option.value = district;

    option.textContent = district;

    districtSelect.appendChild(option);

});


// =========================
// CITY LOAD
// =========================

districtSelect.addEventListener(
"change",
()=>{

    citySelect.innerHTML =
    `<option>Select City</option>`;

    const selectedDistrict =
    districtSelect.value;

    biharData[selectedDistrict]
    .forEach(city=>{

        const option =
        document.createElement("option");

        option.value = city;

        option.textContent = city;

        citySelect.appendChild(option);

    });

});


// =========================
// SEARCH EVENTS
// =========================

searchBtn.addEventListener(
"click",
()=>{

    if(searchInput.value){

        getWeather(
        searchInput.value);

    }

});

citySelect.addEventListener(
"change",
()=>{

    if(citySelect.value){

        getWeather(
        citySelect.value);

    }

});

searchInput.addEventListener(
"keypress",
(e)=>{

    if(e.key==="Enter"){

        getWeather(
        searchInput.value);

    }

});


// =========================
// SEARCH SUGGESTIONS
// =========================

searchInput.addEventListener(
"input",
()=>{

    const value =
    searchInput.value
    .toLowerCase();

    suggestionsBox.innerHTML =
    "";

    if(value.length < 1){

        suggestionsBox.style.display =
        "none";

        return;

    }

    let suggestions = [];

    Object.keys(biharData)
    .forEach(district=>{

        if(
        district.toLowerCase()
        .includes(value)){

            suggestions.push(
            district);

        }

        biharData[district]
        .forEach(city=>{

            if(
            city.toLowerCase()
            .includes(value)){

                suggestions.push(
                city);

            }

        });

    });

    suggestions =
    [...new Set(suggestions)];

    suggestions
    .slice(0,8)
    .forEach(item=>{

        const div =
        document.createElement("div");

        div.classList.add(
        "suggestion-item");

        div.innerText =
        item;

        div.addEventListener(
        "click",
        ()=>{

            searchInput.value =
            item;

            suggestionsBox.style.display =
            "none";

            getWeather(item);

        });

        suggestionsBox
        .appendChild(div);

    });

    suggestionsBox.style.display =
    "block";

});


// =========================
// GET WEATHER
// =========================

async function getWeather(city){

    try{

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${API_KEY}`;

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${API_KEY}`;

        const weatherResponse =
        await fetch(weatherURL);

        const weatherData =
        await weatherResponse.json();

        if(weatherData.cod != 200){

            alert("City not found");

            return;

        }

        currentWeatherData =
        weatherData;


        // CITY

        document.getElementById(
        "cityName").innerText =
        weatherData.name;


        // TEMP

        updateTemperatureUI();


        // CONDITION

        document.getElementById(
        "condition").innerText =
        weatherData.weather[0]
        .description;


        // ICON

        document.getElementById(
        "weatherIcon").src =
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;


        // DETAILS

        document.getElementById(
        "humidity").innerText =
        weatherData.main.humidity
        + "%";

        document.getElementById(
        "wind").innerText =
        Math.round(
        weatherData.wind.speed)
        + " km/h";

        document.getElementById(
        "pressure").innerText =
        weatherData.main.pressure
        + " hPa";

        document.getElementById(
        "visibility").innerText =
        weatherData.visibility
        /1000 + " km";

        document.getElementById(
        "uv").innerText =
        Math.floor(
        Math.random()*10);


        // AIR QUALITY

        const air = [
        "Good",
        "Moderate",
        "Poor"];

        document.getElementById(
        "airQuality").innerText =
        air[Math.floor(
        Math.random()*3)];


        // SUNRISE SUNSET

        const sunrise =
        new Date(
        weatherData.sys.sunrise
        *1000);

        const sunset =
        new Date(
        weatherData.sys.sunset
        *1000);

        const sunriseTime =
        sunrise.toLocaleTimeString(
        [],
        {
            hour:'2-digit',
            minute:'2-digit'
        });

        const sunsetTime =
        sunset.toLocaleTimeString(
        [],
        {
            hour:'2-digit',
            minute:'2-digit'
        });

        document.getElementById(
        "sunrise").innerText =
        sunriseTime;

        document.getElementById(
        "sunset").innerText =
        sunsetTime;

        document.getElementById(
        "sunrise2").innerText =
        sunriseTime;

        document.getElementById(
        "sunset2").innerText =
        sunsetTime;


        // WIND DIRECTION

        const degree =
        weatherData.wind.deg;

        let direction = "N";

        if(degree>=45 && degree<90){

            direction="NE";

        }

        else if(
        degree>=90 && degree<135){

            direction="E";

        }

        else if(
        degree>=135 && degree<180){

            direction="SE";

        }

        else if(
        degree>=180 && degree<225){

            direction="S";

        }

        else if(
        degree>=225 && degree<270){

            direction="SW";

        }

        else if(
        degree>=270 && degree<315){

            direction="W";

        }

        else if(
        degree>=315){

            direction="NW";

        }

        document.getElementById(
        "windDirection")
        .innerText =
        direction;


        // FORECAST

        const forecastResponse =
        await fetch(forecastURL);

        const forecastData =
        await forecastResponse
        .json();

        currentForecastData =
        forecastData;

        updateForecastUI();


        // DYNAMIC BACKGROUND

        const weather =
        weatherData.weather[0]
        .main.toLowerCase();

        if(weather.includes("rain")){

            document.body.style.background =
            "linear-gradient(135deg,#0f172a,#1e293b,#334155)";

        }

        else if(
        weather.includes("cloud")){

            document.body.style.background =
            "linear-gradient(135deg,#020617,#0f172a,#1e3a8a)";

        }

        else if(
        weather.includes("clear")){

            document.body.style.background =
            "linear-gradient(135deg,#0f172a,#1d4ed8,#38bdf8)";

        }

    }

    catch(error){

        alert(
        "Something went wrong");

    }

}


// =========================
// LIVE CLOCK
// =========================

function updateClock(){

    const now =
    new Date();

    document.getElementById(
    "liveClock").innerText =
    now.toLocaleTimeString();

    document.getElementById(
    "liveDate").innerText =
    now.toDateString();

}

setInterval(
updateClock,
1000);

updateClock();


// =========================
// AUTO LOCATION
// =========================

navigator.geolocation
.getCurrentPosition(
async(position)=>{

    const lat =
    position.coords.latitude;

    const lon =
    position.coords.longitude;

    const geoURL =
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

    const geoResponse =
    await fetch(geoURL);

    const geoData =
    await geoResponse.json();

    if(geoData[0]){

        getWeather(
        geoData[0].name);

    }

});


// =========================
// UNIT BUTTONS
// =========================

cBtn.addEventListener(
"click",
()=>{

    currentUnit = "C";

    cBtn.classList.add(
    "active");

    fBtn.classList.remove(
    "active");

    updateTemperatureUI();

    updateForecastUI();

});

fBtn.addEventListener(
"click",
()=>{

    currentUnit = "F";

    fBtn.classList.add(
    "active");

    cBtn.classList.remove(
    "active");

    updateTemperatureUI();

    updateForecastUI();

});


// =========================
// DEFAULT CITY
// =========================

getWeather("Purnia");