let setTimerHour = document.querySelector("#setTimerHour");
let setTimerMint = document.querySelector("#setTimerMint");
let setTimerSec = document.querySelector("#setTimerSec");

let isCount = document.querySelector("#countdown");
let bodyMid = document.querySelector(".bodyMid");
let bodyMid2 = document.querySelector(".bodyMid2");

let calenderIcon = document.querySelector(".calenderIcon");
let calenderPopUp = document.querySelector(".calenderPopUp");
let calenderDays = document.querySelector(".calenderDays");
let yearAndMonth = document.querySelector(".yearAndMonth");
let dateInput = document.querySelector("#dateInput");
let dayOfCalender;
let allYears;

let MonthList = document.querySelector(".MonthList");
let Months = document.querySelectorAll(".month");

let yearSelector = document.querySelector(".YearSection");
let yearContainer = document.querySelector(".yearContainer");
let yearBox = document.querySelector(".yearBox");
let monthSection = document.querySelector(".monthSection");
let dayContainer = document.querySelector(".dayContainer");

let isCalendarVisible = false;
let CurYearTitile = document.querySelector(".CurYearTitile");
let yearSectionTag = document.querySelector(".YearSection");

let setTimerTime = document.querySelector(".setTimerTime");
let timerIcon = document.querySelector(".timerIcon");
let timerPopUp2;
let timeInput = document.querySelector("#timeInput");

// Populating Time in selectors - 
for(let i = 1; i<100; i++){
    let newOption = document.createElement("option");
    let formattedVal = i.toString().padStart(2, "0");
    newOption.innerText = formattedVal;
    newOption.value = formattedVal;
    setTimerHour.appendChild(newOption);

    if(i < 60){
        let newOption2 = document.createElement("option");
        newOption2.innerText = formattedVal;
        newOption2.value = formattedVal;
        setTimerMint.appendChild(newOption2);

        let newOption3 = document.createElement("option");
        newOption3.innerText = formattedVal;
        newOption3.value = formattedVal;
        setTimerSec.appendChild(newOption3);
    }
}

function isCountOrDate() {
    bodyMid.classList.toggle("InVisible"); //display none
    bodyMid2.classList.toggle("NotInVisible"); // display block
}

// Showing Date Format In Input -
let Now = new Date();
let DateString = Now.toLocaleDateString();
let splitedDate = DateString.split("/");
dateInput.value = DateString;

// Generating Calender Dates According to Month - 
const generateCalender = (year, month) => {
    yearAndMonth.innerText = `${Now.toLocaleString('default', {month: 'long'})}, ${Now.getFullYear()}`;
    let calenderHTML = "";
    let firstDay = new Date(year, month).getDay();
    let dayInMonth = new Date(year, month + 1, 0).getDate();
    
    for(let i = 0; i< firstDay; i++){
       calenderHTML  += `<div></div>`;
    }

    for(let day = 1; day <= dayInMonth; day++){
        calenderHTML  += `<div class="dayOfCalender dayOnHover">${day}</div>`;
    }
    calenderDays.innerHTML = calenderHTML;
}

generateCalender(Now.getFullYear(), Now.getMonth());

const selectors = (select, type) => {
    select.forEach(item => {
        item.addEventListener("click", () => {
            let M_Y = yearAndMonth.innerText.split(",");
            select.forEach(part => {
                if(part.classList.contains("dateActive")){
                    part.classList.remove("dateActive");
                }
            });
            item.classList.add("dateActive");
        
            if(type == "day"){
                splitedDate[1] = item.innerText.padStart(2, 0);
                calenderPopUp.classList.toggle("VisiBle");
            }

            if(type == "month"){
                let NewMonth = new Date(`${item.innerText} 1, 2000`);
                splitedDate[0] = (NewMonth.getMonth() + 1);
                M_Y[0] = item.innerText.trim();
            }

            if(type == "year"){
                splitedDate[2] = item.innerText.trim();
                CurYearTitile.innerText = item.innerText.trim();
                yearSectionTag.innerText = item.innerText.trim();
                M_Y[1] = item.innerText.trim();
            }
            yearAndMonth.innerText = M_Y;
            dateInput.value = splitedDate.join("/");
        })
    })
};

