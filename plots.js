// the d3.select() method is used to select the dropdown menu, which has an id of 
// #selDataset. The dropdown menu is assigned to the variable selector.
// •	The d3.json() method is used to read the data from samples.json. 
// The data from the entire JSON file is assigned the (arbitrary) argument name data.
// •	Inside the data object, the names array, as seen from console.log(data), 
// contains the ID numbers of all the study participants.
// The variable sampleNames is assigned to this array.

function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      console.log(sampleNames)
    //   For each element in the array, a dropdown menu option is appended. 
    // The text of each dropdown menu option is the ID. Its value property is also
    //  assigned the ID.
// For example, ID "940" is the first element of the sampleNames array.
//  As the forEach() method iterates over the first element of the array,
//   a menu option is appended to the dropdown menu. It is then given the text 
//   (the text seen in the dropdown menu) "940", and its property 
//   is also assigned "940". The forEach() method will perform the same tasks 
//   for the next element of the array, "941".
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();                                                            
  
//   called from the HTML document
// When a change takes place to the dropdown menu, two things will need to occur:
// 1 The demographic information panel is populated with a specific volunteer's information.
// 2 The volunteer's data is visualized in a separate div.

// The demographic information panel is populated with a specific volunteer's information.
// The volunteer's data is visualized in a separate div.
  function optionChanged(newSample) {
    console.log(newSample);
    // These two functions will use the ID number to create that specific individual's information panel and charts, respectively.
    buildMetadata(newSample);
    // buildCharts(newSample);
  
  }
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
    //   Then the filter() method is called on the metadata array to filter for an 
    //     object in the array whose id property matches the ID number passed into 
    //     buildMetadata() as sample. Recall that each object in the metadata array 
    //     contains information about one person.
    // Because the results of the filter() method are returned as an array, the first 
    // item in the array (resultArray[0]) is selected and assigned the variable result.
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
    //   The id of the Demographic Info panel is sample-metadata. The d3.select() method is used to select this <div>, and the variable PANEL is assigned to it.
    // PANEL.html("") ensures that the contents of the panel are cleared when another ID 
    // number is chosen from the dropdown menu.
    // Finally, the append() and text() methods are chained to append a H6 heading to 
    // the panel and print the location of the volunteer to the panel, respectively.
      PANEL.html("");
      // PANEL.append("h6").text(result);
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}= ${value}`);
      });
      // PANEL.append("h6").text(result.age);
      // PANEL.append("h6").text(result.bbtype);
      // PANEL.append("h6").text(result.ethnicity);
      // PANEL.append("h6").text(result.gender);
      // PANEL.append("h6").text(result.id);
      // PANEL.append("h6").text(result.wfreq);
    });
  }