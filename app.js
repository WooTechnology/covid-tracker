// SELECT ALL ELEMENTS
const country_name_element = document.querySelector(".country-name");
const active_element = document.querySelector(".th-1 .value");
const total_cases_element = document.querySelector(".th-5 .value");
const recovered_element = document.querySelector(".th-2 .value");

const deaths_element = document.querySelector(".th-3 .value");
const test_done_element = document.querySelector(".th-4 .value");
// const country_element = document.querySelector(".th-6 .value");

const world_confirmed_element= document.querySelector(".side-table-1 .value");
const world_recovered_element= document.querySelector(".side-table-2 .value");
const world_deaths_element= document.querySelector(".side-table-3 .value");


const ctx = document.getElementById("axes_line_chart").getContext("2d");


// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  deaths = [],
  test_done_list= [],
  formatedDates = [],
  world_confirmed_data,
  world_recovered_data,
  world_deaths_data,
  countries2d = [];

  var all_countries_data = {};
  var sorted_countries2d = [];
  var flag_codes = [];
  var top_ten_country_names = [];
  var top_ten_country_cases = [];
  // var create_map= 1;

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
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://corona-api.com/countries",
    requestOptions
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      // console.log(data.data);
      all_countries_data = data.data;
      populate_countries2d();
    });
}
get_countries2d();

function populate_countries2d(){
  // console.log(all_countries_data);
  countries2d.push(['Country', 'Confirmed Cases']);
  for(i=0; i<all_countries_data.length;++i){
    // var country = all_countries_data[i].name;
    // var cases =  all_countries_data[i].latest_data.confirmed;
    // console.log(all_countries_data[i].name);
    // console.log(all_countries_data[i].latest_data.confirmed);
    // if (all_countries_data[i].name == "USA"){
    //   countries2d.push(["US", all_countries_data[i].latest_data.confirmed]);
    // }
    // else
      countries2d.push([all_countries_data[i].name, all_countries_data[i].latest_data.confirmed]);
  }
  console.log(countries2d);

  //Making array as inbuilt sort function can only be used on array
  // var sorted_countries2d = [];      //make this global variable
  for(i=0; i<countries2d.length;++i){
      sorted_countries2d.push(countries2d[i]);
  }

  sorted_countries2d.sort(function(a, b) {
      return b[1] - a[1];
  });
  console.log(sorted_countries2d);

  // console.log(countries2d[2][1]);
  createMap();
  fetch_top_ten_countries();
}

function fetch_top_ten_countries(){
  for(i=1; i<=10;++i){
    for(j=0;j<country_list.length;++j){
      if(sorted_countries2d[i][0]== country_list[j].name){
        // console.log(country_list[j].code);
        flag_codes.push(country_list[j].code);
        top_ten_country_names.push(country_list[j].name);
        top_ten_country_cases.push(sorted_countries2d[i][1]);
      }
    }
  }
  console.log(flag_codes);
  console.log(top_ten_country_names);
  console.log(top_ten_country_cases);

  for(i=1; i<=10;++i){
    const flag_element = document.getElementById("td-"+i+"-flag");
    const country_name_element = document.getElementById("td-"+i+"-country-name");
    const country_cases_element = document.getElementById("td-"+i+"-country-cases");
    // console.log(element);
    // const td_8_flag_element = document.getElementById("td-8-flag");
    // const td_8_country_name_element = document.getElementById("td-8-country-name");
    // const td_8_country_cases_element = document.getElementById("td-8-country-cases");

    flag_code = flag_codes[i-1];
    // console.log(flag_code);
    flag_element.innerHTML += `<img class="flags" src="https://www.countryflags.io/${flag_code}/flat/64.png">`;
    // console.log(td_8_flag_element);

    country_name_element.innerHTML = top_ten_country_names[i-1];
    // console.log(td_8_country_name_element);
    country_cases_element.innerHTML = top_ten_country_cases[i-1];
  }
}

function fetchData(country) {
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

        //tests done
        await fetch(
          "https://corona.lmao.ninja/v2/countries/" +
            country ,
          requestOptions
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            test_done_list= data.tests;
            // console.log(data);
            // data.forEach((entry) => {
            //   dates.push(entry.Date);
            //   // console.log(dates[dates.length-1]);
            //
            //   cases_list.push(entry.Cases);
            // });
          });

        //Fetching Statistics for entire World
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
    test_done_element.innerHTML = test_done_list;
    // new_deaths_element.innerHTML = `+${new_deaths_cases}`;
    active_element.innerHTML= total_cases- total_recovered;
    // console.log(country_element);
    // country_element.innerHTML = country_list.length;
    world_confirmed_element.innerHTML= world_confirmed_data;
    world_recovered_element.innerHTML= world_recovered_data;
    world_deaths_element.innerHTML= world_deaths_data;



    // format dates
    dates.forEach((date) => {
      formatedDates.push(formatDate(date));
    });

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



function createMap(){
  var modified_countries2d = [];
  modified_countries2d.push(['Country', 'Confirmed Cases']);
  for(i=0; i<all_countries_data.length;++i){
    // var country = all_countries_data[i].name;
    // var cases =  all_countries_data[i].latest_data.confirmed;
    // console.log(all_countries_data[i].name);
    // console.log(all_countries_data[i].latest_data.confirmed);
    if (all_countries_data[i].name == "USA"){
      modified_countries2d.push(["US", all_countries_data[i].latest_data.confirmed]);
    }
    else
      modified_countries2d.push([all_countries_data[i].name, all_countries_data[i].latest_data.confirmed]);
  }

  // for(i=0; i<modified_countries2d.length;++i){
  //   if (modified_countries2d[i][0] == "USA"){
  //     modified_countries2d[i][0] = "US";
  //     // countries2d.push(["US", all_countries_data[i].latest_data.confirmed]);
  //   }
  // }

  google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyB2AdWGI5geyvPnxxTPKUv6rUvbrLuK8bE'
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(modified_countries2d);

        var options = {
          colorAxis: {colors: ['#fce9c4','#f8cb74','#f7c461','#f5b539','#dda333','#d5873f','#ac7f28','#941e40'], stroke: '#34c', strokeWidth: 130},
          backgroundColor: {fill:'transparent',stroke:'#fff' ,strokeWidth:0 },
          datalessRegionColor: '#F5F0E7',
          displayMode: 'regions',
          enableRegionInteractivity: 'true',
          resolution: 'countries',
          sizeAxis: {minValue: 1, maxValue:1,minSize:10, maxSize: 10},
          region:'world',
          keepAspectRatio: true,
          tooltip: {isHtml:'true',textStyle: {color: '#444444'}, trigger:'focus'}};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));


        //To update statistics when a region is clicked
        google.visualization.events.addListener(chart, "regionClick", function (eventData) {
          let countrycode= eventData.region;
          for (i=0;i<country_list.length;++i){
            if(country_list[i].code == eventData.region){
              fetchData(country_list[i].name);
            }
          }
        })

        chart.draw(data, options);
      }
}
// app.txt
// Displaying app.txt.