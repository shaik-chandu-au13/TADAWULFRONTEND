let pageData = null;

document.addEventListener('DOMContentLoaded', function () {
    fetch('./thisJSONcreatesHomepage.json')
        .then(response => response.json())
        .then(data => {
            pageData = data; // Store the JSON data in pageData
            console.log(pageData); // Use the pageData variable

            const tableBody = document.querySelector('#dynamicTable tbody');
            const selectAllCheckbox = document.querySelector('#selectAll');

            function createRow(page, menu = '', submenu = '', className = '', rowType = '') {
                const row = document.createElement('tr');
                row.className = rowType; // Assign class for row type (menu, submenu)

                const pageCell = document.createElement('td');
                const menuCell = document.createElement('td');
                const submenuCell = document.createElement('td');
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');

                checkbox.type = 'checkbox';
                checkbox.className = className; // Assign the class to checkbox for group selection

                // Replace underscores with spaces when displaying
                if (rowType === 'page-row') {
                    const expandCollapse = document.createElement('span');
                    expandCollapse.textContent = '[-]'; // Default to expanded state
                    expandCollapse.className = 'expand-collapse';

                    pageCell.appendChild(expandCollapse);
                    pageCell.appendChild(document.createTextNode(page.replace(/_/g, ' '))); // Replace underscores with spaces

                    expandCollapse.addEventListener('click', function () {
                        const menuRows = document.querySelectorAll(`.menu-row-${page}`);
                        const isCollapsed = menuRows[0].style.display === 'none';

                        menuRows.forEach(menuRow => {
                            menuRow.style.display = isCollapsed ? 'table-row' : 'none';
                            const submenuRows = document.querySelectorAll(`.submenu-row.menu-row-${page}`);
                            submenuRows.forEach(subRow => subRow.style.display = isCollapsed ? 'table-row' : 'none');
                        });

                        expandCollapse.textContent = isCollapsed ? '[-]' : '[+]';
                    });

                } else if (rowType.startsWith('menu-row')) {
                    const expandCollapse = document.createElement('span');
                    expandCollapse.textContent = '[-]'; // Default to expanded state
                    expandCollapse.className = 'expand-collapse';

                    menuCell.appendChild(expandCollapse);
                    menuCell.appendChild(document.createTextNode(menu.replace(/_/g, ' ')));

                    expandCollapse.addEventListener('click', function () {
                        const submenuRows = document.querySelectorAll(`.submenu-row.menu-row-${menu.replace(/ /g, '_')}`);
                        const isCollapsed = submenuRows[0].style.display === 'none';

                        submenuRows.forEach(row => row.style.display = isCollapsed ? 'table-row' : 'none');
                        expandCollapse.textContent = isCollapsed ? '[-]' : '[+]';
                    });
                } else {
                    pageCell.textContent = page.replace(/_/g, ' ');
                }

                menuCell.style.fontWeight = 'bold';
                submenuCell.textContent = submenu.replace(/_/g, ' ');
                pageCell.style.fontWeight = 'bold';

                checkboxCell.appendChild(checkbox);
                row.appendChild(pageCell);
                row.appendChild(menuCell);
                row.appendChild(submenuCell);
                row.appendChild(checkboxCell);

                tableBody.appendChild(row);
                return checkbox;
            }

            Object.keys(pageData).forEach(page => {
                const pageCheckbox = createRow(page, '', '', `page-checkbox-${page}`, 'page-row');

                pageCheckbox.addEventListener('change', function () {
                    const relatedCheckboxes = document.querySelectorAll(`.page-checkbox-${page}, .menu-checkbox-${page}, .submenu-checkbox-${page}`);
                    relatedCheckboxes.forEach(cb => cb.checked = this.checked);
                    updateSelectAllCheckbox(); // Update "Select All" checkbox state
                });

                Object.keys(pageData[page]).forEach(menu => {
                    const menuCheckbox = createRow('', menu, '', `menu-checkbox-${page}`, `menu-row menu-row-${page}`);

                    menuCheckbox.addEventListener('change', function () {
                        const submenuCheckboxes = document.querySelectorAll(`.submenu-checkbox-${menu}`);
                        submenuCheckboxes.forEach(cb => cb.checked = this.checked);
                        updatePageCheckbox(page); // Update page checkbox state
                        updateSelectAllCheckbox(); // Update "Select All" checkbox state
                    });

                    if (pageData[page][menu].length > 0) {
                        pageData[page][menu].forEach(submenu => {
                            const submenuCheckbox = createRow('', '', submenu, `submenu-checkbox-${menu} submenu-checkbox-${page}`, `submenu-row menu-row-${page} menu-row-${menu.replace(/ /g, '_')}`);
                            submenuCheckbox.addEventListener('change', function () {
                                updatePageCheckbox(page); // Update page checkbox state
                                updateSelectAllCheckbox(); // Update "Select All" checkbox state
                            });
                        });
                    }
                });
            });

            // Add the "Select All" functionality
            selectAllCheckbox.addEventListener('change', function () {
                const allCheckboxes = document.querySelectorAll('#dynamicTable tbody input[type="checkbox"]');
                allCheckboxes.forEach(cb => cb.checked = this.checked);
            });

            // Function to update "Select All" checkbox based on individual checkbox state
            function updateSelectAllCheckbox() {
                const allCheckboxes = document.querySelectorAll('#dynamicTable tbody input[type="checkbox"]');
                const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            }

            // Function to update page checkbox state based on menu and submenu checkbox state
            function updatePageCheckbox(page) {
                const relatedCheckboxes = document.querySelectorAll(`.menu-checkbox-${page}, .submenu-checkbox-${page}`);
                const allChecked = Array.from(relatedCheckboxes).every(cb => cb.checked);
                const pageCheckbox = document.querySelector(`.page-checkbox-${page}`);
                pageCheckbox.checked = allChecked;

                // Also update "Select All" checkbox if any menu or submenu is unchecked
                if (!allChecked) {
                    selectAllCheckbox.checked = false;
                }
            }
        })
        .catch(error => console.error('Error loading JSON:', error));
});




