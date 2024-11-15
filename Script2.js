// Alarm Clock - 
let time = document.querySelector(".Time");
let date = document.querySelector(".date");
let addBtn =  document.querySelector(".addBtn");
let Body = document.querySelector("body");
let popUp = document.querySelector(".popUp");
let Wrapper = document.querySelector(".wrapper");
let selectHour = document.querySelector(".forHour");
let selectMint = document.querySelector(".forMinute");
let SubmitBtn = document.querySelector(".submit");
let audios = document.getElementById("audio1");
let curAlarm = document.querySelector(".currentAlarm");
let curAlarmTime = document.querySelector(".alarmTime");
let alarmTitle = document.querySelector(".alarmTitle");
let inputTitle = document.querySelector(".title");
let alarmCount = document.querySelector(".alarmCount");
let MyalarmInMs = 0;
let MyInterval = 0;
let alarmHasRung = false;
let stopBtn = document.querySelector(".stopAlarmBtn");
let ringPopUp = document.querySelector(".popUpForAlarm");
let okBtn = document.querySelector(".okBtn");
let alarmRungTime = document.querySelector(".alarmRungTime");
let alarmRingTitle = document.querySelector(".alarmRingTitle");
let ringTitle = document.querySelector(".ringTitle");
localStorage.setItem("Stop","false");
localStorage.setItem("Hour", JSON.stringify(Hour));
let storedHour = JSON.parse(localStorage.getItem("Hour"));
let selectedRing = document.querySelector(".ringtoneSelct");
let testBtn = document.querySelector(".testRing");

var stopAudio = () => {
    audios.pause();
    audios.currentTime = 0; 
}

// Current Time 
const displayTime = () => {
    let now = new Date();
    time.innerText = now.toLocaleTimeString();
    date.innerText = now.toDateString();
}
setInterval(displayTime, 1000);

// Populating Options in Time Selecter -
// Hour
for (const hr in Hour) {
    let newOption = document.createElement("option");
    newOption.innerText = hr; 
    selectHour.appendChild(newOption);    
}

// Minute
for (const min of Minute) {
    let newOption = document.createElement("option");
    newOption.innerText = min;
    selectMint.appendChild(newOption);
}

