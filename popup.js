const showTableButton = document.getElementById("btnShowTable");
const clearTimesButton = document.getElementById("btnClearTimes");

const errorMessageElement = document.getElementById("errorMessage");
const timeTable = document.getElementById("timeTable");

let canvasChart = document.getElementById("myChart");
canvasChart.style.display = "block";

clearTimesButton.onclick = (elem) => {
  chrome.storage.local.set({ tabTimesObject: "{}" });
  if (confirm("Are you sure you want to clear tracking history???")) {
    clearRows();
    canvasChart.style.display = "none";
  }
};

const getData = () => {
  chrome.storage.local.get("tabTimesObject", (dataCont) => {
    let DataString = dataCont["tabTimesObject"];
    if (DataString === null) return;

    try {
      const data = JSON.parse(DataString);

      clearRows();

      let entries = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          entries.push(data[key]);
        }
      }

      sortEntries(entries);
      console.log(entries);

      entries.map(displayData);

      let headerRow = timeTable.insertRow(0);
      headerRow.classList.add("header");

      headerRow.insertCell(0).innerHTML = "Url";
      headerRow.insertCell(1).innerHTML = "Total time";
      headerRow.insertCell(2).innerHTML = "%";
      headerRow.insertCell(3).innerHTML = "Last Visit";
      //
    } catch (err) {
      const message = `loading the tabTimesObject went wrong ${err.toString()}`;
      console.error(message);

      errorMessageElement.innerText = message;
      errorMessageElement.innerText = DataString;
    }
  });
};

const clearRows = () => {
  const rowCount = timeTable.rows.length;
  for (let i = rowCount - 1; i >= 0; i--) {
    timeTable.deleteRow(i);
  }
};

const sortEntries = (entries) => {
  entries.sort((e1, e2) => {
    let e1S = e1["trackedSeconds"];
    let e2S = e2["trackedSeconds"];
    if (isNaN(e1S) || isNaN(e2S)) {
      return 0;
    } else if (e1S > e2S) {
      return 1;
    } else if (e1S < e2S) {
      return -1;
    }
    return 0;
  });
};

const displayData = (urlObject, i, currentArray) => {
  let sumSecondsArray = currentArray.map((a) => a["trackedSeconds"]);
  let totalSeconds = sumSecondsArray.reduce((a, b) => a + b);
  let percentage =
    ((urlObject["trackedSeconds"] / totalSeconds) * 100).toFixed(2) + "%";

  let newRow = timeTable.insertRow(0),
    cellHostName = newRow.insertCell(0),
    cellTime = newRow.insertCell(1),
    cellPerc = newRow.insertCell(2),
    cellLastDate = newRow.insertCell(3);

  cellHostName.innerHTML = urlObject["url"];

  let time_ =
    urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;
  cellTime.innerHTML = formatTime(time_);

  cellPerc.innerHTML = percentage;

  let date = new Date();
  date.setTime(urlObject["lastDateVal"] != null ? urlObject["lastDateVal"] : 0);

  cellLastDate.innerHTML = date.toLocaleString("sr-Latn-RS");

  // trigger chart
  // if (typeof showPieChart === "function") {}
  try {
    showPieChart(currentArray);
  } catch (error) {
    console.log(console.error(error));
  }
};

const formatTime = (time) => {
  let hours = Math.floor(time / 3600);
  time -= hours * 3600;

  let minutes = Math.floor(time / 60);
  time -= minutes * 60;

  let seconds = parseInt(time % 60, 10);

  return (
    (hours === 0 || hours < 10 ? "0" + hours : hours) +
    "h " +
    (minutes < 10 ? "0" + minutes : minutes) +
    "m " +
    (seconds < 10 ? "0" + seconds : seconds) +
    "s"
  );
};
