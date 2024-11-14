let pageData;
let uniqueRunids;
let currentRunData
let previousRunData
let consoleLogs
let results
function enableControls() {
    const date = document.getElementById("date").value;
    const getDataButton = document.getElementById("button");
    const runNumberDropdown = document.getElementById("runNumber");

    if (date) { // Enable only if a date is selected
        getDataButton.disabled = false;
        runNumberDropdown.disabled = false;
    }
}
let date

function getDate() {
  date = document.getElementById("date").value;
  alert(`Selected Date: ${date}`);

  // Send the date as a POST request
  fetch("http://localhost:3000/api/data", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ date })  // Send the date in JSON format
  })
  .then((response) => response.json())
  .then((data) => {
      // getCount(data);
      console.log("API call successful:", data);
      pageData = data;

      // Assuming `data` is filtered based on date
      const uniqueRunids = [...new Set(data.map((item) => item.RunID))];
      const runNumberSelect = document.getElementById("runNumber");

      runNumberSelect.innerHTML = `<option value="" disabled selected>Select a Run Number</option>`;
      uniqueRunids.forEach(runID => {
          const option = document.createElement("option");
          option.value = runID;
          option.textContent = runID;
          runNumberSelect.appendChild(option);
      });
  })
  .catch((error) => {
      console.error("Error in API call:", error);
  });
}
  console.log(uniqueRunids);
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("runNumber").addEventListener("change", function () {
      const selectedRunID = this.value;
    
      fetch("http://localhost:3000/api/compare-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runID: selectedRunID,selectedDate:date })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Comparison data:", data);
        const { currentRun, previousRun } = data;
        currentRunData=currentRun
        previousRunData = previousRun
        getCurrentCount(currentRun)
        console.log(        getCurrentCount(currentRun)      )
        getPrevCount(previousRun)
        // Display currentRun and previousRun data for comparison
        // displayRunData(currentRun, previousRun);
      })
      .catch(error => console.error("Error fetching comparison data:", error));
    });
  })


// function displayRunData(currentRun, previousRun) {
//   // Implement your display logic to show the Difference_Datas between currentRun and previousRun
// }

function filterByRunID() {
    const selectedRunID = document.getElementById("runNumber").value;

    const filteredDataByRunID = pageData.filter(item => item.RunID === selectedRunID);
    currentRunData = filteredDataByRunID
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.disabled = false;

    console.log(filteredDataByRunID); // Process or display the filtered data
    getConsoleLogs(filteredDataByRunID)
}

