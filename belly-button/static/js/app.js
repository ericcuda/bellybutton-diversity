function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {

    console.log(data)   //peek at the data
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelMeta = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panelMeta.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      panelMeta.append("h6").text(`${key}: ${value}`
      );
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


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
