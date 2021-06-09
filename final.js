// ui
let practiceStartButton = document.getElementById('practice_start');
let practiceEndButton = document.getElementById('practice_end');
let topicSubmitForm = document.getElementById('topic_submit');
let table = document.getElementById('myTable');
let topicEditBtn = document.getElementById('edit_btn');
let topicEditInput = document.getElementById('edit_input');
let topicEditForm = document.getElementById('topic_edit');

// class

class TimeLog {
    constructor(start, end, topics, totalHours) {
        this.start = start;
        this.end = end;
        this.topics = topics;
        this.totalHours = totalHours;
    }
}


class UI {
    static addTableData() {
        let tableBody = document.querySelector('tbody');
        let row = document.createElement('tr');
        row.className = 'created_row';
        row.innerHTML = `
            <td class="start_time"></td>
            <td class="end_time"></td>
            <td class="topics" contenteditable="true" onclick = "editTable()"></td>
        `;
        tableBody.appendChild(row);
    }

    static addFirstElements(start) {
        let addStartTime = document.querySelector('.start_time');
        addStartTime.innerHTML = `${start}<a href="#" class="fa fa-trash-o remove_row"></a>`;
        startTimeForObject = `${start}`;
        let td = document.querySelectorAll('td');
        for (let i = 0; i < td.length; i += 3) {
            td.item(i).classList.remove('start_time');
        }
    }

    static addSecondElements(end) {
        let td = document.querySelectorAll('td');
        try {
            document.querySelector('.end_time').innerHTML = `${end}`;
            endTimeForObject = `${end}`;
            for (let i = 1; i < td.length; i += 3) {
                td.item(i).classList.remove('end_time');
            }
        } catch (error) {
            alert('Please check if you have submitted Start time. After Submitting Start time, you can update your End time once.')
        }
    }

    static addThirdElements(last) {
        let td = document.querySelectorAll('td');
        try {
            document.querySelector('.topics').innerHTML = `${last}`;
            topicsForObject = `${last}`;
            for (let i = 2; i < td.length; i += 3) {
                td.item(i).classList.remove('topics');
            }
        } catch (error) {

        }
    }

    static removeItem(target) {
        if (target.classList.contains('remove_row')) {
            if (confirm('Are you sure, you want to clear this session?')) {
                target.parentElement.parentElement.remove();
                Store.removeItemsLs(target.parentElement.textContent.trim());
                Store.sumOfTheTimes();
            }
        }
    }

    static PresentTime() {
        let start = new Date();
        return start.toLocaleTimeString();
    }
}


class Store{
    static getItems (){
        let logs;
        if (localStorage.getItem('logs') == null) {
            logs = [];
        } else {
            logs = JSON.parse(localStorage.getItem('logs'));
        }
        return logs;
    }

    static addfullObject(start){     //this adds start time also
        let logs = Store.getItems();
        logs.push(start);
        localStorage.setItem('logs', JSON.stringify(logs)) 
    }

