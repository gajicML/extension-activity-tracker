const chartColors = {
  orange: "rgb(255, 159, 64)",
  purple: "rgb(153, 102, 255)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  red: "rgb(255, 99, 132)",
  blue: "rgb(54, 162, 235)",
};

const randomColor = () => {
  return (
    "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6)
  );
};

const getUrlsAndPercenatage = (data) => {
  let visitedUrls = {};
  let finalObj = {};

  for (const obj of data) {
    const myNewKey = Object.values(obj)[0];
    const myNewValue = Object.values(obj)[1];
    visitedUrls[myNewKey] = myNewValue;
  }

  let sum = Object.keys(visitedUrls).reduce((s, k) => (s += visitedUrls[k]), 0);

  let result = Object.keys(visitedUrls).map((k) => ({
    [k]: ((visitedUrls[k] / sum) * 100).toFixed(2),
  }));

  for (const obj of result) {
    const myNewKey = Object.keys(obj);
    const myNewValue = Object.values(obj);
    finalObj[myNewKey] = myNewValue[0];
  }

  return finalObj;
};

// Pie chart
let myChart = document.getElementById("myChart").getContext("2d");

// Global options
Chart.defaults.global.defaultFontFamily = "Montserrat";

const showPieChart = (data) => {
  // console.log("data Chart", data);

  let visitedUrls = getUrlsAndPercenatage(data);

  // get labels
  const keys = Object.keys(visitedUrls);
  // console.log(keys);

  // get values
  const values = Object.values(visitedUrls);
  // console.log(values);

  // get defined colors
  const colors = Object.values(chartColors);

  // set colors
  let bgColors = [];
  for (let i = 0; i < values.length; i++) {
    if (values.length <= colors.length) {
      bgColors.push(colors[i]);
    } else {
      if (i < colors.length) {
        bgColors.push(colors[i]);
      } else {
        bgColors.unshift(randomColor());
      }
    }
  }

  // console.log("bgColors", bgColors);

  return new Chart("myChart", {
    type: "doughnut", // pie, doughnut
    data: {
      labels: keys,
      datasets: [
        {
          data: values,
          backgroundColor: bgColors,
        },
      ],
    },
    options: {
      cutoutPercentage: 5,
      legend: {
        display: false,
      },
      tooltips: {
        bodyFontSize: 20,
        callbacks: {
          label: function (tooltipItem, data) {
            return (
              data["labels"][tooltipItem["index"]] +
              ": " +
              data["datasets"][0]["data"][tooltipItem["index"]] +
              "%"
            );
          },
        },
      },
    },
  });
};

getData();