// ! Important - cause in staring there is nothing in daysofcalender as days are not yet loaded.
dayOfCalender = document.querySelectorAll(".dayOfCalender");

const generateYears = () => {
    let curDate = Number(dateInput.value.split("/")[2]);
    let preYear = curDate - (curDate % 10) - 1;
    let postYear = curDate + (10 - (curDate % 10));
    yearContainer.innerHTML = "";

    for(let i = preYear; i <= curDate; i = i+1){
        yearContainer.innerHTML += `<div class = "years dayOnHover"> ${i} </div>`;
    }

    for(let i = curDate + 1; i <= postYear; i += 1){
        yearContainer.innerHTML += `<div class = "years dayOnHover"> ${i} </div>`;
    }

    allYears = document.querySelectorAll(".years");

    allYears.forEach(year => {
        year.addEventListener("click", () => {
            showOnly(monthSection, true);
        })
    });
}

// Handles Selection of Calender Values when Called -
const SelectCur = (selector) => {
    let ChangedVal = new Date(dateInput.value);
    let er = ChangedVal.toString().split(" ");
    selector.forEach(val => {
        let Newval = val.innerText.toString().trim();
        
        if(Newval == ChangedVal.getDate().toString() || Newval == er[1] || Newval == er[3]){
            val.classList.add("dateActive");
        }
        else {
            val.classList.remove("dateActive");
        }
    })
};

// Changing current Year and months -
const changeM_Y = () => {
    let splitedInput = dateInput.value.split("/");
    let monthAndYear = yearAndMonth.innerText;
    let splitM_Y = monthAndYear.toString().split("/");
    
    let NewMonth = new Date(`${splitedInput[0]} 1, 2000`);
    let MyMonth = NewMonth.toLocaleString('default', {month: 'long'});

    splitM_Y[1] = splitedInput[2];
    if(MyMonth == "Invalid Date"){
        splitM_Y[0] = Now.toLocaleString('default', {month: 'long'});
    }
    else{
        splitM_Y[0] = MyMonth;
    }

    yearAndMonth.innerText = `${splitM_Y[0]}, ${splitM_Y[1]}`;
    CurYearTitile.innerText = splitM_Y[1];
    yearSectionTag.innerText = splitM_Y[1];
}

const PopulatingYears = () => {
    generateYears();
    allYears = document.querySelectorAll(".years");
    selectors(allYears, type = "year");
}

// Calling SelectCur when value of input Changes -
dateInput.addEventListener("input", () => {
    SelectCur(dayOfCalender);
    SelectCur(Months);
    PopulatingYears();

    SelectCur(allYears); 
    changeM_Y();
});

// Function for toggling classes - 
const showOnly  = (selectedContainer, yes) => {
    if(yes){
        calenderPopUp.classList.add("VisiBle");
    }
    else {
        calenderPopUp.classList.remove("VisiBle");
    }
    dayContainer.classList.add("InVisible");
    monthSection.classList.add("InVisible");
    yearBox.classList.add("InVisible");

    selectedContainer.classList.remove("InVisible");
}

calenderIcon.addEventListener("click", () => {
    isCalendarVisible = !isCalendarVisible;
    showOnly(dayContainer, isCalendarVisible);
});

yearAndMonth.addEventListener("click", () => {
    showOnly(monthSection, true);
});

yearSelector.addEventListener("click", () => {
    showOnly(yearBox, true);
});

dateInput.addEventListener("focus", () => {
    showOnly(dayContainer, true);
});

// Document -
document.addEventListener("click", (event) => {
    if(!calenderPopUp.contains(event.target) && 
    !dateInput.contains(event.target) && 
    !calenderIcon.contains(event.target)) {
        isCalendarVisible = false;
        showOnly(dayContainer, isCalendarVisible);
    }
});

