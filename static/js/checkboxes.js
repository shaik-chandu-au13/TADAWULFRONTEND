function checkboxesSelection()
{
    // Get references to the module-level checkbox and submodules
    const mainMarketCheckbox = document.getElementById("mainMarketCheckbox");
    const mainMarketSubmodules = document.querySelectorAll(".submodule-checkbox.mainMarket-submodule");

    const OurMarketsCheckbox = document.getElementById("OurMarketsCheckbox");
    const OurMarketsSubmodule = document.querySelectorAll(".submodule-checkbox.OurMarkets-submodule");

    const marketNewsCheckbox = document.getElementById("marketNewsCheckbox");
    const marketNewsSubmodule = document.querySelectorAll(".submodule-checkbox.marketNews-submodule");

    const issuerFinancialCheckbox = document.getElementById("issuerFinancialCheckbox");
    const issuerFinancialSubmodule = document.querySelectorAll(".submodule-checkbox.issuerFinancial-submodule");

    const reportsCheckbox = document.getElementById("reportsCheckbox");
    const reportsCheckboxSubmodule = document.querySelectorAll(".submodule-checkbox.reportsCheckbox-submodule");

    const SukukCheckbox = document.getElementById("SukukCheckbox");
    const SuhukSubmodules = document.querySelectorAll(".submodule-checkbox.Sukuk-submodule");

    const runButton = document.getElementById("modalButton");

    // Add an event listener to the module-level checkbox
    OurMarketsCheckbox.addEventListener("change", function () {
        // When the module-level checkbox is checked, enable all submodules
        OurMarketsSubmodule.forEach((submodule) => {
            submodule.checked = OurMarketsCheckbox.checked;
        });

        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "OurMarkets"
            if (OurMarketsCheckbox.checked) {
                runAutomationPack('OurMarkets');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    marketNewsCheckbox.addEventListener("change", function () {
        // When the module-level checkbox is checked, enable all submodules
        marketNewsSubmodule.forEach((submodule) => {
            submodule.checked = marketNewsCheckbox.checked;
        });

        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "marketNews"
            if (marketNewsCheckbox.checked) {
                runAutomationPack('marketNews');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    mainMarketCheckbox.addEventListener("change", function () {
        // When the module-level checkbox is checked, enable all submodules
        mainMarketSubmodules.forEach((submodule) => {
            submodule.checked = mainMarketCheckbox.checked;
        });

        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "Main Market"
            if (mainMarketCheckbox.checked) {
                runAutomationPack('mainMarket');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    SukukCheckbox.addEventListener("change", function () {
        // When the module-level checkbox is checked, enable all submodules
        SuhukSubmodules.forEach((submodule) => {
            submodule.checked = SukukCheckbox.checked;
        });

        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "Sukuk/Bonds"
            if (SukukCheckbox.checked) {
                runAutomationPack('Sukuk');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    issuerFinancialCheckbox.addEventListener("change", function () {
        // When the module-level checkbox is checked, enable all submodules
        issuerFinancialSubmodule.forEach((submodule) => {
            submodule.checked = issuerFinancialCheckbox.checked;
        });

        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "issuerFinancial"
            if (issuerFinancialCheckbox.checked) {
                runAutomationPack('issuerFinancial');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    reportsCheckbox.addEventListener("change", function () {
        // When the module-level checkbox is checked, enable all submodules
        reportsCheckboxSubmodule.forEach((submodule) => {
            submodule.checked = reportsCheckbox.checked;
        });

        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "reports"
            if (reportsCheckbox.checked) {
                runAutomationPack('reports');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });



                //Run Automation Pack

    // Add an event listener to the module-level checkbox
    homePageCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // When the button is clicked, check the module-level checkbox
            if (homePageCheckbox.checked) {
                runAutomationPack('home page');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    homePageEdgeCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // When the button is clicked, check the module-level checkbox
            if (homePageEdgeCheckbox.checked) {
                runAutomationPack('home page edge');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });


    // Add an event listener to the module-level checkbox
    IssFinCheckboxMobile.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // When the button is clicked, check the module-level checkbox
            if (IssFinCheckboxMobile.checked) {
                runAutomationPack('IssFinMobile');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    marketPerformanceCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // If the module-level checkbox is checked, run the automation pack for "Main Market"
            if (marketPerformanceCheckbox.checked) {
                runAutomationPack('market performance');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    UnlistedCorporateCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            if (UnlistedCorporateCheckbox.checked) {
                runAutomationPack('UnlistedCorporateSukuk');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    IssFinCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // When the button is clicked, check the module-level checkbox
            if (IssFinCheckbox.checked) {
                runAutomationPack('IssFinancialAdvisor');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    memberTradingReportCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // When the button is clicked, check the module-level checkbox
            if (memberTradingReportCheckbox.checked) {
                runAutomationPack('memberTradingReport');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

    // Add an event listener to the module-level checkbox
    marketReportsCheckbox.addEventListener("change", function () {
        runButton.addEventListener("click", function () {
            // When the button is clicked, check the module-level checkbox
            if (marketReportsCheckbox.checked) {
                runAutomationPack('marketReports');
                closeModal();
            }
            else {
                closeModal();
            }
        });
    });

}

// Call the function when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
    checkboxesSelection();
});