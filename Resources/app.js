// SELECT ALL ELEMENTS
const country_name_element = document.querySelector(".country-name");
const active_element = document.querySelector(".th-1 .value");
const total_cases_element = document.querySelector(".th-5 .value");
const recovered_element = document.querySelector(".th-2 .value");

const deaths_element = document.querySelector(".th-3 .value");
const country_element = document.querySelector(".th-6 .value");

const world_confirmed_element= document.querySelector(".side-table-1 .value");
const world_recovered_element= document.querySelector(".side-table-2 .value");
const world_deaths_element= document.querySelector(".side-table-3 .value");

const weekday_7_element= document.querySelector(".value-1");
const weekday_6_element= document.querySelector(".value-2");
const weekday_5_element= document.querySelector(".value-3");
const weekday_4_element= document.querySelector(".value-4");
const weekday_3_element= document.querySelector(".value-5");
const weekday_2_element= document.querySelector(".value-6");
const weekday_1_element= document.querySelector(".value-7");


const ctx = document.getElementById("axes_line_chart").getContext("2d");

// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  deaths = [],
  formatedDates = [],
  world_confirmed_data,
  world_recovered_data,
  world_deaths_data,
  countries2d = [];
  country2dcases_list = [];
  country2dlast_confirmed = [];

  var create_map= 1;
  
// GET USERS COUNTRY CODE
let country_code = geoplugin_countryCode();
let user_country;
country_list.forEach((country) => {
  if (country.code == country_code) {
    user_country = country.name;
  }
});
fetchData(user_country);

function get_countries2d(){
  // for(i=0; i<country_list.length;++i){
    for(i=0; i<9;++i){
     console.log(country_list[i].name);
      function1(country_list[i].name);
  }
  // for(i=0; i<country_list.length;++i){
  //   countries2d.push([country_list[i].name, parseInt(country2dlast_confirmed[i])]);
  // }
  // console.log("countries 2d array is ");
  //  console.log(countries2d);
}
get_countries2d();

  function function1(country){
  country_name = country;
  // console.log("user country is" + country_name);
  country2dcases_list = [];

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const api_fetch = async (country) => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log("inside then(data) for " + country);
        data.forEach((entry) => {
          
          // console.log(entry.Cases);
           country2dcases_list.push(entry.Cases);
        });
        // console.log(country2dcases_list[country2dcases_list.length-1]);
        countries2d.push([country, country2dcases_list[country2dcases_list.length-1]]);
        // country2dlast_confirmed.push(country2dcases_list[country2dcases_list.length-1]);
      });
    };
  
    api_fetch(country);  
  }
  
  