// Toggling classes to get back to dates section again - 
Months.forEach(month => {
    month.addEventListener("click", () => {
        showOnly(dayContainer, true);
    });
});

// Time Setting - 
let TimeDigits;
let AmDigits;
let TDigits;
let PmDigits;
let newInput = timeInput.value;
let HourInput = newInput.split(":");
let AmPm = newInput.split(" ");

let MinutePopUp = document.querySelector(".MinutePopUp");
let Mints = document.querySelectorAll(".Mints");
let MinuteTitle = document.querySelector(".MinuteTitle");

let chooseFile = document.querySelector(".chooseFile");
let selectFile = document.querySelector("#selectFile");
let ringSelect = document.querySelector(".ringtoneSelectTimer");

let ringArray = JSON.parse(localStorage.getItem("ringArr")) || {};
let playTimerBtn = document.querySelector(".playTimer");
// let timerAudio = document.querySelector("#timerAudio");
let timerFlag = true;

const createTimeElemnt = () => {
    let newElement = document.createElement("div");
    newElement.classList.add("timerBox", "timeVisible");
    newElement.innerHTML = `<div class="TimeSection">
                                <div class="PmAmTitle">
                                    AM
                                </div>
                                <div class="TimeDigits ">
                                    <span class="TDigits amDigit">12</span>
                                    <span class="TDigits amDigit">1</span>
                                    <span class="TDigits amDigit">2</span>
                                    <span class="TDigits amDigit">3</span>
                                    <span class="TDigits amDigit">4</span>
                                    <span class="TDigits amDigit">5</span>
                                    <span class="TDigits amDigit">6</span>
                                    <span class="TDigits amDigit">7</span>
                                    <span class="TDigits amDigit">8</span>
                                    <span class="TDigits amDigit">9</span>
                                    <span class="TDigits amDigit">10</span>
                                    <span class="TDigits amDigit">11</span>
                                </div>
                            </div>
                            
                            <div class="TimeSection">
                                <div class="PmAmTitle">
                                    PM
                                </div>
                                <div class="TimeDigits">
                                    <span class="TDigits dateActive pmDigits">12</span>
                                    <span class="TDigits pmDigits">1</span>
                                    <span class="TDigits pmDigits">2</span>
                                    <span class="TDigits pmDigits">3</span>
                                    <span class="TDigits pmDigits">4</span>
                                    <span class="TDigits pmDigits">5</span>
                                    <span class="TDigits pmDigits">6</span>
                                    <span class="TDigits pmDigits">7</span>
                                    <span class="TDigits pmDigits">8</span>
                                    <span class="TDigits pmDigits">9</span>
                                    <span class="TDigits pmDigits">10</span>
                                    <span class="TDigits pmDigits">11</span>
                                </div>
                            </div>`;

    return newElement;
}

const createTime = () => {
    let newElement = createTimeElemnt();
    TimeDigits = document.querySelectorAll(".TimeDigits");
    if(!timerPopUp2){
        timerPopUp2 = newElement;
        setTimerTime.appendChild(timerPopUp2);
        AmDigits = document.querySelectorAll(".TimeDigits .amDigit");
        TDigits = document.querySelectorAll(".TimeDigits .TDigits");
        PmDigits = document.querySelectorAll(".TimeDigits .pmDigits");
        createTime();
        TapSelect(TDigits);
        showMinute(TDigits);
    }
}

timerIcon.addEventListener("click", () => {
    createTime();
    timerPopUp2.classList.toggle("NotInVisible");
});

const TimeSelector = (selector, notSelector, item) => {
    selector.forEach(val => {
        let newVal = val.innerText.padStart(2, 0);

        if(item == val.innerText || item == newVal){
            val.classList.add("dateActive");
        }
        else{
            val.classList.remove("dateActive");
            notSelector.forEach(val => {
                val.classList.remove("dateActive");
            })
        }
    })
};