document.addEventListener('DOMContentLoaded', function () {
    const platformSelect = document.getElementById('platformSelect');
    const deviceNameDiv = document.getElementById('deviceNameSelect').parentElement.parentElement; // Get the parent div of the select
    const deviceIdDiv = document.getElementById('deviceIdSelect').parentElement.parentElement; // Get the parent div of the select

    function toggleDeviceFields() {
        if (platformSelect.value === 'Web') {
            deviceNameDiv.style.display = 'none';
            deviceIdDiv.style.display = 'none';
        } else {
            deviceNameDiv.style.display = 'flex';
            deviceIdDiv.style.display = 'flex';
        }
    }

    // Initial check
    toggleDeviceFields();

    // Add event listener to the platform select
    platformSelect.addEventListener('change', toggleDeviceFields);
});

// function openModal() {
//     var modal = document.getElementById("modal");
//     modal.style.display = "block";
//     var button = document.getElementById("button");
//     button.classList.add("selected");
// }

// function closeModal() {
//     var modal = document.getElementById("modal");
//     modal.style.display = "none";
//     var button = document.getElementById("button");
//     button.classList.remove("selected");
// }
function openModal() {
    var modal = document.getElementById("modal");
    modal.classList.add("show");
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.classList.remove("show");
}
// function openModal() {
//     document.getElementById('modal').style.display = 'block';
// }

// function closeModal() {
//     document.getElementById('modal').style.display = 'none';
// }

