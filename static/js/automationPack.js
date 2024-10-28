function runAutomationPack(modulename) {

    if(modulename == 'home page') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    else if(modulename == 'home page edge') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }  

    else if(modulename == 'IssFinMobile') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }   

    else if(modulename == 'marketPerformance') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    } 

    else if(modulename == 'UnlistedCorporateSukuk') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    } 

    else if(modulename == 'IssFinancialAdvisor') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    else if(modulename == 'memberTradingReport') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    else if(modulename == 'marketReports') {
        fetch(`/run-java?modulename=${modulename}`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}