function getConsoleLogs(filteredDataByRunID) {
  consoleLogs = filteredDataByRunID.filter(ele => ele.Type === 'Console Log');
  console.log(filteredDataByRunID.filter(ele => ele.Status !== "PASS"));
  console.log(consoleLogs);
  const consolelogdiv = document.getElementById("consoleDiv");

  if(consoleLogs.length===0){
    consolelogdiv.style.display = 'block';
    const downloadConsoleLogBtn = document.getElementById("downloadConsoleLogBtn")
    downloadConsoleLogBtn.style.display = 'none';
    
    const consoleLogBox = document.getElementById("consoleLogBox");
    tableHtml = '<p>No console logs to display</p>';
    consoleLogBox.innerHTML = tableHtml

  }else{
    consolelogdiv.style.display = 'block';
    const downloadConsoleLogBtn = document.getElementById("downloadConsoleLogBtn")
    downloadConsoleLogBtn.style.display = 'block';

    const consoleLogBox = document.getElementById("consoleLogBox");
    consoleLogBox.innerHTML = ''; // Clear previous logs
  
    // HTML structure for the console log table
    let tableHtml = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
            <thead>
                <tr>
                    <th style="background-color:#152c5e;color:white;padding:6px">RunID</th>
                    <th style="background-color:#152c5e;color:white;padding:6px">Page</th>
                    <th style="background-color:#152c5e;color:white;padding:6px">Time</th>
                    <th style="background-color:#152c5e;color:white;padding:6px">Error</th>
                </tr>
            </thead>
            <tbody>
    `;
  
    // Function to truncate long text
    function truncateText(text, maxLength = 100) {
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
  
    // Populate table rows with truncated console log data
    consoleLogs.forEach((item, index) => {
      tableHtml += `
          <tr data-index="${index}" style="border: 1px solid black; padding: 10px; cursor: pointer;">
              <td style="padding:5px;">${item.RunID}</td>
              <td style="padding:5px;">${item.Page}</td>
              <td style="padding:5px;">${item.Time}</td>
              <td style="padding:5px;">${truncateText(item.Source_Data)}</td>
          </tr>
      `;
    });
  
    // Close the table HTML
    tableHtml += `
            </tbody>
        </table>
    `;
  
    // Insert the table into the console log box container
    consoleLogBox.innerHTML = tableHtml;
  
    // Add event listeners to each row to open a popup with full details
    document.querySelectorAll("#consoleLogBox table tbody tr").forEach((row) => {
      row.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        const item = consoleLogs[index];
  
        // HTML for the popup
        const popupHtml = `
          <html>
          <head>
              <title>RunID: ${item.RunID}</title>
              <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                  th, td { padding: 10px; border: 1px solid black; text-align: left; }
                  th { background-color: #f2f2f2; }
              </style>
          </head>
          <body>
              <h2>Details for RunID: ${item.RunID}</h2>
              <table>
                  <thead>
                      <tr>
                          <th>RunID</th>
                          <th>Page</th>
                          <th>Time</th>
                          <th>Error</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${item.RunID}</td>
                          <td>${item.Page}</td>
                          <td>${item.Time}</td>
                          <td>${item.Source_Data}</td>
                      </tr>
                  </tbody>
              </table>
          </body>
          </html>
        `;
  
        // Open popup window with complete row data
        const width = 600;
        const height = 400;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        const popupWindow = window.open("", "_blank", `width=${width},height=${height},top=${top},left=${left}`);
        popupWindow.document.write(popupHtml);
        popupWindow.document.close();
      });
    });
  }
  
}

function getCurrentCount (data) {
  const passCountURL = data.filter(
    (item) => item.Type === ("URL") 
  ).length;
  const failCountURL = data.filter(
    (item) => item.Type===("URL") 
  ).length;
  const passCountTitle = data.filter(
    (item) => item.Type===("Title") 
  ).length;
  const failCountTitle = data.filter(
    (item) => item.Type===("Title")
  ).length;
  const passCountBreadcrumb = data.filter(
    (item) => item.Type===("Breadcrumb") 
  ).length;
  const failCountBreadcrumb = data.filter(
    (item) => item.Type===("Breadcrumb") 
  ).length;
  const passCountLinkCountData = data.filter(
    (item) => item.Type===("Link Count") 
  );
  console.log(passCountLinkCountData)
  const passCountLinkCount = passCountLinkCountData.reduce((acc, cur) => acc + parseInt(cur.Source_Data, 10), 0);

  console.log(passCountLinkCountData,passCountLinkCount)

  const failCountLinkCountData = data.filter(
    (item) => item.Type===("Link Count") 
  );
  const failCountLinkCount = failCountLinkCountData.reduce((acc, cur) => acc + parseInt(cur.Target_Data, 10), 0);

  const passCountLinkState = data.filter(
    (item) => item.Type===("Link State") 
  ).length;
  const failCountLinkState = data.filter(
    (item) => item.Type===("Link State") 
  ).length;
  const passCountPDF = data.filter(
    (item) => item.Type===("PDF") 
  ).length;
  const failCountPDF = data.filter(
    (item) => item.Type===("PDF") 
  ).length;
  const passCountImageCount = data.filter(
    (item) => item.Type===("Image Count") 
  ).length;
  const failCountImageCount = data.filter(
    (item) => item.Type===("Image Count") 
  ).length;

  const passCountDropdownCount = data.filter(
    (item) => item.Type===("Dropdown") 
  ).length;
  const failCountDropdownCount = data.filter(
    (item) => item.Type===("Dropdown") 
  ).length;

  const passCountTableCount = data.filter(
    (item) => item.Type===('Table Count') 
  ).length;
  const failCountTableCount = data.filter(
    (item) => item.Type===('Table Count') 
  ).length;
  const passCountTableRowCount = data.filter(
    (item) => item.Type===('Table Row Count') 
  ).length;
  const failCountTableRowCount = data.filter(
    (item) => item.Type===('Table Row Count') 
  ).length;
  const passCountTableColumnCount = data.filter(
    (item) => item.Type===('Table Column Count') 
  ).length;
  const failCountTableColumnCount = data.filter(
    (item) => item.Type===('Table Column Count') 
  ).length;


  // fill current url
  document.getElementById("td-1-1").textContent = passCountURL;
  document.getElementById("td-2-1").textContent = passCountURL;
  document.getElementById("td-3-1").classList.add("clickable");
  document.getElementById("td-3-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "URL")');
  
  
  // title
  document.getElementById("td-7-1").textContent = passCountTitle;
  document.getElementById("td-8-1").textContent = passCountTitle;
  document.getElementById("td-9-1").classList.add("clickable");
  document.getElementById("td-9-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "Title")');

  // breadCrumb
  document.getElementById("td-4-1").textContent = passCountBreadcrumb;
  document.getElementById("td-5-1").textContent = passCountBreadcrumb;
  document.getElementById("td-6-1").classList.add("clickable");
  document.getElementById("td-6-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "Breadcrumb")');

  // link count
  document.getElementById("td-10-1").textContent = passCountLinkCount;
  document.getElementById("td-11-1").textContent = failCountLinkCount;
  document.getElementById("td-12-1").textContent = Math.abs(passCountLinkCount - failCountLinkCount);
  document.getElementById("td-12-1").classList.add("clickable");
  document.getElementById("td-12-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "Link Count")');

  // link state
  document.getElementById("td-13-1").textContent = passCountLinkState;
  document.getElementById("td-14-1").textContent = passCountLinkState;
  document.getElementById("td-15-1").classList.add("clickable");
  document.getElementById("td-15-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "Link State")');

  // PDF count
  document.getElementById("td-16-1").textContent = passCountPDF;
  document.getElementById("td-17-1").textContent = passCountPDF;
  document.getElementById("td-18-1").classList.add("clickable");
  document.getElementById("td-18-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "PDF")');

  // image 
  document.getElementById("td-19-1").textContent = passCountImageCount;
  document.getElementById("td-20-1").textContent = passCountImageCount;
  document.getElementById("td-21-1").classList.add("clickable");
  document.getElementById("td-21-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "Image Count")');

  // Dropdown
  document.getElementById("td-22-1").textContent = passCountDropdownCount;
  document.getElementById("td-23-1").textContent = passCountDropdownCount;
  document.getElementById("td-24-1").classList.add("clickable");
  document.getElementById("td-24-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData, "Dropdown")');

  // slider
  document.getElementById("td-25-1").textContent = passCountTableCount;
  document.getElementById("td-26-1").textContent = passCountTableCount;
  document.getElementById("td-27-1").classList.add("clickable");
  document.getElementById("td-27-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData,"Table Count")');

  document.getElementById("td-28-1").textContent = passCountTableRowCount;
  document.getElementById("td-29-1").textContent = passCountTableRowCount;
  document.getElementById("td-30-1").classList.add("clickable");
  document.getElementById("td-30-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData,"Table Row Count")');

  document.getElementById("td-31-1").textContent = passCountTableColumnCount;
  document.getElementById("td-32-1").textContent = passCountTableColumnCount;
  document.getElementById("td-33-1").classList.add("clickable");
  document.getElementById("td-33-1").setAttribute("onclick", 'openNewWindowWithTable(currentRunData,"Table Column Count")');
};

function getPrevCount (data) {
  const passCountURL = data.filter(
    (item) => item.Type===("URL") 
  ).length;
  const failCountURL = data.filter(
    (item) => item.Type===("URL") 
  ).length;
  const passCountTitle = data.filter(
    (item) => item.Type===("Title") 
  ).length;
  const failCountTitle = data.filter(
    (item) => item.Type===("Title") 
  ).length;
  const passCountBreadcrumb = data.filter(
    (item) => item.Type===("Breadcrumb") 
  ).length;
  const failCountBreadcrumb = data.filter(
    (item) => item.Type===("Breadcrumb") 
  ).length;
  const passCountLinkCountData = data.filter(
    (item) => item.Type===("Link Count") 
  );
  console.log(passCountLinkCountData)
  const passCountLinkCount = passCountLinkCountData.reduce((acc, cur) => acc + parseInt(cur.Source_Data, 10), 0);

  console.log(passCountLinkCountData,passCountLinkCount)

  const failCountLinkCountData = data.filter(
    (item) => item.Type===("Link Count") 
  );
  const failCountLinkCount = failCountLinkCountData.reduce((acc, cur) => acc + parseInt(cur.Target_Data, 10), 0);

  const passCountLinkState = data.filter(
    (item) => item.Type===("Link State") 
  ).length;
  const failCountLinkState = data.filter(
    (item) => item.Type===("Link State") 
  ).length;
  const passCountPDF = data.filter(
    (item) => item.Type===("PDF") 
  ).length;
  const failCountPDF = data.filter(
    (item) => item.Type===("PDF") 
  ).length;
  const passCountImageCount = data.filter(
    (item) => item.Type===("Image Count") 
  ).length;
  const failCountImageCount = data.filter(
    (item) => item.Type===("Image Count") 
  ).length;

  const passCountDropdownCount = data.filter(
    (item) => item.Type===("Dropdown") 
  ).length;
  const failCountDropdownCount = data.filter(
    (item) => item.Type===("Dropdown") 
  ).length;

  const passCountTableCount = data.filter(
    (item) => item.Type===('Table Count') 
  ).length;
  const failCountTableCount = data.filter(
    (item) => item.Type===('Table Count') 
  ).length;
  const passCountTableRowCount = data.filter(
    (item) => item.Type===('Table Row Count') 
  ).length;
  const failCountTableRowCount = data.filter(
    (item) => item.Type===('Table Row Count') 
  ).length;
  const passCountTableColumnCount = data.filter(
    (item) => item.Type===('Table Column Count') 
  ).length;
  const failCountTableColumnCount = data.filter(
    (item) => item.Type===('Table Column Count') 
  ).length;


  // fill current url
  document.getElementById("td-1-2").textContent = passCountURL;
  document.getElementById("td-2-2").textContent = passCountURL;
  document.getElementById("td-3-2").classList.add("clickable");
  document.getElementById("td-3-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "URL")');
  
  
  // title
  document.getElementById("td-7-2").textContent = passCountTitle;
  document.getElementById("td-8-2").textContent = passCountTitle;
  document.getElementById("td-9-2").classList.add("clickable");
  document.getElementById("td-9-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "Title")');

  // breadCrumb
  document.getElementById("td-4-2").textContent = passCountBreadcrumb;
  document.getElementById("td-5-2").textContent = passCountBreadcrumb;
  document.getElementById("td-6-2").classList.add("clickable");
  document.getElementById("td-6-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "Breadcrumb")');

  // link count
  document.getElementById("td-10-2").textContent = passCountLinkCount;
  document.getElementById("td-11-2").textContent = failCountLinkCount;
  document.getElementById("td-12-2").textContent = Math.abs(passCountLinkCount - failCountLinkCount);
  document.getElementById("td-12-2").classList.add("clickable");
  document.getElementById("td-12-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "Link Count")');

  // link state
  document.getElementById("td-13-2").textContent = passCountLinkState;
  document.getElementById("td-14-2").textContent = passCountLinkState;
  document.getElementById("td-15-2").classList.add("clickable");
  document.getElementById("td-15-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "Link State")');

  // PDF count
  document.getElementById("td-16-2").textContent = passCountPDF;
  document.getElementById("td-17-2").textContent = passCountPDF;
  document.getElementById("td-18-2").classList.add("clickable");
  document.getElementById("td-18-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "PDF")');

  // image 
  document.getElementById("td-19-2").textContent = passCountImageCount;
  document.getElementById("td-20-2").textContent = passCountImageCount;
  document.getElementById("td-21-2").classList.add("clickable");
  document.getElementById("td-21-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "Image Count")');

  // Dropdown
  document.getElementById("td-22-2").textContent = passCountDropdownCount;
  document.getElementById("td-23-2").textContent = passCountDropdownCount;
  document.getElementById("td-24-2").classList.add("clickable");
  document.getElementById("td-24-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData, "Dropdown")');

  // slider
  document.getElementById("td-25-2").textContent = passCountTableCount;
  document.getElementById("td-26-2").textContent = passCountTableCount;
  document.getElementById("td-27-2").classList.add("clickable");
  document.getElementById("td-27-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData,"Table Count")');

  document.getElementById("td-28-2").textContent = passCountTableRowCount;
  document.getElementById("td-29-2").textContent = passCountTableRowCount;
  document.getElementById("td-30-2").classList.add("clickable");
  document.getElementById("td-30-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData,"Table Row Count")');

  document.getElementById("td-31-2").textContent = passCountTableColumnCount;
  document.getElementById("td-32-2").textContent = passCountTableColumnCount;
  document.getElementById("td-33-2").classList.add("clickable");
  document.getElementById("td-33-2").setAttribute("onclick", 'openNewWindowWithTable(previousRunData,"Table Column Count")');
};
function download(type) {
  let data
  if(type==="consolelog"){
data = consoleLogs.map((ele)=>{return {RunID:ele.RunID,Page:ele.Page,Time:ele.Time,Error:ele.Source_Data}})
  }else if(type==="current"){
    data = currentRunData
  }
  else if(type==="results"){
    data = results
  }
  // Create a worksheet from currentRunData
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Loop through each cell to apply wrap text for long text cells
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      for (let colIndex = 0; colIndex < Object.keys(data[rowIndex]).length; colIndex++) {
          const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
          const cell = worksheet[cellAddress];
          
          if (cell && cell.v && cell.v.length > 32767) {
              // Trim text to the maximum length allowed by Excel
              cell.v = cell.v.slice(0, 32767);
          }
      }
  }

  // Add wrap text styling to the worksheet
  worksheet['!cols'] = worksheet['!cols'] || [];
  Object.keys(worksheet).forEach(cellAddress => {
      if (cellAddress.startsWith('!')) return;
      worksheet[cellAddress].s = { alignment: { wrapText: true } };
  });

  // Create and download the workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "data.xlsx");
}






function displayTable() {
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = ""; // Clear the container before adding a new table

  const table = document.createElement("table");
  table.classList.add("table", "table-bordered", "table-hover"); // Bootstrap table classes

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Define the headers for the table
  const headers = ["ID", "Status", "Expected", "Actual"];
  const headerRow = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    th.classList.add("text-center", "bg-light"); // Add Bootstrap classes for header styling
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  // Add rows for each object in the JSON data
  pageData.forEach((item) => {
    const row = document.createElement("tr");
    // Ensure the item has properties for ID, Status, Expected, and Actual
    const values = [item.id, item.Status, item.Source_Data, item.Target_Data]; // Adjust these keys as per your data structure
    values.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value !== undefined ? value : "N/A"; // Handle undefined values
      td.classList.add("text-wrap"); // Bootstrap class for text wrapping
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

function openNewWindowWithTable(data,Type) {
  // Filter data by the selected RunID
  
  let filteredData = data.filter((item) => item.Type===Type && item.Status ==="FAIL");

results = filteredData
  // HTML structure for the table
  console.log(data,Type,filteredData)
  if(filteredData.length===0){
    downloadResultsBtn = document.getElementById("downloadResultsBtn")
    downloadResultsBtn.style.display = 'none';

    tableHtml = '<p>No Failure results to display</p>';
    document.getElementById("tableContainer").innerHTML = tableHtml;
  }else{
    downloadResultsBtn = document.getElementById("downloadResultsBtn")
    downloadResultsBtn.style.display = 'block';
    let tableHtml = `
    <table id="runTable" style="width: 100%; border-collapse: collapse; border: 1px solid black;">
        <thead>
            <tr>
                <th style="background-color:#152c5e;color:white;padding:6px">RunID</th>
                <th style="background-color:#152c5e;color:white;padding:6px">Page</th>
                <th style="background-color:#152c5e;color:white;padding:6px">Expected</th>
                <th style="background-color:#152c5e;color:white;padding:6px" >Actual</th>
                <th style="background-color:#152c5e;color:white;padding:6px" >Difference</th>
            </tr>
        </thead>
        <tbody>
`;

// Function to truncate long strings
function truncateText(text, maxLength = 70) {
return text.length > maxLength
  ? text.substring(0, maxLength) + "..."
  : text;
}

// Populate the table rows
filteredData.forEach((item, index) => {
tableHtml += `
        <tr data-index="${index}" style="border: 1px solid black; padding: 10px;">
            <td style="padding:5px;">${item.RunID}</td>
            <td style="padding:5px;">${item.Page}</td>
            <td style="padding:5px;">${truncateText(item.Source_Data)}</td>
            <td style="padding:5px;">${truncateText(item.Target_Data)}</td>
            <td style="padding:5px;">${truncateText(item.Difference_Data)}</td>
        </tr>
    `;
});

// Close the table HTML
tableHtml += `
        </tbody>
    </table>
`;

// Insert the table into a container on your page
document.getElementById("tableContainer").innerHTML = tableHtml;

// Add event listeners to each row for showing full details in a popup
document.querySelectorAll("#runTable tbody tr").forEach(function (row) {
row.addEventListener("click", function () {
  const index = this.getAttribute("data-index");
  const item = filteredData[index];

  // Open a popup window with full details if any content is long
  const isContentLong =
    item.Source_Data.length > 30 ||
    item.Target_Data.length > 30 ||
    item.Difference_Data.length > 30;

  
    const popupHtml = `
                <html>
                <head>
                    <title>RunID: ${item.RunID}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                        }
                        th, td {
                            padding: 10px;
                            border: 1px solid black;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Details for RunID: ${item.RunID}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>RunID</th>
                                <th>Page</th>
                                <th>Expected</th>
                                <th>Actual</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${item.RunID}</td>
                                <td>${item.Page}</td>
                                <td>${item.Source_Data}</td>
                                <td>${item.Target_Data}</td>
                                <td>${item.Difference_Data}</td>
                            </tr>
                        </tbody>
                    </table>
                </body>
                </html>
            `;

    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popupWindow = window.open(
      "",
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`
    );
    popupWindow.document.write(popupHtml);
    popupWindow.document.close();
  
});
});
  }

}

function changeColor(link) {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((navLink) => {
    navLink.style.color = "black"; // Reset all links to black
  });

  link.style.color = "red"; // Change the color of the clicked link to red
}

function openReport() {
  // Opens the report in a new window
  window.open("http://localhost:8082/show_report", "_blank", "width=800,height=600");
}