    static addEndTime(end){
        let logs = Store.getItems();
        let updateableObject = logs[logs.length -1];
        updateableObject.end = `${end}`;
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    static addTime(timeForSession){
        let logs = Store.getItems();
        let updateableObject = logs[logs.length -1];
        updateableObject.totalHours =Number(timeForSession);
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    static addTopicsLs(topic){
        let logs = Store.getItems();
        let updateableObject = logs[rIndex -1];
        updateableObject.topics = `${topic}`;
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    static sumOfTheTimes(){
        let logs = Store.getItems();
        let showTotalTime = document.querySelector('#show_time');
        let timeShowingBox = document.querySelector('#time-box');
        let sum = 0;
        logs.forEach(items => {
            sum += items.totalHours;
        });
        if (sum > 60) {
            showTotalTime.innerText = `${Math.trunc(sum/60)} Hours ${sum%60} Minutes`;
        } else {
            showTotalTime.innerText = `${sum} Minutes`;
        }
        if (sum >= 180) {
            table.classList.remove('table-danger');
            timeShowingBox.classList.remove('bg-danger');
            table.classList.add('table-success');
            timeShowingBox.classList.add('bg-success');
        } else {
            if (table.classList.contains('table-success') || timeShowingBox.classList.contains('bg-success')) {
                table.classList.remove('table-success');
                timeShowingBox.classList.remove('bg-success');
            }
            table.classList.add('table-danger');
            timeShowingBox.classList.add('bg-danger');
        }
        
    }

    static removeItemsLs(starttime){
        let logs = Store.getItems();
        logs.forEach( (log, index) => {
            if (log.start == starttime) {
                logs.splice(index, 1);
            }
        });
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    static displayItems(){
        let tds = document.getElementsByTagName('td');
        let logs = Store.getItems();
        logs.forEach(itemsInARow => {
            UI.addTableData();
            UI.addFirstElements(itemsInARow.start);
            UI.addSecondElements(itemsInARow.end);
            UI.addThirdElements(itemsInARow.topics);
        })
        if (tds.length == 0) {
            // pass
        }else if(logs[logs.length-1].start != '' && logs[logs.length-1].end == '' && tds[tds.length-2].classList.contains('.end_time') == false){
            let oldValue = Number(localStorage.getItem('LastStartTime'));
            StartTime = oldValue; 
            tds[tds.length-2].classList.add('end_time');
        }

       Store.sumOfTheTimes();
    }

}



//  declaring variables
let timeArrayForEachRows = [];
var StartTime;
var EndTime;
var startTimeForObject;
var endTimeForObject;
var topicsForObject;
var totalTimeForObject = 0;


// add EventListener
practiceStartButton.addEventListener('click', timeStart);
practiceEndButton.addEventListener('click', timeEnd);
document.querySelector('tbody').addEventListener('click', remove);
document.addEventListener('DOMContentLoaded', Store.displayItems());




// functions
function timeStart() {
    for (var r = table.rows.length - 1; r < table.rows.length; r++) {
        for (var c = 1; c < table.rows[r].cells.length - 1; c++) {
            if (table.rows[r].cells[1].innerText == '') {
                alert('Please Enter the end time for the running session')
            } else if (table.rows[r].cells[2].innerText == '') {
                alert('Please Enter the topics for the running session')
            } else {
                UI.addTableData();
                r = table.rows.length - 1
                UI.addFirstElements(UI.PresentTime());
                endTimeForObject = '';
                topicsForObject = '';
                totalTimeForObject = 0;
                creatingTheObject();
                const time = new Date();
                StartTime = time.getTime();
                localStorage.setItem('LastStartTime', StartTime)
            }
        }
    }

    const time = new Date();
    StartTime = time.getTime();
}
function timeEnd() {
    UI.addSecondElements(UI.PresentTime());
    Store.addEndTime(endTimeForObject);
    const time = new Date();
    EndTime = time.getTime();
    calculations();
    Store.sumOfTheTimes();
}

function remove(e) {
    UI.removeItem(e.target);
    e.preventDefault();
}

function calculations() {
    let TotalTimeForARow = Math.round((EndTime - StartTime) / 60000);
    totalTimeForObject = TotalTimeForARow;
    Store.addTime(totalTimeForObject);
}

function creatingTheObject() {
    let timeLog = new TimeLog(startTimeForObject, endTimeForObject, topicsForObject, totalTimeForObject);
    Store.addfullObject(timeLog);
}
// llast cell edit
var rIndex;
function editTable() {

    for (var i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        row.onclick = function () {
            rIndex = this.rowIndex;
            table.rows[rIndex].cells[2].onblur = function (e) {
                e.stopPropagation();
                topicsForObject = table.rows[rIndex].cells[2].innerText.trim();
                Store.addTopicsLs(topicsForObject);
                return topicsForObject
            }
        }
    }

}

// clearing the local storage
let clearBtn = document.getElementById('clear_all');
clearBtn.addEventListener('click', removeAllData);
function removeAllData(){
    if (confirm('This will delete all sessions permanently. Are you sure?')) {
        window.localStorage.clear();
        window.location.reload();
    }
}