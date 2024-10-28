function displayCalendarInModal() {
    var selectedYear = document.getElementById("yearDropdown").value;
    var selectedMonth = document.getElementById("monthDropdown").value;

    // Get the number of days in the selected month and year
    var daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // Get the day dropdown
    var dayDropdown = document.getElementById("dayDropdown");
    var yesterdayDropdown = document.getElementById("yesterdayDropdown");

    // Get the currently selected day, if any
    var selectedDay = dayDropdown.value;
    var yesterday = yesterdayDropdown.value;

    // Clear existing options in the day dropdown
    dayDropdown.options.length = 0;
    yesterdayDropdown.options.length = 0;

    // Populate the day dropdown with the days of the selected month
    for (var i = 1; i <= daysInMonth; i++) {
        var day = i.toString().padStart(2, '0'); // Ensure two-digit format
        var option = new Option(day, day);
        dayDropdown.add(option);
    }

    for (var i = 1; i <= daysInMonth; i++) {
        var day = i.toString().padStart(2, '0'); // Ensure two-digit format
        var option = new Option(day, day);
        yesterdayDropdown.add(option);
    }

    // Set the selected day back to its previous value, if available
    if (selectedDay && selectedDay <= daysInMonth) {
        dayDropdown.value = selectedDay;
    }

    // Set the selected day back to its previous value, if available
    if (yesterday && yesterday <= daysInMonth) {
        yesterdayDropdown.value = yesterday;
    }
}

function yes() {

    // Call the function to populate the date dropdowns
    displayCalendarInModal();

    // Retrieve the selected date
    var selectedYear = document.getElementById("yearDropdown").value;
    var selectedMonth = document.getElementById("monthDropdown").value;
    var selectedDay = document.getElementById("dayDropdown").value;
    var selectedYesterday = document.getElementById("yesterdayDropdown").value;

    // Create a Date object for the selected date
    var selectedDate = `${selectedYear}-${(selectedMonth)}-${(selectedDay)}`
    var yesterday = `${selectedYear}-${(selectedMonth)}-${(selectedYesterday)}`
    
    if (selectedDate >= yesterday) {
        today(selectedDate);
    }
    
    if(yesterday < selectedDate) {
        previousDay(yesterday);
    }

    closeModal();
}

// Function to close the modal
function closeModal() {
    document.getElementById("calendarModal").style.display = "none";
}

//FETCH DATA FROM DATABASE  
function today(selectedDate) {
    fetch('/fetch-data')
    .then((response) => response.json())
    .then((data) => {

        for (let i = 0; i < data.length; i++) {

            //URL
            if (selectedDate == (data[i].Date) && data[i].Type == "URL") {
                console.log(data[i].Date)
                const pagesValue = data[i].Actual_Output_Live;
                const expectoutput = data[i].Expected_Output_UAT;
        
                // Update HTML elements with the retrieved values
                document.getElementById('td-1-1').innerHTML = pagesValue;
                document.getElementById('td-2-1').innerHTML = expectoutput;
        
                // Calculate and update the count
                const count = pagesValue - expectoutput;
                document.getElementById('td-3-1').innerHTML = count;
            }
                
            //Links
            if (selectedDate == (data[i].Date) && data[i].Type == "Links") {
                console.log(data[i].Date)
                const pagesValue = data[i].Actual_Output_Live;
                const expectoutput = data[i].Expected_Output_UAT;
        
                // Update HTML elements with the retrieved values
                document.getElementById('td-7-1').innerHTML = pagesValue;
                document.getElementById('td-8-1').innerHTML = expectoutput;
        
                // Calculate and update the count
                const count = pagesValue - expectoutput;
                document.getElementById('td-9-1').innerHTML = count;
            }
        }
    })
    .catch((error) => {
        console.error('An error occurred while fetching or parsing the JSON Response:', error);
    });
}    


function previousDay(selectedDate) {
    fetch('/fetch-data')
    .then((response) => response.json())
    .then((data) => {

        for (let i = 0; i < data.length; i++) {

            //URL
            if (selectedDate == (data[i].Date) && data[i].Type == "URL") {
                console.log(data[i].Date)
                const pagesValue = data[i].Actual_Output_Live;
                const expectoutput = data[i].Expected_Output_UAT;

                // Update HTML elements with the retrieved values
                document.getElementById('td-1-2').innerHTML = pagesValue;
                document.getElementById('td-2-2').innerHTML = expectoutput;

                // Calculate and update the count
                const count = pagesValue - expectoutput;
                document.getElementById('td-3-2').innerHTML = count;
            }

            //Links
            else if (selectedDate == (data[i].Date) && data[i].Type == "Links") {
                console.log(data[i].Date)
                const pagesValue = data[i].Actual_Output_Live;
                const expectoutput = data[i].Expected_Output_UAT;

                // Update HTML elements with the retrieved values
                document.getElementById('td-7-2').innerHTML = pagesValue;
                document.getElementById('td-8-2').innerHTML = expectoutput;

                // Calculate and update the count
                const count = pagesValue - expectoutput;
                document.getElementById('td-9-2').innerHTML = count;
            }
        }
    })
    .catch((error) => {
        console.error('An error occurred while fetching or parsing the JSON file:', error);
    });
}    