function fetchData(country) {
  // console.log("fetchdata running")
    user_country = country;
    country_name_element.innerHTML = "Loading...";
  
    (cases_list = []),
      (recovered_list = []),
      (deaths_list = []),
      (dates = []),
      (formatedDates = []);
     
  
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    const api_fetch = async (country) => {
      await fetch(
        "https://api.covid19api.com/total/country/" +
          country +
          "/status/confirmed",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            dates.push(entry.Date);
            // console.log(dates[dates.length-1]);
            
            cases_list.push(entry.Cases);
          });
        });
  
      await fetch(
        "https://api.covid19api.com/total/country/" +
          country +
          "/status/recovered",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            
            recovered_list.push(entry.Cases);
          });
        });
  
      await fetch(
        "https://api.covid19api.com/total/country/" + country + "/status/deaths",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            
            deaths_list.push(entry.Cases);
          });
        });


        await fetch(
          "https://covid19.mathdro.id/api",
          requestOptions
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            world_confirmed_data = data.confirmed.value;
            world_recovered_data = data.recovered.value;
            world_deaths_data = data.deaths.value;
          });
      updateUI();
    };
  
    api_fetch(country);
    
  }
  
  // fetchData(user_country);
  
  // UPDATE UI FUNCTION
  function updateUI() {
    updateStats();
    axesLinearChart();
  }
  
  function updateStats() {
    const total_cases = cases_list[cases_list.length - 1];
    // const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];
    
    const total_recovered = recovered_list[recovered_list.length - 1];
    // const new_recovered_cases =
    //   total_recovered - recovered_list[recovered_list.length - 2];
    
    const total_deaths = deaths_list[deaths_list.length - 1];
    // const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];
    const total_country = country_list.length;
    country_name_element.innerHTML = user_country;
    total_cases_element.innerHTML = total_cases;
    // new_cases_element.innerHTML = `+${new_confirmed_cases}`;
    recovered_element.innerHTML = total_recovered;
    // new_recovered_element.innerHTML = `+${new_recovered_cases}`;
    deaths_element.innerHTML = total_deaths;
    // new_deaths_element.innerHTML = `+${new_deaths_cases}`;
    active_element.innerHTML= total_cases- total_recovered;
  country_element.innerHTML = country_list.length;
  world_confirmed_element.innerHTML= world_confirmed_data;
  world_recovered_element.innerHTML= world_recovered_data;
  world_deaths_element.innerHTML= world_deaths_data;
  
  

    // format dates
    dates.forEach((date) => {
      formatedDates.push(formatDate(date));
    });
    // console.log(formatedDates)
    // console.log(formatedDates[formatedDates.length-1]);
    weekday_7 = formatedDates[formatedDates.length-7];
    sliced_7 = weekday_7.slice(0, 2);
    // console.log(sliced_7);
    weekday_6 = formatedDates[formatedDates.length-6];
    sliced_6 = weekday_6.slice(0, 2);
    weekday_5 = formatedDates[formatedDates.length-5];
    sliced_5 = weekday_5.slice(0, 2);
    weekday_4 = formatedDates[formatedDates.length-4];
    sliced_4 = weekday_4.slice(0, 2);
    weekday_3 = formatedDates[formatedDates.length-3];
    sliced_3 =  weekday_3.slice(0, 2);
    weekday_2 = formatedDates[formatedDates.length-2];
    sliced_2 = weekday_2.slice(0, 2);
    weekday_1 = formatedDates[formatedDates.length-1];
    sliced_1 = weekday_1 .slice(0, 2);
    

    weekday_7_element.innerHTML= sliced_7;
    weekday_6_element.innerHTML= sliced_6;
    weekday_5_element.innerHTML= sliced_5;
    weekday_4_element.innerHTML= sliced_4;
    weekday_3_element.innerHTML= sliced_3;
    weekday_2_element.innerHTML= sliced_2;
    weekday_1_element.innerHTML= sliced_1;
   
  }
  
  // UPDATE CHART
  let my_chart;
  function axesLinearChart() {
    if (my_chart) {
      my_chart.destroy();
    }
  
    my_chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Cases",
            data: cases_list,
            fill: false,
            borderColor: "#FFF",
            backgroundColor: "#FFF",
            borderWidth: 1,
          },
          {
            label: "Recovered",
            data: recovered_list,
            fill: false,
            borderColor: "#009688",
            backgroundColor: "#009688",
            borderWidth: 1,
          },
          {
            label: "Deaths",
            data: deaths_list,
            fill: false,
            borderColor: "#f44336",
            backgroundColor: "#f44336",
            borderWidth: 1,
          },
        ],
        labels: formatedDates,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  
  // FORMAT DATES
  const monthsNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  function formatDate(dateString) {
    let date = new Date(dateString);
  
    return `${date.getDate()} ${monthsNames[date.getMonth() - 1]}`;
  }


 //MapData function creates a 2D array with country names and their cases. This array is used to build the world map
// function mapData(result){
//   create_map=0;     //we only have to make map when app is running for the first time
//   var flag=0;       //flag stores if a country contains predicted cases data or not. Loop will break when flag=1
//   countries2d.push(['Country', 'Confirmed Cases']);
//   for(i=1; i<result.values.length-1;++i){
//     if(result.values[i][0]!= result.values[i+1][0] && flag==0)   //for countries with no predicted dataset. First condition checks if a country's data is finished and flag checks if a country contains predicted dataset
//       countries2d.push([result.values[i][0], parseInt(result.values[i][2])]);
//     else if(!result.values[i+1][2] && result.values[i][0]== result.values[i+1][0] && flag==0){   //no confirmed cases[2] but country's data is not finsihed[0] this means predicted dataset is present
//       flag=1;
//       countries2d.push([result.values[i][0], parseInt(result.values[i][2])]);
//     }
//     else if(result.values[i][0]!= result.values[i+1][0])     //country changed
//       flag=0;
//   }
//   createMap();
// }


// function createMap(){
//   google.charts.load('current', {
//         'packages':['geochart'],
//         'mapsApiKey': 'AIzaSyB2AdWGI5geyvPnxxTPKUv6rUvbrLuK8bE'
//       });
//       google.charts.setOnLoadCallback(drawRegionsMap);

//       function drawRegionsMap() {
//         var data = google.visualization.arrayToDataTable(countries2d);

//         var options = {
//           colorAxis: {colors: ['#fce9c4','#f8cb74','#f7c461','#f5b539','#dda333','#d5873f','#ac7f28','#941e40'], stroke: '#34c', strokeWidth: 130},
//           backgroundColor: {fill:'transparent',stroke:'#fff' ,strokeWidth:0 },
//           datalessRegionColor: '#F5F0E7',
//           displayMode: 'regions',
//           enableRegionInteractivity: 'true',
//           resolution: 'countries',
//           sizeAxis: {minValue: 1, maxValue:1,minSize:10, maxSize: 10},
//           region:'world',
//           keepAspectRatio: true,
//           tooltip: {isHtml:'true',textStyle: {color: '#444444'}, trigger:'focus'}};

//         var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));


//         //To update statistics when a region is clicked
//         google.visualization.events.addListener(chart, "regionClick", function (eventData) {
//           let countrycode= eventData.region;
//           for (i=0;i<country_list.length;++i){
//             if(country_list[i].code == eventData.region){
//               fetchData(country_list[i].name);
//             }
//           }
//         })

//         chart.draw(data, options);
//       }
// }
