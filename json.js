function jsonData() {
    fetch('output.json')
    .then((response) => response.json())
    .then((data) => {
        if (data && data[0] && data[0].ActualOutputLive) {
            const pagesValue = data[0].ActualOutputLive;
            const expectoutput = data[0].ExpectedOutputUAT;
            const get = document.getElementById('td-1-1');
            document.getElementById('td-1-1').innerHTML = pagesValue;
            document.getElementById('td-2-1').innerHTML = expectoutput;
            const count = pagesValue - expectoutput;
            document.getElementById('td-3-1').innerHTML = count;
            console.log(pagesValue);
        } 
        else {
            console.log("Pages property is missing in the first object or the object is undefined.");
        }
        if(data && data[1] && data[1].ActualOutputLive) {
            const pagesValue2 = data[1].ActualOutputLive;
            const pagesValue3 = data[1].ExpectedOutputUAT;
            const get1 = document.getElementById('td-7-1');
            document.getElementById('td-7-1').innerHTML = pagesValue2;
            document.getElementById('td-8-1').innerHTML = pagesValue3;
            const pagesValue4 = pagesValue2 - pagesValue3;
            document.getElementById('td-9-1').innerHTML = pagesValue4
            console.log(pagesValue4);
        }
    })
    .catch((error) => {
             console.error('An error occurred while fetching or parsing the JSON file:', error);
    });
}    
