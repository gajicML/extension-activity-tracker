const showTableButton = document.getElementById("btnShowTable");
const clearTimesButton = document.getElementById("btnClearTimes");

const errorMessageElement = document.getElementById("errorMessage");
const timeTable = document.getElementById("timeTable");

clearTimesButton.onclick = (elem) => {
  chrome.storage.local.set({ tabTimesObject: "{}" }, () => {});
};

chrome.storage.local.get("tabTimesObject", (dataCont) => {
  console.log("dataCont", dataCont);
});
