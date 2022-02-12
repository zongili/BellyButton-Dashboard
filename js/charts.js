function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id === sample);
    // console.log("resultarray data: ", resultArray);

       //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];
    // console.log("samples for charts:", firstSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids;
    var sampleValues = firstSample["sample_values"];
    var otuLabels = firstSample.otu_labels;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var yticks = otuID.slice(0,10).sort((a,b) => a-b).map((otuID) => `OTU ${otuID}`).reverse();
    var yticks = otuID.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    // var xticks = sampleValues.slice(0,10).sort((a,b) => a-b);
    var xticks = sampleValues.slice(0,10).reverse();
    // var txt = otuLabels.slice(0,10).sort((a,b) => a-b);
    // The hover text is the otu_labels in descending order.
    var txt = otuLabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    // console.log("x, y ticks and labels: ", xticks, yticks, txt)
    var barData = [{
      x: xticks,
      y: yticks,
      text: txt,
      type: "bar",
      orientation: 'h'
    }];
    // // 9. Create the layout for the bar chart. 
    var barLayout = { 
      title: "Top 10 Bacteria Cultures Found"  
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);

    // BUBBLE CHART
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color:otuID,
        size: sampleValues,
        colorscale : 'YlGnBu'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin:{b: 80},
      hovermode :"closest"
    };
    // console.log("bubble x, y ticks and labels: ", otuID, sampleValues, otuLabels)
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData,bubbleLayout); 
    // 
    // GAUGE CHART
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata.filter(sampleMeta => sampleMeta.id == sample);
    // console.log("Metadata array for Gauge: ", metaArray);
      // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = metaArray[0];
    // console.log("first Metadata: ", firstMetadata);
    // 3. Create a variable that holds the washing frequency.
    // In Step 3, create a variable that converts the washing frequency to a floating point number.
    var washingFreq = parseFloat(firstMetadata.wfreq);
    // console.log("Washing freq: ",washingFreq)
    var gaugeDiv = document.getElementById("gauge");
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
    mode: "gauge+number",
    type: "indicator",
    value: washingFreq,
    title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
    gauge: {
        shape: "angular",
        bar: {
            line: {color: "black", width: 16},  
            thickness: 0
        },
        bordercolor: "gray",
        borderwidth: 1.5,
        axis: {
            range: [0,10],
            visible: true,
            tickmode: "array",
            tickvals: [0, 2, 4, 6, 8, 10],
            ticks: "outside"
        },
        steps: [  
            {'range': [0, 2], 'color': 'red'},
            {'range': [2, 4], 'color': 'orange'},
            {'range': [4,6], 'color': 'yellow'},
            {'range': [6,8], 'color': '92b73a'},
            {'range': [8,10], 'color': 'green'},  
        ]
      }
    }]

  var theta = 93.5
  var r = 0.7
  var x_head = r * Math.cos(Math.PI/180*theta)
  var y_head = r * Math.sin(Math.PI/180*theta)
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = {
    xaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
    yaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
    showlegend: false
    // annotations: [{
    //   ax: 0.5,
    //   ay: 0,
    //   axref: 'x',
    //   ayref: 'y',
    //   x: 0.5+x_head,
    //   y: y_head,
    //   xref: 'x',
    //   yref: 'y',
      // showarrow: false
    // }]
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot(gaugeDiv, gaugeData, gaugeLayout);
  });
}
