const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const base64ToBlob = (base64) => {
    const binary = atob(base64.split(",")[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++){
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: "audio/mp3"});
}

function addInObject(key, val){
    let newKey = key.split(".");
    ringArray[newKey[0]] = val;
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
    
    if(yes == true){
        addInObject(ringName, newOption.value);
        // let fileUrl = URL.createObjectURL(selector.files[0]);
    }
    else{
        newOption.value = selector;
    }
}

// localStorage.clear();
// ringArray = {};

selectFile.addEventListener("change", async () => {
    const file = selectFile.files[0];
    if(file){
        const base64String = await fileToBase64(file);
        localStorage.setItem(file.name, base64String);
    }

    let ringName = selectFile.files[0].name;
    let ringStr = ringName.split(".");
    let filePath = selectFile.value;

    if (!ringName || !filePath) {
        console.error("No file selected.");
        return; 
    }

    let checkArr = JSON.parse(localStorage.getItem("ringArr")) || {1:0};
    let fileExists = ringStr[0] in checkArr;

    if(!fileExists){
        createRing(selectFile, ringName, true);
    }

    else {
        let splitName = filePath.split("\\").pop().split(".")[0];
        
        Array.from(ringSelect.options).forEach(option => {
            let opText = option.text.split("/").pop().split(".")[0];
            if(opText == splitName){
                ringSelect.value = option.value;
            }
        })
    }
});

// Handling Window Load Event -
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

        if(timerPopUp2){
            timerPopUp2.classList.remove("NotInVisible");
        }
    })

    let sTRingArr = JSON.parse(localStorage.getItem("ringArr"));
    
    if(typeof sTRingArr === "object"){
        for (const element in sTRingArr) {
            let ringN = String(element).split("\\").pop();
            createRing(element, ringN, false);
        } 
    };
});

playTimerBtn.addEventListener("click", () => {
   

    let selectedOption = ringSelect.options[ringSelect.selectedIndex];
    const base64String = localStorage.getItem(selectedOption.text);
    // console.log(base64String);

    if(base64String){
        const audioBlob = base64ToBlob(base64String);
        const audioUrl = URL.createObjectURL(audioBlob);

        if(!timerAudio) timerAudio = new Audio(audioUrl);

        if(timerAudio.paused){
            timerAudio.play();
            // playTimerBtn
        }
        else {
            timerAudio.pause();
        }
    }
    else {
        console.error("audio not found");
    }
    
});