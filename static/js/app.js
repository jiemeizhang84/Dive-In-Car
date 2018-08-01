function getOptions() {

    // Grab a reference to the dropdown select element
    var selector_price = document.getElementById('price-list');

    // Use the list of sample names to populate the select options
    Plotly.d3.json('/price_bin', function(error, price_bin) {

        print(price_bin)
        for (var i = 0; i < price_bin.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = price_bin[i];
            currentOption.value = price_bin[i]
            selector_price.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })

    var selector_mileage = document.getElementById('mileage-list');

    Plotly.d3.json('/mileage_bin', function(error, mileage_bin) {

        print(mileage_bin)
        for (var i = 0; i < mileage_bin.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = mileage_bin[i];
            currentOption.value = mileage_bin[i]
            selector_mileage.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })

    var selector_year = document.getElementById('year-list');

    Plotly.d3.json('/years', function(error, years) {

        print(years)
        for (var i = 0; i < years.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = years[i];
            currentOption.value = years[i]
            selector_year.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })
}

function init() {
    getOptions();
}

// Initialize the dashboard
init();