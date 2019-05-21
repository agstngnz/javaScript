// from data.js
var tableData = data;

// Select the submit button
const submit = d3.select("#filter-btn");

// Get a reference to the table body
let tbody = d3.select("#ufo-table>tbody");

submit.on("click", function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // clear the existing table output
    tbody.html("");

    // Select the input element and get the raw HTML node
    const inputDate = d3.select("#datetime");

    // Get the value property of the input element
    const inputDateValue = inputDate.property("value");

    //   console.log(inputDateValue);
    //   console.log(tableData);

    // Search through the date/time column to find rows that match user inputDateValue.
    const filteredData = tableData.filter(sighting => sighting.datetime === inputDateValue);

    //   console.log(filterDate);

    // Loop through filteredData and append one table row `tr` for each object.
    // Append cell `td` for each value in object
    // Update each cell's text with object value
    filteredData.forEach((sighting) => {
            
        // console.log(sighting);
        
        const row = tbody.append("tr");
        for (key in sighting){
            const cell = row.append("td");
            cell.text(sighting[key]);
        }
    });
});
