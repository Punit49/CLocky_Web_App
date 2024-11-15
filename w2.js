// World Clock - normal
// const wcc = require('world-countries-capitals');
// console.log(wcc);
let timePopUp = document.querySelector(".timePopUp");
let sCountry = document.querySelector("#sCountry");
let sTimeZone = document.querySelector("#sTimeZone");
let ZoneTitle = document.querySelector("#cTitle");
let okBtn2 = document.querySelector(".tBtn");
let timeTitle = document.querySelector(".timeTitle");
let zoneTime = document.querySelector(".zoneTime");
let zoneText = document.querySelector(".zoneText");
let clockInterval;
let timeContainer = document.querySelector(".timeZones");
let Delete = document.querySelector(".delete");

for (const count in CountryList) {
    let newOption = document.createElement("option");
    newOption.innerText = count;
    sCountry.appendChild(newOption);
    if(count == "India"){
        newOption.selected = "selected";
    }
}

// Function to get name of time zone - 
const getZoneNames = async (callValue) => {
    // This api will return time zone names using country codes [us. in]
    let Data = await fetch(`https://api.timezonedb.com/v2.1/list-time-zone?key=BDSKFSCPYC54&format=json&country=${callValue}`);
    let Result = await Data.json();
    let Zones = Result.zones;
    return Zones;
}

// Function to get Time Zones - Adding opiton in timezone menu
const getTimeZone = async (Zones) => {
    let counter = 0;
    sTimeZone.innerText = "";
    Zones.forEach(async zone => { 
        let MyZone = zone.zoneName;
        let exZone = MyZone.split("/");
        let newOption = document.createElement("option");
        newOption.innerText = exZone[exZone.length - 1];
        newOption.value = MyZone;  
        sTimeZone.appendChild(newOption);
        if(counter <= 0){
            ZoneTitle.value = sTimeZone.innerText;
            counter++;
        }
    });    
}

// function for api calls 
const callAPI = async (callValue) => {
    const Zones  = await getZoneNames(callValue);
    getTimeZone(Zones);
    return Zones;
} 

const ShowClock = async (currentZone) => {
    timeContainer.classList.add("show");
    if(clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(async () => {
        // changing space with _ [/g means all space ].
        let newZone = currentZone.replace(/ /g, "_");
        let FetchedData = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${encodeURIComponent(newZone)}`);
        let ResultData = await FetchedData.json();
        zoneTime.innerText = `${ResultData.time} ${ResultData.seconds}`;
    }, 1000);
}

sCountry.addEventListener("change", async () => {
    let newval = CountryList[sCountry.value];
    // Use API here
    const data1 = callAPI(newval);
});

sTimeZone.addEventListener("change", () => {
    ZoneTitle.value = sTimeZone.value;
});

const ResetZone = () => {
    timeContainer.classList.remove("show");
    clearInterval(clockInterval);
    localStorage.removeItem("currentZone");
    localStorage.removeItem("ZoneTitle");
}

okBtn2.addEventListener("click", async () => {
    ResetZone();
    let currentZone = sTimeZone.value;
    timeTitle.innerText = ZoneTitle.value;
    ShowClock(currentZone);
    localStorage.setItem("currentZone", currentZone);
    localStorage.setItem("ZoneTitle", ZoneTitle.value);
});

window.addEventListener("load", () => {
    let currentZone = localStorage.getItem("currentZone") || false;
    let ZoneTitle = localStorage.getItem("ZoneTitle") || false;
    if(currentZone){
        ShowClock(currentZone);
        timeTitle.innerText = ZoneTitle;
    }
});

Delete.addEventListener("click", () => {
    ResetZone();
});

function toggled2(){
    timePopUp.classList.toggle("Active2");
    Wrapper.classList.toggle("Active");
}