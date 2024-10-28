function setupLanguageForm() {
    // Get references to the language form and elements
    const languageForm = document.getElementById("languageForm");
    const selectedLanguage = document.getElementById("selectedLanguage");

    // Add an event listener to the language form
    languageForm.addEventListener("change", function (event) {
        if (event.target && event.target.type === "radio" && event.target.checked) {
            // Update the selected language content
            selectedLanguage.textContent = "Language: " + event.target.value;
        }
    });
}


function setupDeviceFormListeners() {
    // Get references to the forms and elements by id
    const desktopChromeForm = document.getElementsByClassName("desktop-chrome")[0];
    const desktopEdgeForm = document.getElementsByClassName("desktop-edge")[0];
    const mobileChromeForm = document.getElementsByClassName("mobile")[0];

    const selectedDevice = document.getElementById("selectedDevice");

    // Add event listeners to the forms
    desktopChromeForm.addEventListener("change", function (event) {
        updateSelectedDevice(event, "Desktop Chrome");
    });

    desktopEdgeForm.addEventListener("change", function (event) {
        updateSelectedDevice(event, "Desktop Edge");
    });

    mobileChromeForm.addEventListener("change", function (event) {
        updateSelectedDevice(event, "Mobile Chrome");
    });
}

// Function to update the selected device content
function updateSelectedDevice(event, deviceName) {
    if (event.target && event.target.type === "radio" && event.target.checked) {
        selectedDevice.textContent = "Device: " + deviceName;
    }
}

// Call the function when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
    setupLanguageForm();
    setupDeviceFormListeners();
});