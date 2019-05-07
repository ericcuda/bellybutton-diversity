function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {


    // Use d3 to select the panel with id of `#sample-metadata`
    var panelMeta = d3.select("#sample-metadata");

    console.log(data)   //peek at the data

    // Use `.html("") to clear any existing metadata
    panelMeta.html("")

    console.log(Object.entries(data))
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      panelMeta.append("h6").text(`${key}: ${value}`
      );
    })

    // BONUS: Build the Gauge Chart..putting it in my metadata route..not in bonus.js file
    //buildGauge(data.WFREQ);
    var washData = data.WFREQ

    console.log(`washData= ${washData}`)

    var level = washData * 20

    //trig to calculate the meter point from plotly doc
    var degrees = 180 - (level),
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may need to mod this for a better shape....
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var gData = [{
      type: 'scatter',
      x: [0],
      y: [0],
      marker: {
        size: 28,
        color: '850000'
      },
      showlegend: false,
      name: 'freq',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      values: [45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 45 / 8, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition: 'inside',

      marker: {
        colors: ['rgba(132, 181, 137, 1)', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
          '#F4F1E2', '#F8F3E1', 'rgba(255, 255, 255, 0)',]
      },
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    const gaugeLayout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 550,
      width: 600,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };

    Plotly.newPlot('gauge', gData, gaugeLayout);


  })   // end of d3.json fetch metadata
}  // end of function buildMetadata


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots


  d3.json(`/samples/${sample}`).then(function (data) {
    console.log(data)   //peek at the data
    // @TODO: Build a Bubble Chart using the sample data
    // console.log()

    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;

    var trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    }
    var trace1 = [trace];
    var layout = {
      height: 500,
      width: 1400,
      showlegend: false,
      title: "Bubble Plot For Selected Sample"
    }
    Plotly.newPlot('bubble', trace1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var piedata = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: "hovertext",
      type: "pie"
    }]
    var layout = {
      showlegend: true,
      title: "Pie Chart For Selected Sample"
    }
    Plotly.newPlot('pie', piedata, layout);

  } // end of d3.json fetch sample data

  )
}  // end of buildCharts

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