timeInput.addEventListener("input", () => {
    let myTime = timeInput.value;
    let timesplice1 = myTime.split(":");
    let AmOrPm = myTime.split(" ");

    createTime();

    if(AmOrPm[1].toLowerCase() == "am"){
        TimeSelector(AmDigits, PmDigits, timesplice1[0]);
    }
    
    else if(AmOrPm[1].toLowerCase() == "pm"){
        TimeSelector(PmDigits, AmDigits, timesplice1[0]);
    }
});

const TapSelect = (selector) => {

    selector.forEach(val => {
        val.addEventListener("click", (event) => {
            selector.forEach(part => {
                if(part.classList.contains("dateActive")){
                    part.classList.remove("dateActive");
                }
            });
            val.classList.add("dateActive");
            let newValue = val.innerText;
            HourInput[0] = newValue;

            if(val.classList.contains("pmDigits")){   
                timeInput.value = `${HourInput[0]}:${"00 PM"}`;
                MinuteTitle.innerText = "PM";
            }
            else {
                timeInput.value = `${HourInput[0]}:${"00 AM"}`;
                MinuteTitle.innerText = "AM";
            }
        })
    })
};

const showMinute = (selector) => {
    selector.forEach(val => {
        val.addEventListener("click", (event) => {
            timerPopUp2.classList.remove("NotInVisible");
            MinutePopUp.classList.add("VisiBle");
            let selectedHour = val.innerText;
            
            Mints.forEach(item => {
                let splitMint = item.innerText.split(":");
                splitMint[0] = `${selectedHour}`;      
                item.innerText = splitMint.join(":");
                
                item.addEventListener("click", (event) => {
                    MinutePopUp.classList.remove("VisiBle");
                    timeInput.value = `${item.innerText} ${MinuteTitle.innerText}`;

                    Mints.forEach(part => {
                        if(part.classList.contains("dateActive")){
                            part.classList.remove("dateActive");
                        }
                    });
                    event.target.classList.add("dateActive");
                })
            })

            timeInput.addEventListener("input", () => {
                Mints.forEach(val => {
                    let curTime = timeInput.value;
                    let splitTime = curTime.split(" ");
                    
                    if(splitTime[0] == val.innerText){
                        val.classList.add("dateActive");
                    }
                    else{
                        val.classList.remove("dateActive");
                    }
                })
            })
        })
    })
};

function addInObject(key, val) {
    let newKey = key.split(".")[0];
    ringArray[newKey] = val;
    localStorage.setItem("ringArr", JSON.stringify(ringArray));
}

chooseFile.addEventListener("click", () => {
    selectFile.click();
});

const createRing = (selector, ringName, yes) => {
    let splitRing = ringName.split(".");
    let newOption = document.createElement("option"); 

    newOption.innerText = splitRing[0];
    newOption.selected = true;
    ringSelect.appendChild(newOption);
    newOption.value = selector.value;
    
    if(yes) {
        addInObject(ringName, newOption.value);
    } 
}

selectFile.addEventListener("change", async () => {
    let ringName = selectFile.files[0].name;
    let ringStr = ringName.split(".");
    let filePath = selectFile.value;

    if (!ringName || !filePath) {
        console.error("No file selected.");
        return; 
    }

    let checkArr = JSON.parse(localStorage.getItem("ringArr")) || {1:0};
    let fileExists = ringStr[0] in checkArr;

    if(!fileExists) {
        createRing(selectFile, ringName, true);
    } else {
        let splitName = filePath.split("\\").pop().split(".")[0];
        
        Array.from(ringSelect.options).forEach(option => {
            let opText = option.text.split("/").pop().split(".")[0];
            if(opText === splitName) {
                ringSelect.value = option.value;
            }
        })
    }
});

window.addEventListener("load", () => {
    SelectCur(dayOfCalender);
    SelectCur(Months);
    PopulatingYears();
    SelectCur(allYears);

    selectors(dayOfCalender, type = "day");
    selectors(Months, type = "month");

    timeInput.addEventListener("focus", () => {
        createTime();
        timerPopUp2.classList.toggle("NotInVisible");

        if(timerPopUp2) {
            timerPopUp2.classList.remove("NotInVisible");
        }
    });
});