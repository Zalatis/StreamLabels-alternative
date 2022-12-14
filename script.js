// https://streamlabs.com/dashboard#/settings/api-settings API Settings -> API Tokens -> Your Socket API Token
const socketToken = 'MY_SOCKET_API_TOKEN';

// https://streamlabs.com/dashboard#/settings/api-settings API Settings -> API Tokens -> Your API Access Token
const token = "MY_API_TOKEN";

const labelsList = [
    'most_recent_follower',
    'most_recent_cheerer',
    // 'most_recent_donator',
    'most_recent_subscriber'
]

const imagesSRC = [
    'images/follow.png',
    'images/bits.png',
    // 'images/donator.png',
    'images/sub.png'
]

// Time in ms for timeOut
const TIMING = 5000;

//Connect to socket
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, {transports: ['websocket']});

//Perform Action on event
streamlabs.on("connect", () => {
    console.log("Connected to socket");
});

streamlabs.on("disconnect", () => {
    console.log("Disconnected from socket");
});

streamlabs.on('event', (eventData) => {
if (eventData.type == 'streamlabels') {
    var json = eventData.message["data"];
    console.log(json);
    // Check if there is already an element with class
    var labelNum = 0;
    for (var i = 0; i < labelsList.length; i++) {
        var labelName = labelsList[labelNum];
        this[labelName] = json[`${labelName}`];
        text = this[labelName];
        if (text != "") {
            // If Element have this class, modify the child element
            if (document.querySelector("." + labelName) != null) {
                console.log("Class already exist");
                // Child element does not have same text
                if (document.querySelector("." + labelName).innerHTML.includes(text) == false) {
                    document.querySelector("." + labelName).innerHTML = `<img src="${imagesSRC[labelNum]}">${text}`;
                }
            }
            else {
                // We create the label
                console.log("Creating label");
                createLabel(text, labelNum, labelName);
            } 
        }
        labelNum++;
    }
}
else {
    console.log("Event without streamlabels type");
}
});

function init(labelNum) {
    fetch(`https://streamlabs.com/api/v5/stream-labels/files?token=${token}`)
        .then(response=>response.json())
        .then(data=> {
            json = data['data'];
            for (var i = 0; i < labelsList.length; i++) {
                var labelName = labelsList[labelNum];
                this[labelName] = json[`${labelName}`];
                if (this[labelName] != "") {
                    text = this[labelName];
                    createLabel(text, labelNum, labelName);
                }
                labelNum++;
            }
            labelNum = 0;
            setTimeout(loop, TIMING);
        })
        .catch(function () {
            console.log("Impossible to scrape data")
            // Restart
            setTimeout(init,TIMING,labelNum)
        });
}


function createLabel(text, labelNum, labelName){
    let liItem = document.createElement("li");
    liItem.classList.add(labelName);
    liItem.innerHTML = `${text}`;
    document.querySelector('ul').append(liItem);
    addImages(labelNum, labelName);
}

function addImages(labelNum, labelName){
    let digits = document.querySelector("." + labelName)
    let imgItem = document.createElement('img');
    imgItem.src = `${imagesSRC[labelNum]}`;
    digits.prepend(imgItem); 
}

function loop() {
    document.querySelector("ul").append(document.querySelector("ul").firstElementChild)
    setTimeout(loop, TIMING);
}

init(0);
