let pageData = null;

document.addEventListener('DOMContentLoaded', function () {
    fetch('./thisJSONcreatesHomepage.json')
        .then(response => response.json())
        .then(data => {
            pageData = data;
            const tableBody = document.querySelector('#dynamicTable tbody');
            const selectAllCheckbox = document.querySelector('#selectAll');

            // Utility function to sanitize strings for use as CSS selectors
            function sanitizeSelector(name) {
                return name.replace(/[^a-zA-Z0-9-_]/g, '_');
            }

            function createRow(page, menu = '', submenu = '', className = '', rowType = '') {
                const row = document.createElement('tr');
                row.className = rowType;

                const pageCell = document.createElement('td');
                const menuCell = document.createElement('td');
                const submenuCell = document.createElement('td');
                const checkboxCell = document.createElement('td');
                checkboxCell.style.textAlign = 'center';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = className;

                if (rowType === 'page-row') {
                    const expandCollapse = document.createElement('span');
                    expandCollapse.textContent = '[-]';
                    expandCollapse.className = 'expand-collapse';
                    pageCell.appendChild(expandCollapse);
                    pageCell.appendChild(document.createTextNode(page.replace(/_/g, ' ')));

                    expandCollapse.addEventListener('click', function () {
                        const sanitizedPage = sanitizeSelector(page);
                        const menuRows = document.querySelectorAll(`.menu-row-${sanitizedPage}`);
                        const isCollapsed = menuRows[0].style.display === 'none';

                        menuRows.forEach(menuRow => {
                            menuRow.style.display = isCollapsed ? 'table-row' : 'none';
                            const submenuRows = document.querySelectorAll(`.submenu-row.menu-row-${sanitizedPage}`);
                            submenuRows.forEach(subRow => subRow.style.display = isCollapsed ? 'table-row' : 'none');
                        });

                        expandCollapse.textContent = isCollapsed ? '[-]' : '[+]';
                    });

                } else if (rowType.startsWith('menu-row')) {
                    const expandCollapse = document.createElement('span');
                    expandCollapse.textContent = '[-]';
                    expandCollapse.className = 'expand-collapse';

                    menuCell.appendChild(expandCollapse);
                    menuCell.appendChild(document.createTextNode(menu.replace(/_/g, ' ')));

                    expandCollapse.addEventListener('click', function () {
                        const sanitizedMenu = sanitizeSelector(menu);
                        const submenuRows = document.querySelectorAll(`.submenu-row.menu-row-${sanitizedMenu}`);
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
                const sanitizedPage = sanitizeSelector(page);
                const pageCheckbox = createRow(page, '', '', `page-checkbox-${sanitizedPage}`, 'page-row');

                pageCheckbox.addEventListener('change', function () {
                    const relatedCheckboxes = document.querySelectorAll(`.page-checkbox-${sanitizedPage}, .menu-checkbox-${sanitizedPage}, .submenu-checkbox-${sanitizedPage}`);
                    relatedCheckboxes.forEach(cb => cb.checked = this.checked);
                    updateSelectAllCheckbox();
                });

                Object.keys(pageData[page]).forEach(menu => {
                    const sanitizedMenu = sanitizeSelector(menu);
                    const menuCheckbox = createRow('', menu, '', `menu-checkbox-${sanitizedPage}`, `menu-row menu-row-${sanitizedPage}`);

                    menuCheckbox.addEventListener('change', function () {
                        const submenuCheckboxes = document.querySelectorAll(`.submenu-checkbox-${sanitizedMenu}`);
                        submenuCheckboxes.forEach(cb => cb.checked = this.checked);
                        updatePageCheckbox(sanitizedPage);
                        updateSelectAllCheckbox();
                    });

                    if (pageData[page][menu].length > 0) {
                        pageData[page][menu].forEach(submenu => {
                            const submenuCheckbox = createRow('', '', submenu, `submenu-checkbox-${sanitizedMenu} submenu-checkbox-${sanitizedPage}`, `submenu-row menu-row-${sanitizedPage} menu-row-${sanitizedMenu}`);
                            submenuCheckbox.addEventListener('change', function () {
                                updatePageCheckbox(sanitizedPage);
                                updateSelectAllCheckbox();
                            });
                        });
                    }
                });
            });

            selectAllCheckbox.addEventListener('change', function () {
                const allCheckboxes = document.querySelectorAll('#dynamicTable tbody input[type="checkbox"]');
                allCheckboxes.forEach(cb => cb.checked = this.checked);
            });

            function updateSelectAllCheckbox() {
                const allCheckboxes = document.querySelectorAll('#dynamicTable tbody input[type="checkbox"]');
                const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            }

            function updatePageCheckbox(sanitizedPage) {
                const relatedCheckboxes = document.querySelectorAll(`.menu-checkbox-${sanitizedPage}, .submenu-checkbox-${sanitizedPage}`);
                const allChecked = Array.from(relatedCheckboxes).every(cb => cb.checked);
                const pageCheckbox = document.querySelector(`.page-checkbox-${sanitizedPage}`);
                pageCheckbox.checked = allChecked;

                if (!allChecked) {
                    selectAllCheckbox.checked = false;
                }
            }

            // Expand/Collapse All Pages and Menus
            const toggleAllPagesButton = document.getElementById('toggleAllPages');
            const toggleAllMenusButton = document.getElementById('toggleAllMenus');
            
            let allPagesCollapsed = false; // For toggling menus and submenus across all pages
            let allMenusCollapsed = false; // For toggling submenus only
            
            // Function to sanitize class name to avoid selector issues
            function sanitizeSelector(selector) {
                return selector.replace(/[^\w-]/g, '_');
            }
            function toggleAllPages() {
                // Get all menu rows (across all pages) and submenu rows (across all menus)
                const menuRows = document.querySelectorAll('.menu-row');
                const submenuRows = document.querySelectorAll('.submenu-row');
            
                // Toggle the visibility of all menu and submenu rows
                menuRows.forEach(menuRow => {
                    menuRow.style.display = allPagesCollapsed ? 'table-row' : 'none';
                });
            
                submenuRows.forEach(submenuRow => {
                    submenuRow.style.display = allPagesCollapsed ? 'table-row' : 'none';
                });
                // Update collapse state for pages and change button text accordingly
                
                allPagesCollapsed = !allPagesCollapsed;
                toggleAllPagesButton.textContent = allPagesCollapsed ? '▽' : '△';
                if(allPagesCollapsed){
                    allMenusCollapsed = !allMenusCollapsed;

                    toggleAllMenus(true)
                }else{

                }
                console.log(allPagesCollapsed,allMenusCollapsed)


            }
            toggleAllPagesButton.addEventListener('click',toggleAllPages );
            
            function toggleAllMenus(option) {
                // Select only submenu rows
                const submenuRows = document.querySelectorAll('.submenu-row');

                if(option===true){
                    submenuRows.forEach(submenuRow => {
                        submenuRow.style.display = !option ? 'table-row' : 'none';
                    });
                    toggleAllMenusButton.textContent = option ? '▽' : '△';

                }else{
                    submenuRows.forEach(submenuRow => {
                        submenuRow.style.display = allMenusCollapsed ? 'table-row' : 'none';
                    });
                    allMenusCollapsed = !allMenusCollapsed;
                    toggleAllMenusButton.textContent = allMenusCollapsed ? '▽' : '△';

                }
            
                // Toggle the display state of each submenu row

                
                // Update collapse state and button text for submenus
                // console.log(allPagesCollapsed, allMenusCollapsed);
            }
            
            // Attach to click event
            toggleAllMenusButton.addEventListener('click', toggleAllMenus);
        })
        .catch(error => console.error('Error loading JSON:', error));
});






document.addEventListener('DOMContentLoaded', function () {
    const platformSelect = document.getElementById('platformSelect');
    const deviceNameSelect = document.getElementById('deviceNameSelect');
    const mobileModelSelect = document.getElementById('mobileModelSelect');
    const mobileOSVersionSelect = document.getElementById('mobileOSVersionSelect');
    const mobileIDSelect = document.getElementById('mobileIDSelect');
    const mobileIDDiv = document.getElementById('mobileIDDiv');
    const mobileOSVersionDiv = document.getElementById('mobileOSVersionDiv');
    const mobileModelDiv = document.getElementById('mobileModelDiv');
    const deviceNameDiv = document.getElementById('deviceNameDiv');


    let mobileData = {};

    // Load JSON data
    fetch('mobileData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            mobileData = data.mobileOptions;
            populateDeviceNames(); // Populate device names on load
        })
        .catch(error => console.error('Error loading mobile data:', error));

    function populateDeviceNames() {
        // Clear existing options
        deviceNameSelect.innerHTML = '';

        // Add default option
        const defaultOSOption = document.createElement('option');
        defaultOSOption.textContent = "Select Mobile OS";
        defaultOSOption.value = ""; // No value for the default option
        defaultOSOption.disabled = true;
        defaultOSOption.selected = true;
        deviceNameSelect.appendChild(defaultOSOption);

        // Add options from JSON data
        Object.keys(mobileData).forEach(os => {
            const option = document.createElement('option');
            option.value = os;
            option.textContent = os;
            deviceNameSelect.appendChild(option);
        });
    }

    function updateMobileOptions() {
        const selectedOS = deviceNameSelect.value;

        // Clear existing options
        clearMobileOptions();

        // Check if platform is not Web
        if (platformSelect.value !== 'web') {
            // Populate Mobile Model options from JSON
            if (mobileData[selectedOS]) {
                // Add default option for mobile models
                const defaultModelOption = document.createElement('option');
                defaultModelOption.textContent = "Select Mobile Model";
                defaultModelOption.value = ""; // No value for the default option
                defaultModelOption.disabled = true;
                defaultModelOption.selected = true;
                mobileModelSelect.appendChild(defaultModelOption);

                mobileData[selectedOS].models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    mobileModelSelect.appendChild(option);
                });

                // Populate Mobile OS Version options from JSON
                const defaultVersionOption = document.createElement('option');
                defaultVersionOption.textContent = "Select Mobile OS Version";
                defaultVersionOption.value = ""; // No value for the default option
                defaultVersionOption.disabled = true;
                defaultVersionOption.selected = true;
                mobileOSVersionSelect.appendChild(defaultVersionOption);

                mobileData[selectedOS].versions.forEach(version => {
                    const option = document.createElement('option');
                    option.value = version;
                    option.textContent = version;
                    mobileOSVersionSelect.appendChild(option);
                });
            }

            // Enable the model and version selects
            mobileModelSelect.disabled = false;
            mobileOSVersionSelect.disabled = false;
        } else {
            // Disable model and version selects if platform is Web
            mobileModelSelect.disabled = true;
            mobileOSVersionSelect.disabled = true;
        }
    }

    function clearMobileOptions() {
        mobileModelSelect.innerHTML = ''; // Clear mobile model options
        mobileOSVersionSelect.innerHTML = ''; // Clear mobile OS version options
        mobileIDSelect.value = ''; // Clear Mobile ID
        mobileModelSelect.disabled = true; // Disable model select
        mobileOSVersionSelect.disabled = true; // Disable version select
    }

    function toggleDeviceFields() {
        if (platformSelect.value === 'web') {

            clearMobileOptions();
            deviceNameSelect.value = ""; // Reset OS selection
            deviceNameSelect.disabled = true; // Disable OS select
            mobileIDDiv.style.display = 'none';
            mobileOSVersionDiv.style.display = 'none';
            mobileModelDiv.style.display = 'none';
            deviceNameDiv.style.display = 'none';
        } else {
            mobileIDDiv.style.display = 'block';
            mobileOSVersionDiv.style.display = 'block';
            mobileModelDiv.style.display = 'block';
            deviceNameDiv.style.display = 'block';
            deviceNameSelect.disabled = false; // Enable OS select
        }
    }

    // Event listeners
    platformSelect.addEventListener('change', toggleDeviceFields); // Hide/show fields based on platform selection
    deviceNameSelect.addEventListener('change', updateMobileOptions); // Update options when OS changes
    mobileModelSelect.addEventListener('change', updateMobileID);
    mobileOSVersionSelect.addEventListener('change', updateMobileID);

    function updateMobileID() {
        const os = deviceNameSelect.value;
        const model = mobileModelSelect.value;
        const version = mobileOSVersionSelect.value;

        if (os && model && version) {
            mobileIDSelect.value = `${os}_${model}_${version}`; // Generate unique Mobile ID
        } else {
            mobileIDSelect.value = ''; // Clear Mobile ID if any field is empty
        }
    }

    // Initial call to set up field states
    toggleDeviceFields();
});



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("runButton").addEventListener("click", function () {
        // #Platform - web, mobile
        // platform=web
        // #Mobile OS - android, ios
        // mobileos=android
        // #Mobile device id
        // devicename=f795acd7
        // #Languages - english, arabic
        // language=english
        // #browsers - edge, chrome, firefox, safari
        // browser=chrome
        // #sources - prod, uat, qa, dev
        // source.env=prod
        // target.env=uat
        // #Base URLs
        // prod.baseurl=https://www.saudiexchange.sa
        // uat.baseurl=https://www.saudiexchange.sa
        // #URLs - English
        // prod.url.en=https://www.saudiexchange.sa/wps/portal/saudiexchange?locale=en
        // uat.url.en=https://www.saudiexchange.sa/wps/portal/saudiexchange?locale=en
        // #URLs - Arabic
        // prod.url.ar=https://www.saudiexchange.sa/wps/portal/saudiexchange?locale=ar
        // uat.url.ar=https://www.saudiexchange.sa/wps/portal/saudiexchange?locale=ar
        // let mainString =` mvn clean install -Dplatform=${platform} -Dbrowser=${browser} -Dlanguage=${language} -Dcucumber.filter.tags="@feedback"`
        const language = document.querySelector('input[name="languageOptions"]:checked').value;

        // Capture the selected browser and platform
        const browser = document.getElementById('browserSelect').value;
        const platform = document.getElementById('platformSelect').value;
    
        // Mobile OS, Model, OS Version, and ID
        const mobileOS = document.getElementById('deviceNameSelect').value;
        const mobileModel = document.getElementById('mobileModelSelect').value;
        const mobileOSVersion = document.getElementById('mobileOSVersionSelect').value;
        const mobileID = document.getElementById('mobileIDSelect').value;
    
        const sourceUrl = document.getElementById("sourceUrl").value;
        const targetUrl = document.getElementById("targetUrl").value;

        const selectedDetails = {
            language,
            browser,
            platform,
            mobileOS,
            mobileModel,
            mobileOSVersion,
            mobileID,sourceUrl,targetUrl
        };
    
        console.log('Selected Details:', selectedDetails);
      
      
        const checkedItems = [];
      let runString = "";
      const checkboxes = document.querySelectorAll(
        '#dynamicTable tbody input[type="checkbox"]:checked'
      );
  
      checkboxes.forEach((checkbox) => {
        const row = checkbox.closest("tr");
        const page = row
          .querySelector("td:nth-child(1)")
          .textContent.trim()
          .slice(3);
        const menu = row
          .querySelector("td:nth-child(2)")
          .textContent.trim()
          .slice(3);
        const submenu = row.querySelector("td:nth-child(3)").textContent.trim();
  
        checkedItems.push({ page, menu, submenu });
      });
  
      console.log(checkboxes);
      let ourMarketsSelected = false;
      let listingSelected = false;
      let tradingSelected = false;
      let marketsNewsReportsSelected = false;
      let rulesAndGuidanceSelected = false;
      let aboutSaudiSelected = false;
      checkedItems.forEach((item) => {
        if (item.page === "Home") {
          runString += " @feedback ";
        } else if (item.page === "Our Markets") {
          ourMarketsSelected = true;
          runString += " or @OurMarket";
        } else if (item.page === "Listing") {
          runString += " or @Listing";
          listingSelected = true;
        } else if (item.page === "Trading") {
          runString += " or @Trading";
          tradingSelected = true;
        } else if (item.page === "Market News and Reports") {
          runString += " or @MarketNewsandReports";
          marketsNewsReportsSelected = true;
        } else if (item.page === "Rules And Guidance") {
          runString += " or @RulesandGuidance";
          rulesAndGuidanceSelected = true;
        } else if (item.page === "About Saudi Exchange") {
          runString += " or @AboutSaudiExchange";
          aboutSaudiSelected = true;
        }
      });
      let mainMarketSelected = false;
      let nomuParallelMarketSelected = false;
      let derivativesSelected = false;
      let sukukBondsSelected = false;
      let fundsSelected = false;
      let becomeAnIssuerSelected = false;
      let issuerGuidesSelected = false;
      let upcomingListingsSelected = false;
      let investingAndTradingSelected = false;
      let participantsSelected = false;
      let marketServicesSelected = false;
      let investWiselySelected = false;
      let saudi200Selected = false;
      let issuerNewsSelected = false;
      let issuerAndFinancialAdvisorAnnouncementsSelected = false;
      let issuerFinancialCalendarsSelected = false;
      let issuerStockScreenerSelected = false;
      let mutualFundScreenerSelected = false;
      let reportsAndPublicationsSelected = false;
      let capitalMarketOverviewSelected = false;
      let indicesSelected = false;
      let feesSelected = false;
      let marketRulesAndFormsSelected = false;
      let faqsSelected = false;
      let aboutUsSelected = false;
      let exchangeMediaCentreSelected = false;
      let saudiCapitalMarketAwardsSelected = false;
      let contactUsSelected = false;
  
      checkedItems.forEach((item) => {
        if (!ourMarketsSelected) {
          if (item.menu === "Main Market") {
            runString += " or @MainMarket";
            mainMarketSelected = true;
          } else if (item.menu === "Nomu-Parallel Market") {
            runString += " or @Nomu–ParallelMarket";
            nomuParallelMarketSelected = true;
          } else if (item.menu === "Derivatives") {
            runString += " or @Derivatives_OurMarket";
            derivativesSelected = true;
          } else if (item.menu === "Sukuk/Bonds") {
            runString += " or @Sukuk/Bonds";
            sukukBondsSelected = true;
          } else if (item.menu === "Funds") {
            runString += " or @Funds";
            fundsSelected = true;
          }
        }
        if (!listingSelected) {
          if (item.menu === "Become an Issuer") {
            runString += " or @BecomeIssuer";
            becomeAnIssuerSelected = true;
          } else if (item.menu === "Issuer Guides") {
            runString += " or @IssuersGuides";
            issuerGuidesSelected = true;
          } else if (item.menu === "Upcoming Listings") {
            runString += " or @UpcomingListing";
            upcomingListingsSelected = true;
          }
        }
        if (!tradingSelected) {
          if (item.menu === "Investing and Trading") {
            runString += " or @InvestingandTrading";
            investingAndTradingSelected = true;
          } else if (item.menu === "Participants") {
            runString += " or @Participants";
            participantsSelected = true;
          } else if (item.menu === "Market Services") {
            runString += " or @MarketServices";
            marketServicesSelected = true;
          } else if (item.menu === "Invest Wisely") {
            runString += " or @InvestWisely";
            investWiselySelected = true;
          } else if (item.menu === "Saudi 200") {
            // runString+=" "
            saudi200Selected = true;
          }
        }
        if (!marketsNewsReportsSelected) {
          if (item.menu === "Issuer News") {
            runString += " or @MarketNews";
            issuerNewsSelected = true;
          } else if (item.menu === "Issuer and Financial Advisor Announcements") {
            runString += " or @IssuerFinancialAdvisorAnnouncementsPage";
            issuerAndFinancialAdvisorAnnouncementsSelected = true;
          } else if (item.menu === "Issuer Financial Calendars") {
            runString += " or @IssuerFinancialCalendars";
            issuerFinancialCalendarsSelected = true;
          } else if (item.menu === "Issuer Stock Screener") {
            runString += " or @IntroducingScreener";
            issuerStockScreenerSelected = true;
          } else if (item.menu === "Mutual Fund Screener") {
            // runString+=" "
            mutualFundScreenerSelected = true;
          } else if (item.menu === "Reports and Publications") {
            runString += " or @Reports&Publications";
            reportsAndPublicationsSelected = true;
          }
        }
        if (!rulesAndGuidanceSelected) {
          if (item.menu === "Capital Market Overview") {
            runString += " or @CapitalMarketOverview";
            capitalMarketOverviewSelected = true;
          } else if (item.menu === "Indices") {
            runString += " or @Indices";
            indicesSelected = true;
          } else if (item.menu === "Fees") {
            runString += " or @Fees";
            feesSelected = true;
          } else if (item.menu === "Market Rules and Forms") {
            runString += " or @MarketRulesAndForms";
            marketRulesAndFormsSelected = true;
          } else if (item.menu === "FAQs") {
            runString += " or @FAQs";
            faqsSelected = true;
          }
        }
        if (!aboutSaudiSelected) {
          if (item.menu === "About Us") {
            // runString+=" "
            aboutUsSelected = true;
          } else if (item.menu === "Exchange Media Centre") {
            runString += " or @ExchangeMediaCentre";
            exchangeMediaCentreSelected = true;
          } else if (item.menu === "Saudi Capital Market Awards") {
            // runString+=" "
            saudiCapitalMarketAwardsSelected = true;
          } else if (item.menu === "Contact Us") {
            // runString+=" "
            contactUsSelected = true;
          }
        }
      });
  
      checkedItems.forEach((item) => {
        if (!ourMarketsSelected && !mainMarketSelected) {
          if (item.submenu === "Main Market Watch") {
            runString += " or @MainMarketWatchPage";
          } else if (item.submenu === "Opening/Closing Prices") {
            runString += " or @MainMkt_OpeningClosingPricePage";
          } else if (item.submenu === "Market Performance") {
            runString += " or @MainMarket_MarketSummaryPage";
          } else if (item.submenu === "Indices Performance") {
            runString += " or @MainMarket_IndicesPerformancePage";
          } else if (item.submenu === "Issuers Trading Information") {
            runString += " or @MainMkt_IssuersTradingInformationPage";
          }
        }
        if (!ourMarketsSelected && !nomuParallelMarketSelected) {
          if (item.submenu === "Nomu-Parallel Market") {
            runString += " or @ParallelMarketWatchPage";
          } else if (item.submenu === "Opening/Closing Prices") {
            runString += " or @NomuOpeningClosingPricePage";
          } else if (item.submenu === "Market Performance") {
            runString += " or @NomuMarketPerformancepage";
          } else if (item.submenu === "Indices Performance") {
            runString += " or @NomuIndicesPerformancePage";
          } else if (item.submenu === "Issuers Trading Information") {
            runString += " or @NomuIssuersTradingInformationPage";
          }
        }
        if (!ourMarketsSelected && !derivativesSelected) {
          if (item.submenu === "Derivative Market Watch") {
            runString += " or @DerivativesMarketWatchTodayPage";
          } else if (item.submenu === "Products") {
            // runString+=" or @NomuOpeningClosingPricePage";
          } else if (item.submenu === "Market Performance") {
            runString += " or @Derivatives_MarketPerformancePage";
          } else if (item.submenu === "Trading Calendar") {
            runString += " or @TradingCalendarPage";
          } else if (item.submenu === "Negotiated Deals") {
            runString += " or @Derivatives_NegotiatedDealsPage";
          }
        }
        if (!ourMarketsSelected && !sukukBondsSelected) {
          if (item.submenu === "Sukuk/Bond Market Watch") {
            runString += " or @Sukuk/BondMarketWatchPage";
          } else if (item.submenu === "Indices Performance") {
            runString += " or @SukukIndicesPerformancePage";
          } else if (item.submenu === "Unlisted Government Sukuk/Bonds") {
            // runString+=" or @NomuMarketPerformancepage";
          } else if (item.submenu === "Unlisted Corporate Sukuk/Bonds") {
            runString += " or @UnlistedCorporateSukuk/BondsPage";
          } else if (item.submenu === "Negotiated Deals") {
            runString += " or @SukukNegotiatedDealsPage";
          }
        }
        if (!ourMarketsSelected && !fundsSelected) {
          if (item.submenu === "Funds Market Watch") {
            runString += " or @FundMarketWatchTodayPage";
          } else if (item.submenu === "REITS") {
            runString += " or @REITsPage";
          } else if (item.submenu === "ETFS") {
            runString += " or @ETFMarketSummaryPage or @ETFsMarketWatchPage";
          } else if (item.submenu === "CEFS") {
            runString += " or @CEFsPage";
          } else if (item.submenu === "Mutual Funds") {
            runString += " or @MutualFundsPage";
          } else if (item.submenu === "Negotiated Deals") {
            runString += " or @Funds_NegotiatedDealsPage";
          }
        }
  
        if (!listingSelected && !becomeAnIssuerSelected) {
          if (item.submenu === "Listing Incentives") {
            runString += " or @ListingIncentivesPage";
          } else if (item.submenu === "Listing Readiness Assessment") {
            runString += " or @ListingDocumentsResourcesPage";
          } else if (item.submenu === "Listing/Offering Rules") {
            runString += " or @ListingRulePage";
          } else if (item.submenu === "Listing Documents and Resources") {
            runString += " or @ListingDocumentsResourcesPage";
          } else if (item.submenu === "Company In Focus") {
            runString += " or @CompanyInFocusPage";
          } else if (item.submenu === "Meeting Request") {
            runString += " or @MeetingRequestpage";
          }
        }
  
        if (!listingSelected && !issuerGuidesSelected) {
          if (item.submenu === "Investor Relations Lab") {
            runString += " or @IssuersGuidesPage";
          } else if (
            item.submenu ===
            "Contact Information for Investors Relations Officers"
          ) {
            runString += " or @InvestorRelationsToolkitPage";
          } else if (item.submenu === "ESG Guidelines") {
            runString += " or @ESG_GuidelinesPage";
          }
        }
        if (!tradingSelected && !investingAndTradingSelected) {
          if (item.submenu === "Become an Investor") {
            runString += " or @BecomeanInvestorPage";
          } else if (item.submenu === "Qualified Foreign Investors") {
            runString += " or @QualifiedForeignInvestorsPage";
          }
        }
        if (!tradingSelected && !participantsSelected) {
          if (item.submenu === "Issuer Directory") {
            runString += " or @IssuerDirectoryPage";
          } else if (item.submenu === "Members Directory") {
            runString += " or @MemberDirectorypage";
          } else if (item.submenu === "Information Provider Directory") {
            runString += " or @InformationProviderDirectoryPage";
          } else if (item.submenu === "Become a Member") {
            runString += " or @BecomeaMemberPage";
          } else if (item.submenu === "Become an Information Provider") {
            runString += " or @BecomeanInformationProviderPage";
          }
        }
        if (!tradingSelected && !marketServicesSelected) {
          if (item.submenu === "Equities") {
            runString += " or @EquitiesPage";
          } else if (item.submenu === "Sukuk and Bonds") {
            runString += " or @SukukandBondsPage";
          } else if (item.submenu === "Derivatives") {
            runString += " or @DerivativesPage";
          } else if (item.submenu === "Funds") {
            runString += " or @FundsPage";
          } else if (item.submenu === "Market Information Services") {
            runString += " or @MarketInformationServicesPage";
          } else if (item.submenu === "Market Data") {
            runString += " or @MarketdataPage";
          } else if (item.submenu === "Indices Data") {
            runString += " or @IndicesdataPage";
          } else if (item.submenu === "eReference Data") {
            runString += " or @eReferencedataPage";
          }
        }
        if (!tradingSelected && !investWiselySelected) {
          if (item.submenu === "Learn") {
            runString += " or @LearnPage";
          } else if (item.submenu === "Engage") {
            runString += " or @EngagePage";
          } else if (item.submenu === "Practice") {
            runString += " or @PracticePage";
          } else if (item.submenu === "Compete") {
            runString += " or @CompetePage";
          }
        }
  
        if (!marketsNewsReportsSelected && !issuerFinancialCalendarsSelected) {
          if (item.submenu === "Dividends") {
            runString += " or @DividendsCalendarPage";
          } else if (item.submenu === "General Assembly Meetings") {
            runString += " or @GeneralAssemblyMeetingsPage";
          } else if (item.submenu === "Board of Directors Sessions") {
            runString += " or @BoardofDirectorsSessionsPage";
          } else if (item.submenu === "Corporate Actions") {
            runString += " or @CorporateActionsPage";
          }
        }
  
        if (!marketsNewsReportsSelected && !reportsAndPublicationsSelected) {
          if (item.submenu === "Market Reports") {
            runString += " or @MarketReportsPage";
          } else if (item.submenu === "Historical Reports") {
            runString += " or @HistoricalReportsPage";
          } else if (item.submenu === "Foreign Ownership") {
            runString += " or @ForeignOwnershipPage";
          } else if (item.submenu === "Member Trading Reports") {
            runString += " or @MemberTradingReportsPage";
          }
        }
        if (!rulesAndGuidanceSelected && !capitalMarketOverviewSelected) {
          if (item.submenu === "Equities") {
            runString += " or @NomuParallelMarket_CapitalMarketOverviewPage";
          } else if (item.submenu === "Sukuk and Bonds") {
            runString += " or @SukukandBonds_CapitalMarketOverviewPage";
          } else if (item.submenu === "Derivatives") {
            runString += " or @Derivative_CapitalMarketOverviewPage";
          } else if (item.submenu === "Funds") {
            runString += " or @Funds_CapitalMarketOverviewPage";
          } else if (item.submenu === "Industry Classification") {
            runString += " or @PostTradeInfrastructureEnhancementsPage";
          } else if (item.submenu === "Tradable Rights") {
            runString += " or @TradableRightsPage";
          } else if (item.submenu === "Trading Cycle and Times") {
            runString += " or @TradingCycleandTimesPage";
          } else if (item.submenu === "Closing Auction and Trade-at-Last") {
            runString += " or @ClosingAuctionandTradeatLastPage";
          } else if (
            item.submenu === "Restriction Periods and Financials Deadlines"
          ) {
            runString += " or @RestrictionPeriodsandFinancialsDeadlinesPage";
          }
        }
        if (!rulesAndGuidanceSelected && !indicesSelected) {
          if (item.submenu === "Index Calculation Methodology") {
            runString += " or @IndexCalculationMethodologyPage";
          } else if (item.submenu === "MSCI TADAWUL 30 Index") {
            runString += " or @MSCITADAWUL30IndexPage";
          } else if (
            item.submenu === "iBoxx Tadawul SAR Government Sukuk and Bond Indices"
          ) {
            runString += " or @iBoxxTadawulSARGovernmentSukuk&BondIndicesPage";
          }
        }
        if (!rulesAndGuidanceSelected && !marketRulesAndFormsSelected) {
          if (item.submenu === "Capital Market Law") {
            runString += " or @MarketRulesAndForms";
          } else if (
            item.submenu === "Exchange and Centre Rules and Regulations"
          ) {
            runString += " or @ExchangeRulesAndProceduresPage";
          } else if (item.submenu === "Bylaws") {
            runString += " or @ByLawsPage";
          } else if (item.submenu === "Disclosure Forms") {
            runString += " or @DisclosureFormsPage";
          }
        }
        if (!aboutSaudiSelected && !aboutUsSelected) {
          if (item.submenu === "Saudi Exchange") {
            // runString+=" or @MarketRulesAndForms"
          } else if (item.submenu === "Annual Reports") {
            // runString+=" or @ExchangeRulesAndProceduresPage";
          } else if (item.submenu === "Strategy Vision and Mission") {
            // runString+=" or @ByLawsPage";
          } else if (item.submenu === "Management Team") {
            // runString+=" or @DisclosureFormsPage";
          } else if (item.submenu === "Careers") {
            // runString+=" or @DisclosureFormsPage";
          }
        }
        if (!aboutSaudiSelected && !exchangeMediaCentreSelected) {
          if (item.submenu === "Saudi Exchange Press Releases") {
            runString += " or @SaudiExchangePressReleasesPage";
          } else if (item.submenu === "Saudi Exchange Holiday Calendar") {
            runString += " or @SaudiExchangeHolidayCalendarPage";
          } else if (item.submenu === "Saudi Exchange Events") {
            runString += " or @SaudiExchangeEventsPage";
          } else if (item.submenu === "Saudi Exchange Brand guidelines") {
            runString += " or @SaudiExchangeBrandGuidelinesPage";
          } else if (item.submenu === "Multimedia") {
            runString += " or @MultimediaPage";
          }
        }
        if (!aboutSaudiSelected && !saudiCapitalMarketAwardsSelected) {
          if (item.submenu === "Best Investor Relations Program Award") {
            // runString+=" or @SaudiExchangePressReleasesPage"
          } else if (item.submenu === "Most Notable Listing Award") {
            // runString+=" or @SaudiExchangeHolidayCalendarPage";
          } else if (item.submenu === "Best Broker Award") {
            // runString+=" or @SaudiExchangeEventsPage";
          } else if (item.submenu === "Best Custodian Award") {
            // runString+=" or @SaudiExchangeBrandGuidelinesPage";
          }
        }
      });

      
    //   alert(runString);
    // str = str.replace(/^\s*or\s*/, '');

    if(platform==="web"){
      let mainString =` mvn clean install -Dplatform="${platform}" -Dbrowser="${browser}" -Dlanguage="${language}" -Dsrcurl=${sourceUrl} -Dtrgurl=${targetUrl} -Dcucumber.filter.tags="${runString.replace(/^\s*or\s*/, '')}"`
     // let mainString=`mvn clean install -Dplatform="Web" -Dbrowser="Chrome" -Dlanguage="English" -Dcucumber.filter.tags=" @feedback"`
    //   console.log(mainString);
      runAutomation(mainString)
    }else{
      let mainString =` mvn clean install -Dplatform="${platform}" -Dbrowser="${browser}" -Dlanguage="${language}" -Dsrcurl=${sourceUrl} -Dtrgurl=${targetUrl} iDmobileos=${mobileOS}  -Dmobileosversion=${mobileOSVersion} -Dmobiledevicename=${mobileModel} -Dmobiledeviceid=${mobileID} -Dcucumber.filter.tags="${runString.replace(/^\s*or\s*/, '')}"`
      // runAutomation(mainString)
    }


    });
  });

function runAutomation(command) {
    fetch('/create-and-run-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Command executed successfully!");
            closeModal()
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}
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

