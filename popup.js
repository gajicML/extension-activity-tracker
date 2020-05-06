const showTableButton = document.getElementById("btnShowTable");
const clearTimesButton = document.getElementById("btnClearTimes");

const errorMessageElement = document.getElementById("errorMessage");
const timeTable = document.getElementById("timeTable");

clearTimesButton.onclick = (elem) => {
  chrome.storage.local.set({ tabTimesObject: "{}" });
  clearRows();
};

chrome.storage.local.get("tabTimesObject", (dataCont) => {
  console.log("dataCont", dataCont);

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

    entries.map(displayData);
  } catch (err) {
    const message = `loading the tabTimesObject went wrong ${err.toString()}`;
    console.error(message);

    errorMessageElement.innerText = message;
    errorMessageElement.innerText = DataString;
  }
});

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

const displayData = (urlObject) => {
  // console.log(urlObject);
  let newRow = timeTable.insertRow(0),
    cellHostName = newRow.insertCell(0),
    cellTimeMinutes = newRow.insertCell(1),
    cellTime = newRow.insertCell(2),
    cellLastDate = newRow.insertCell(3);

  cellHostName.innerHTML = urlObject["url"];

  let time_ =
    urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;
  cellTime.innerHTML = Math.round(time_);

  cellTimeMinutes.innerHTML = (time_ / 60).toFixed(2);

  let date = new Date();
  date.setTime(urlObject["lastDateVal"] != null ? urlObject["lastDateVal"] : 0);

  cellLastDate.innerHTML = date.toUTCString();
};
