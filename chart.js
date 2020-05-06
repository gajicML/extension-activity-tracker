window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  green: "rgb(75, 192, 192)",
  yellow: "rgb(255, 205, 86)",
  grey: "rgb(201, 203, 207)",
};

const randomColor = () => {
  return (
    "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6)
  );
};

// Pie chart
let myChart = document.getElementById("myChart").getContext("2d");

// Global options
Chart.defaults.global.defaultFontFamily = "Montserrat";

let visitedUrls = {
  "youtube.com": 35,
  "google.com": 30,
  "chartjs.com": 25,
  "worldometer.com": 10,
};

// get labels
const keys = Object.keys(visitedUrls);
console.log(keys);

// get values
const values = Object.values(visitedUrls);
console.log(values);

// get defined colors
const colors = Object.values(window.chartColors);

// set colors
let bgColors = [];
for (let i = 0; i < values.length; i++) {
  if (i <= colors.length) {
    bgColors.push(colors[i]);
    console.log[colors[i]];
  } else {
    bgColors.push(randomColor());
  }
}

let pieChart = new Chart("myChart", {
  type: "pie",
  data: {
    labels: keys,
    datasets: [
      {
        label: "Visited",
        data: values,
        backgroundColor: bgColors,
      },
    ],
  },
  options: { responsive: true },
});
