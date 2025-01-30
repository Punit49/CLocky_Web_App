// World Clock - 
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
let timeZoneList = [];
let zoneIntervals = {};
let zoneCount = 0;
const timeZoneElements = {};
let wrapper = document.querySelector(".wrapper");

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

const callAPI = async (callValue) => {
    const Zones  = await getZoneNames(callValue);
    getTimeZone(Zones);
    return Zones;
} 

sCountry.addEventListener("change", async () => {
    let newval = CountryList[sCountry.value];
    const data1 = callAPI(newval);
});

sTimeZone.addEventListener("change", () => {
    ZoneTitle.value = sTimeZone.value;
});

const addClock = async (selectZone, Mywindow) => {

    if(!timeZoneList.includes(selectZone) || Mywindow){ 
        zoneCount++;
        
        if(!Mywindow){
            timeZoneList.push(selectZone);
            localStorage.setItem("timeZoneList", JSON.stringify(timeZoneList));
        }

        let zoneElement = document.createElement("div");
        zoneElement.classList.add("timeItems");
        zoneElement.setAttribute("id", `zone-${zoneCount}`);
        zoneElement.innerHTML = `
                    <div class="timeHeader">
                        <div class="timeTitle">                            
                                    
                        </div>
                        <i class="fa-solid delete fa-trash-can"></i>
                    </div>
                    <div class="timeContent">
                        <div class="zoneTime" data-id = "time-${zoneCount}">
                        
                        </div>
                        <div class="zoneText">

                        </div>
                    </div>`

        timeContainer.appendChild(zoneElement);
        
        let newZone = selectZone.replace(/ /g, "_");
        let splittedZone = selectZone.split("/");

        if(selectZone == "Asia/Kolkata") { splittedZone = "New Delhi"; }
        else { splittedZone = splittedZone[splittedZone.length - 1]; }

        zoneElement.querySelector(".timeTitle").innerText = selectZone;

        if(zoneIntervals[selectZone]){
            clearInterval(zoneIntervals[selectZone]);
        }

        // Interval specific to that element only.
        timeZoneElements[selectZone] = document.querySelector(`[data-id = "time-${zoneCount}"]`);
       
        // if (clockInterval) clearInterval(clockInterval);
        zoneIntervals[selectZone] = setInterval(async () => {
            let FetchedData = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${encodeURIComponent(newZone)}`);
            let ResultData = await FetchedData.json();
            timeZoneElements[selectZone].innerText = `${ResultData.time} ${ResultData.seconds}`;
        }, 1000);
        
        zoneElement.querySelector(".delete").addEventListener("click", () => {
            clearInterval(zoneIntervals[selectZone]); 
            zoneElement.remove();
            timeZoneList = timeZoneList.filter(zone => zone !== newZone);
            localStorage.setItem("timeZoneList", JSON.stringify(timeZoneList));
        });
    }
};

okBtn2.addEventListener("click",  () => {
    let currentZone = sTimeZone.value;
     addClock(currentZone);
});

window.addEventListener("load", () => {
    let storedList = JSON.parse(localStorage.getItem("timeZoneList"));
    console.log("List = ", storedList);

    if(!(storedList == null)){
        timeZoneList = storedList;
        storedList.forEach((zones) => {
            addClock(zones, true);
        })
    }
});

function toggled2(){
    timePopUp.classList.toggle("InVisible");
    wrapper.classList.toggle("Active");
}