// const pageData = {
//     "Our_Markets": {
//         "Main_Market": [
//             "Main_Market_Watch",
//             "Opening/Closing_Prices",
//             "Market_Performance",
//             "Indices_Performance",
//             "Issuers_Trading_Information"
//         ],
//         "Nomu-Parallel_Market": [
//             "Nomu-Parallel_Market",
//             "Opening/Closing_Prices",
//             "Market_Performance",
//             "Indices_Performance",
//             "Issuers_Trading_Information"
//         ],
//         "Derivatives": [
//             "Derivative_Market_Watch",
//             "Products",
//             "Market_Performance",
//             "Trading_Calendar",
//             "Negotiated_Deals"
//         ],
//         "Sukuk/Bonds": [
//             "Sukuk/Bond_Market_Watch",
//             "Indices_Performance",
//             "Unlisted_Government_Sukuk/Bonds",
//             "Unlisted_Corporate_Sukuk/Bonds",
//             "Negotiated_Deals"
//         ],
//         "Funds": [
//             "Funds_Market_Watch",
//             "REITS",
//             "ETFS",
//             "CEFS",
//             "Mutual_Funds",
//             "Negotiated_Deals"
//         ]
//     },
//     "Listing": {
//         "Become_an_Issuer": [
//             "Listing_Incentives",
//             "Listing_Readiness_Assessment",
//             "Listing/Offering_Rules",
//             "Listing_Documents_and_Resources",
//             "Company_In_Focus",
//             "Meeting_Request"
//         ],
//         "Issuer_Guides": [
//             "Investor_Relations_Lab",
//             "Contact_Information_for_Investors_Relations_Officers",
//             "ESG_Guidelines"
//         ],
//         "Upcoming_Listings": []
//     },
//     "Trading": {
//         "Investing_and_Trading": [
//             "Become_an_Investor",
//             "Qualified_Foreign_Investors"
//         ],
//         "Participants": [
//             "Issuer_Directory",
//             "Members_Directory",
//             "Information_Provider_Directory",
//             "Become_a_Member",
//             "Become_an_Information_Provider"
//         ],
//         "Market_Services": [
//             "Equities",
//             "Sukuk_and_Bonds",
//             "Derivatives",
//             "Funds",
//             "Market_Information_Services",
//             "Market_Data",
//             "Indices_Data",
//             "eReference_Data"
//         ],
//         "Invest_Wisely": [
//             "Learn",
//             "Engage",
//             "Practice",
//             "Compete"
//         ],
//         "Saudi_200": []
//     },
//     "Market_News_and_Reports": {
//         "Issuer_News": [],
//         "Issuer_and_Financial_Advisor_Announcements": [],
//         "Issuer_Financial_Calendars": [
//             "Dividends",
//             "General_Assembly_Meetings",
//             "Board_of_Directors_Sessions",
//             "Corporate_Actions"
//         ],
//         "Issuer_Stock_Screener": [],
//         "Mutual_Fund_Screener": [],
//         "Reports_and_Publications": [
//             "Market_Reports",
//             "Historical_Reports",
//             "Foreign_Ownership",
//             "Member_Trading_Reports"
//         ]
//     },
//     "Rules_And_Guidance": {
//         "Capital_Market_Overview": [
//             "Equities",
//             "Sukuk_and_Bonds",
//             "Derivatives",
//             "Funds",
//             "Tradable_Rights",
//             "Industry_Classification",
//             "Trading_Cycle_and_Times",
//             "Closing_Auction_and_Trade-at-Last",
//             "Restriction_Periods_and_Financials_Deadlines"
//         ],
//         "Indices": [
//             "Index_Calculation_Methodology",
//             "MSCI_TADAWUL_30_Index",
//             "iBoxx_Tadawul_SAR_Government_Sukuk_and_Bond_Indices"
//         ],
//         "Fees": [],
//         "Market_Rules_and_Forms": [
//             "Capital_Market_Law",
//             "Exchange_and_Centre_Rules_and_Regulations",
//             "Bylaws",
//             "Disclosure_Forms"
//         ],
//         "FAQs": []
//     },
//     "About_Saudi_Exchange": {
//         "About_Us": [
//             "Saudi_Exchange",
//             "Annual_Reports",
//             "Strategy_Vision_and_Mission",
//             "Management_Team",
//             "Careers"
//         ],
//         "Exchange_Media_Centre": [
//             "Saudi_Exchange_Press_Releases",
//             "Saudi_Exchange_Holiday_Calendar",
//             "Saudi_Exchange_Events",
//             "Saudi_Exchange_Brand_guidelines",
//             "Multimedia"
//         ],
//         "Saudi_Capital_Market_Awards": [
//             "Best_Investor_Relations_Program_Award",
//             "Most_Notable_Listing_Award",
//             "Best_Broker_Award",
//             "Best_Custodian_Award"
//         ],
//         "Contact_Us": []
//     }
// }