// Main Logic -// Function for submitting a new alarm
const WakeAlarm = (hour, min) => { 
    let alarmTime = new Date();
    let now = new Date();

    alarmTime.setHours(hour);
    alarmTime.setMinutes(min);
    alarmTime.setSeconds(0);
    alarmTime.setMilliseconds(0);

    // Retrieve the alarmHasRung status from localStorage
    let alarmHasRung = JSON.parse(localStorage.getItem("alarmHasRung")) || false;
    
    // If alarm time is in the past and the alarm hasn't rung, set it for the next day
    if (alarmTime.getTime() <= now.getTime() && !alarmHasRung) {        
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    // Calculate the time left until the alarm
    let wakeMeAt = alarmTime.getTime() - now.getTime();

    localStorage.setItem("alarmEndTime", alarmTime.getTime().toString());
    return wakeMeAt;
}

// Countdown Timer - 
const countDownTimer = (hr, min) => {
    let distance  = WakeAlarm(hr, min);

    // Define time constants
    const oneDayInMs = (24 * 60 * 60 * 1000);  
    const oneHourInMs = (60 * 60 * 1000);      
    const oneMinInMs = (60 * 1000);  

    // Calculate days, hours, minutes, and seconds remaining
    let Hour = Math.floor((distance % oneDayInMs) / oneHourInMs);
    let Mint = Math.floor((distance % oneHourInMs) / oneMinInMs);
    let Sec = Math.floor((distance % oneMinInMs) / 1000); 

    alarmCount.innerText = `${Hour}:${Mint}:${Sec}`;
}

// Current Alarm Mini Window - // can be improve am and pm common
const showCurrentAlarm = (where, hr, min) => { 
    let splitedVal = (hr.toString()).split(" "); 
    let newHr = splitedVal[0];
    let Ex = splitedVal[1];
    where.innerText = `${newHr} : ${min} ${Ex}`;  
    alarmTitle.innerText = inputTitle.value;
}

const ResetAlarm = () => {
    curAlarm.classList.add("curHidden");
    alarmCount.innerText = `${"00"}:${"00"}:${"00"}`;
    localStorage.removeItem("AlramTime");
    localStorage.removeItem("AlarmTitle");
    localStorage.removeItem("selectedRing");
    localStorage.setItem("alarmHasRung", JSON.stringify(false));
    clearInterval(MyInterval); 
}

const PlayAudio = (CurRing) => {
    let Myring = JSON.parse(localStorage.getItem("selectedRing")) || CurRing;
    audios.src = Myring; 
    console.log("Alarm Ringing");
    audios.play();
}

const ShowAndClear = (alarmInMs, MyHour, HourVal, MyMin) => {
    if (MyInterval) clearInterval (MyInterval);
    
    // Set an interval to update the countdown every second
    MyInterval = setInterval(() => {
        countDownTimer(HourVal, MyMin);
    }, 1000);

    // Set a timeout to ring the alarm after the specified time
    setTimeout(() => {
        let myStop = localStorage.getItem("Stop");
        if (myStop === "false") {  
            PlayAudio(); 
            showPopUP(MyHour, MyMin);
            ResetAlarm(); 
            // alarmHasRung = true;
            localStorage.setItem("alarmHasRung", JSON.stringify(true));
        } else {
            // If stop was pressed, don't play the alarm and reset it
            localStorage.setItem("Stop","false");
            ResetAlarm();
        }
    }, alarmInMs);
};

function CurrenAlarmSection(HourVal, MyHour, min, alarmInMs){
    showCurrentAlarm(curAlarmTime, MyHour, min);
    ShowAndClear(alarmInMs, MyHour,  HourVal,min);
}

const getHour = (MyHour) => {
    let HourVal = storedHour[MyHour];
    return HourVal;
}

// Submit Button - 
SubmitBtn.addEventListener("click", () => {
    stopAudio();
    ResetAlarm();
    let MyHour  = selectHour.value; 
    let MyMin = selectMint.value;
    let HourVal = getHour(MyHour);
    const alarmInMs = WakeAlarm(HourVal, MyMin);

    // Saving Alarm Data in Local Storage - 
    localStorage.setItem("selectedRing", JSON.stringify(selectedRing.value));
    console.log(selectedRing.value);
    
    localStorage.setItem("AlramTime", JSON.stringify({Hour: MyHour, Minute: MyMin}));
    localStorage.setItem("AlarmTitle", inputTitle.value);
    
    setTimeout(toggled, 50);
    curAlarm.classList.remove("curHidden");
    CurrenAlarmSection(HourVal, MyHour, MyMin, alarmInMs);
});

// Window Loading
window.onload = () => {
    let savedAlarm = JSON.parse(localStorage.getItem("AlramTime"));
    let savedAlarmTitle = localStorage.getItem("AlarmTitle");
    let alarmHasRung = JSON.parse(localStorage.getItem("alarmHasRung")) || false;

    if(savedAlarm && savedAlarmTitle){
        const alarmEndTime = parseInt(localStorage.getItem("alarmEndTime"), 10);
        const HourVal = getHour(savedAlarm.Hour);
        const currentTime = new Date().getTime();

        // const alarmInMs = WakeAlarm(savedAlarm.Hour, savedAlarm.Minute);
        if (currentTime < alarmEndTime && !alarmHasRung) { 
            const alarmInMs = alarmEndTime - currentTime;
            curAlarm.classList.remove("curHidden");
            inputTitle.value = savedAlarmTitle;
            CurrenAlarmSection(HourVal, savedAlarm.Hour, savedAlarm.Minute, alarmInMs);
        } else {
            console.log("Alarm Time Is Passed!");
            showPopUP(savedAlarm.Hour, savedAlarm.Minute, true);
            ResetAlarm();
        }
    }
};

stopBtn.addEventListener("click", () => {
    localStorage.setItem("Stop","true");
    ResetAlarm();
    stopAudio();
});

// PopUp Window Logic - 
// function toggled(){
//     stopAudio();
//     Wrapper.classList.toggle("Active");
//     popUp.classList.toggle("Active2");
// }

addBtn.addEventListener("click", () => {
    console.log(45);
    
})

const showPopUP = (MyHour ,min, t1) => {
    let curTitle = localStorage.getItem("AlarmTitle");
    Wrapper.classList.add("Active");
    ringPopUp.classList.add("ringHidden");
    alarmRingTitle.innerText = curTitle;
    showCurrentAlarm(alarmRungTime, MyHour, min);
    if(t1){
        ringTitle.innerText = "Alarm Passed!";
    }
}

okBtn.addEventListener("click" , () => {
    Wrapper.classList.remove("Active");
    ringPopUp.classList.remove("ringHidden");
    stopAudio(); 
});

testBtn.addEventListener("click", () => {
    localStorage.removeItem("selectedRing");
    let CurRing = selectedRing.value;
    PlayAudio(CurRing);
});