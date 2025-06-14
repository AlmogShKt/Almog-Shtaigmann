// Salary data structure
// Configuration: Set to true to use Google Sheets data, false for hardcoded data
const USE_GOOGLE_SHEETS_DATA = true;

const salaryData = {
    companies: {
        american: [
            "Amazon",
            "Intel",
            "American Company",
            "Citadel",
            "Google",
            "Microsoft",
            "Salesforce",
            "Genesys",
            "ZoomInfo",
            "REGDATA",
        ],
        israeli: [
            "Atera",
            "BigID",
            "Check Point",
            "CyberArk",
            "Jfrog",
            "Rafael",
            "Startup",
            "Technion",
        ],
        other: [
            "Bruker",
            "ARM",
            "Clarifruit - Startup",
            "Condor Pacific",
            "Confidential - Small Company",
            "Defense Industry",
            "Intl Bank (Tech Division)",
            "Insurance Company",
            "Nuvei",
            "Via",
            "ZOLL Itamar Medical",
            "Non-Outsourcing Co.",
        ],
    },
    salaries: {
        min: {
            "Amazon": 140,
            "Intel": 65,
            "American Company": 100,
            "Citadel": 65,
            "Google": 150,
            "Microsoft": 110,
            "Salesforce": 95,
            "Genesys": 110,
            "ZoomInfo": 77,
            "Atera": 75,
            "BigID": 90,
            "Check Point": 75,
            "CyberArk": 90,
            "Jfrog": 77,
            "Rafael": 71,
            "Startup": 42,
            "Technion": 55,
            "Bruker": 93,
            "ARM": 125,
            "Clarifruit - Startup": 42,
            "Condor Pacific": 90,
            "Confidential - Small Company": 85,
            "Defense Industry": 75,
            "Intl Bank (Tech Division)": 90,
            "Insurance Company": 100,
            "Nuvei": 60,
            "Via": 55,
            "ZOLL Itamar Medical": 99,
            "Non-Outsourcing Co.": 65,
            "REGDATA": 158,
        },
        avg: {
            "Amazon": 140,
            "Intel": 81,
            "American Company": 100,
            "Citadel": 65,
            "Google": 150,
            "Genesys": 110,
            "REGDATA": 158,
            "ZoomInfo": 77,
            "Microsoft": 115,
            "Salesforce": 95,
            "Atera": 75,
            "BigID": 90,
            "Check Point": 86.25,
            "CyberArk": 90,
            "Jfrog": 85,
            "Rafael": 76.5,
            "Startup": 83,
            "Technion": 55,
            "Bruker": 93,
            "ARM": 125,
            "Clarifruit - Startup": 42,
            "Condor Pacific": 90,
            "Confidential - Small Company": 85,
            "Defense Industry": 75,
            "Intl Bank (Tech Division)": 90,
            "Insurance Company": 100,
            "Nuvei": 60,
            "Via": 55,
            "ZOLL Itamar Medical": 99,
            "Non-Outsourcing Co.": 65,
        },
        max: {
            "Amazon": 140,
            "REGDATA": 158,
            "Intel": 100,
            "American Company": 100,
            "Genesys": 110,
            "ZoomInfo": 77,
            "Citadel": 65,
            "Google": 150,
            "Microsoft": 120,
            "Salesforce": 95,
            "Atera": 75,
            "BigID": 90,
            "Check Point": 100,
            "CyberArk": 90,
            "Jfrog": 90,
            "Rafael": 87,
            "Startup": 100,
            "Technion": 55,
            "Bruker": 93,
            "ARM": 125,
            "Clarifruit - Startup": 42,
            "Condor Pacific": 90,
            "Confidential - Small Company": 85,
            "Defense Industry": 75,
            "Intl Bank (Tech Division)": 90,
            "Insurance Company": 100,
            "Nuvei": 60,
            "Via": 55,
            "ZOLL Itamar Medical": 99,
            "Non-Outsourcing Co.": 65,
        },
    },
};

/**
 * Generic function to fetch salary data
 * Currently returns hardcoded data, but can be replaced with API call later
 * @returns {Promise<Object>} Promise that resolves to salary data
 */
async function fetchSalaryData() {
    // TODO: Replace this with actual API call
    // Example: return fetch('/api/salary-data').then(response => response.json());

    // Use global configuration to determine data source
    if (USE_GOOGLE_SHEETS_DATA) {
        try {
            return await fetchFromGoogleSheets();
        } catch (error) {
            console.error('Failed to fetch from Google Sheets, falling back to hardcoded data:', error);
            // Fallback to hardcoded data if Google Sheets fails
        }
    }

    // Simulate API delay for hardcoded data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(salaryData);
        }, 100);
    });
}

/**
 * Fetch and process salary data from Google Sheets
 * @returns {Promise<Object>} Promise that resolves to processed salary data
 */
async function fetchFromGoogleSheets() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1U-RbrFvbKeileTTnS08HyFP_IS0mWkhBZ7IHKOTgBdk/gviz/tq?tqx=out:json&gid=1400753440');
    const data = await response.text();
    const json = JSON.parse(data.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const rawSalaryData = rows.map(row => {
        const cells = row.c;
        return {
            timestamp: cells[0]?.v || '', // Column 1 - Timestamp
            isStudent: cells[1]?.v || '', // Column 2 - Student verification
            company: cells[2]?.v || '', // Column 3 - Company name
            jobTitle: cells[3]?.v || '', // Column 4 - Job title
            semester: cells[4]?.v || '', // Column 5 - Semester started
            previousExperience: cells[5]?.v || '', // Column 6 - Previous experience
            hourlySalary: cells[6]?.v || 0, // Column 7 - Hourly salary
            pensionFund: cells[7]?.v || '', // Column 8 - Pension fund
            specialNotes: cells[8]?.v || '', // Column 9 - Special notes
        };
    });

    // Process and categorize the data
    return processGoogleSheetsData(rawSalaryData);
}

/**
 * Process raw Google Sheets data and categorize companies
 * @param {Array} rawData - Raw salary data from Google Sheets
 * @returns {Object} Processed salary data in our standard format
 */
function processGoogleSheetsData(rawData) {
    // Filter out empty entries
    const validData = rawData.filter(item => item.company && item.hourlySalary > 0);

    // Enhanced company mapping with aliases and Hebrew names
    const companyMappings = {
        // American companies with all possible variations
        'Amazon': ['Amazon', 'amazon'],
        'Intel': ['Intel', 'intel', 'אינטל'],
        'Google': ['Google', 'google', 'גוגל'],
        'Microsoft': ['Microsoft', 'microsoft', 'מיקרוסופט'],
        'Salesforce': ['Salesforce', 'salesforce'],
        'Citadel': ['Citadel', 'citadel'],
        'ZoomInfo': ['ZoomInfo', 'Zoominfo', 'zoominfo'],
        'REGDATA': ['REGDATA', 'regdata'],
        'Genesys': ['Genesys', 'genesys'],
        'American Company': ['American Company', 'חברה אמריקאית'],
        'Mobileye': ['Mobileye', 'mobileye'],

        // Israeli companies with all possible variations
        'Atera': ['Atera', 'atera'],
        'BigID': ['BigID', 'bigid'],
        'Check Point': ['Check Point', 'Check point', 'check point', 'checkpoint'],
        'CyberArk': ['CyberArk', 'cyberark', 'סייברארק'],
        'Jfrog': ['Jfrog', 'JFrog', 'jfrog'],
        'Rafael': ['Rafael', 'rafael', 'רפאל'],
        'Startup': ['Startup', 'startup', 'סטארטאפ', 'סטארטאפ שלב סיד', 'סטראפ אפ', 'גרינאיי - סטראפ בתל אביב'],
        'Technion': ['Technion', 'technion', 'טכניון'],

        // Other companies with Hebrew translations
        'ARM': ['ARM', 'Arm', 'arm'],
        'Bruker': ['Bruker', 'bruker'],
        'Clarifruit - Startup': ['Clarifruit - Startup', 'Clarifruit - סטארטאפ'],
        'Condor Pacific': ['Condor Pacific', 'קונדור פסיפיק'],
        'Confidential - Small Company': ['Confidential - Small Company', 'חסוי - חברה קטנה', 'חברת סייבר בינלאומית קטנה'],
        'Defense Industry': ['Defense Industry', 'תעשיה ביטחונית'],
        'Intl Bank (Tech Division)': ['Intl Bank (Tech Division)', 'בנק בינלאומי במחלקת טכנולוגיה'],
        'Insurance Company': ['Insurance Company', 'ביטוח'],
        'Nuvei': ['Nuvei', 'nuvei'],
        'Via': ['Via', 'via'],
        'ZOLL Itamar Medical': ['ZOLL Itamar Medical'],
        'Non-Outsourcing Co.': ['Non-Outsourcing Co.', 'נון מיקור חוץ'],
        'Medium Company': ['בינונית (400 מפתחים)'],
        'Vvs': ['Vvs', 'vvs']
    };

    // Create reverse mapping for quick lookup
    const aliasToCanonical = {};
    Object.keys(companyMappings).forEach(canonical => {
        companyMappings[canonical].forEach(alias => {
            aliasToCanonical[alias.toLowerCase()] = canonical;
        });
    });

    // Define categories
    const americanCompanies = ['Amazon', 'Intel', 'Google', 'Microsoft', 'Salesforce', 'Citadel', 'ZoomInfo', 'REGDATA', 'Genesys', 'American Company', 'Mobileye'];
    const israeliCompanies = ['Atera', 'BigID', 'Check Point', 'CyberArk', 'Jfrog', 'Rafael', 'Startup', 'Technion'];

    const categorizedData = {
        companies: {
            american: [],
            israeli: [],
            other: []
        },
        salaries: {
            min: {},
            avg: {},
            max: {}
        }
    };

    // Group salary data by normalized company name
    const companyData = {};
    validData.forEach(item => {
        const originalCompany = item.company.trim();
        const canonicalCompany = aliasToCanonical[originalCompany.toLowerCase()] || originalCompany;

        if (!companyData[canonicalCompany]) {
            companyData[canonicalCompany] = [];
        }
        companyData[canonicalCompany].push(item.hourlySalary);
    });

    // Process each company's salary data
    Object.keys(companyData).forEach(company => {
        const salaries = companyData[company];
        const minSalary = Math.min(...salaries);
        const maxSalary = Math.max(...salaries);
        const avgSalary = Math.round((salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length) * 100) / 100;

        // Enhanced categorization for new companies
        let category = 'other';
        if (americanCompanies.includes(company)) {
            category = 'american';
        } else if (israeliCompanies.includes(company)) {
            category = 'israeli';
        } else {
            // Auto-categorize new companies based on name patterns
            const companyLower = company.toLowerCase();

            // American company indicators
            const americanIndicators = ['corp', 'inc', 'llc', 'ltd', 'technologies', 'systems', 'solutions', 'meta', 'apple', 'tesla', 'nvidia', 'oracle', 'adobe', 'uber', 'airbnb', 'netflix', 'spotify'];

            // Israeli company indicators  
            const israeliIndicators = ['israeli', 'israel', 'tel aviv', 'tlv', 'jerusalem', 'haifa', 'יישראלי', 'ישראל', 'תל אביב', 'ירושלים', 'חיפה'];

            if (americanIndicators.some(indicator => companyLower.includes(indicator))) {
                category = 'american';
            } else if (israeliIndicators.some(indicator => companyLower.includes(indicator))) {
                category = 'israeli';
            } else {
            }
        }

        // Add to appropriate category (avoid duplicates)
        if (!categorizedData.companies[category].includes(company)) {
            categorizedData.companies[category].push(company);
        }

        categorizedData.salaries.min[company] = minSalary;
        categorizedData.salaries.avg[company] = avgSalary;
        categorizedData.salaries.max[company] = maxSalary;
    });

    // Log any new companies that might need manual mapping
    const knownCompanies = Object.keys(companyMappings);
    const newCompanies = Object.keys(companyData).filter(company => !knownCompanies.includes(company));
    if (newCompanies.length > 0) {
        console.log('🆕 New companies detected (consider adding to mapping):', newCompanies);
    }

    return categorizedData;
}

/**
 * Get companies by category
 * @param {string} category - Category of companies ('american', 'israeli', 'other')
 * @returns {Array<string>} Array of company names
 */
function getCompaniesByCategory(category) {
    if (window.currentSalaryData) {
        return window.currentSalaryData.companies[category] || [];
    }
    return salaryData.companies[category] || [];
}

/**
 * Get salary data for specific companies
 * @param {Array<string>} companies - Array of company names
 * @param {string} salaryType - Type of salary ('min', 'avg', 'max')
 * @returns {Array<number>} Array of salary values
 */
function getSalariesForCompanies(companies, salaryType) {
    const dataSource = window.currentSalaryData || salaryData;
    return companies.map((company) => dataSource.salaries[salaryType][company] || 0);
}

/**
 * Calculate average salary for a category of companies
 * @param {Array<string>} companies - Array of company names
 * @returns {number} Average salary rounded to 2 decimal places
 */
function calculateCategoryAverage(companies) {
    const dataSource = window.currentSalaryData || salaryData;
    const salaries = companies.map((company) => {
        const min = dataSource.salaries.min[company] || 0;
        const avg = dataSource.salaries.avg[company] || 0;
        const max = dataSource.salaries.max[company] || 0;

        // If all values are the same, use that value
        if (min === avg && avg === max) {
            return min;
        }
        // Otherwise use the average value
        return avg;
    });

    const validSalaries = salaries.filter(salary => salary > 0);
    if (validSalaries.length === 0) return 0;

    const sum = validSalaries.reduce((total, salary) => total + salary, 0);
    return Math.round((sum / validSalaries.length) * 100) / 100;
}

/**
 * Calculate total average salary across all companies and categories
 * @returns {number} Overall average salary rounded to 2 decimal places
 */
function calculateTotalAverage() {
    const dataSource = window.currentSalaryData || salaryData;
    // Combine all companies from all categories
    const allCompanies = [
        ...dataSource.companies.american,
        ...dataSource.companies.israeli,
        ...dataSource.companies.other
    ];

    const allSalaries = allCompanies.map((company) => {
        const min = dataSource.salaries.min[company] || 0;
        const avg = dataSource.salaries.avg[company] || 0;
        const max = dataSource.salaries.max[company] || 0;

        // If all values are the same, use that value
        if (min === avg && avg === max) {
            return min;
        }
        // Otherwise use the average value
        return avg;
    });

    const validSalaries = allSalaries.filter(salary => salary > 0);
    if (validSalaries.length === 0) return 0;

    const sum = validSalaries.reduce((total, salary) => total + salary, 0);
    return Math.round((sum / validSalaries.length) * 100) / 100;
}

/**
 * Initialize and render all salary charts
 * This function will be called after data is loaded
 */
async function initializeSalaryCharts() {
    try {
        // Fetch data (currently returns hardcoded data, but ready for API integration)
        const data = await fetchSalaryData();

        // Update global data reference
        window.currentSalaryData = data;

        // Calculate averages for each category
        const americanAvg = calculateCategoryAverage(data.companies.american);
        const israeliAvg = calculateCategoryAverage(data.companies.israeli);
        const otherAvg = calculateCategoryAverage(data.companies.other);
        const totalAvg = calculateTotalAverage();

        // Update average displays
        document.getElementById('total-average').textContent = `שכר ממוצע של סטודנט למדעי המחשב:  ₪${totalAvg} לשעה`;
        document.getElementById('american-average').textContent = `ממוצע כללי: ₪${americanAvg} לשעה`;
        document.getElementById('israeli-average').textContent = `ממוצע כללי: ₪${israeliAvg} לשעה`;
        document.getElementById('other-average').textContent = `ממוצע כללי: ₪${otherAvg} לשעה`;

        // Create charts for each category
        createChart(
            "americanChart",
            data.companies.american,
            getSalariesForCompanies(data.companies.american, 'min'),
            getSalariesForCompanies(data.companies.american, 'avg'),
            getSalariesForCompanies(data.companies.american, 'max')
        );

        createChart(
            "israeliChart",
            data.companies.israeli,
            getSalariesForCompanies(data.companies.israeli, 'min'),
            getSalariesForCompanies(data.companies.israeli, 'avg'),
            getSalariesForCompanies(data.companies.israeli, 'max')
        );

        createChart(
            "otherChart",
            data.companies.other,
            getSalariesForCompanies(data.companies.other, 'min'),
            getSalariesForCompanies(data.companies.other, 'avg'),
            getSalariesForCompanies(data.companies.other, 'max')
        );

        // Populate the data table
        if (USE_GOOGLE_SHEETS_DATA) {
            // If using Google Sheets, we need to get the raw data for the table
            try {
                const response = await fetch('https://docs.google.com/spreadsheets/d/1U-RbrFvbKeileTTnS08HyFP_IS0mWkhBZ7IHKOTgBdk/gviz/tq?tqx=out:json&gid=1400753440');
                const rawData = await response.text();
                const json = JSON.parse(rawData.substring(47).slice(0, -2));
                const rows = json.table.rows;

                const googleSheetsData = rows.map(row => {
                    const cells = row.c;
                    return {
                        timestamp: cells[0]?.v || '',
                        isStudent: cells[1]?.v || '',
                        company: cells[2]?.v || '',
                        jobTitle: cells[3]?.v || '',
                        semester: cells[4]?.v || '',
                        previousExperience: cells[5]?.v || '',
                        hourlySalary: cells[6]?.v || 0,
                        pensionFund: cells[7]?.v || '',
                        specialNotes: cells[8]?.v || '',
                    };
                });

                // For Google Sheets data, populate table with raw responses
                populateTableFromGoogleSheets(googleSheetsData);
            } catch (googleError) {
                console.error('Error loading Google Sheets data for table:', googleError);
                // Fallback to processed data
                populateDataTable(data);
            }
        } else {
            // Use processed hardcoded data
            populateDataTable(data);
        }

    } catch (error) {
        console.error('Error loading salary data:', error);
        // Show error message to user
        const resultsCounter = document.getElementById('results-counter');
        const tableBody = document.getElementById('salary-table-body');

        if (resultsCounter) {
            resultsCounter.textContent = 'שגיאה בטעינת הנתונים';
            resultsCounter.style.color = '#f44336';
        }

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px; color: #f44336;">
                        שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.
                    </td>
                </tr>
            `;
        }
    }



}

// Data table management functions
let allTableData = []; // Store all data for filtering
let filteredTableData = []; // Store filtered data

/**
 * Populate the data table with salary information
 * @param {Object} salaryData - The salary data object
 */
function populateDataTable(salaryData) {
    const tableBody = document.getElementById('salary-table-body');
    const resultsCounter = document.getElementById('results-counter');

    if (!tableBody || !resultsCounter) {
        console.warn('Table elements not found');
        return;
    }

    // Clear existing data
    allTableData = [];

    // Collect data from all categories
    const categories = [
        { name: 'american', label: 'חברות אמריקאיות', companies: salaryData.companies.american },
        { name: 'israeli', label: 'חברות ישראליות', companies: salaryData.companies.israeli },
        { name: 'other', label: 'אחרות', companies: salaryData.companies.other }
    ];

    categories.forEach(category => {
        category.companies.forEach(company => {
            const minSalary = salaryData.salaries.min[company] || 0;
            const maxSalary = salaryData.salaries.max[company] || 0;
            const avgSalary = Math.round((minSalary + maxSalary) / 2);

            allTableData.push({
                company: company,
                jobTitle: 'לא צוין', // Hardcoded data doesn't have job titles
                salary: avgSalary,
                semester: 'לא צוין', // Hardcoded data doesn't have semester info
                previousExperience: 'לא צוין', // Hardcoded data doesn't have experience info
                pensionFund: 'לא צוין', // Hardcoded data doesn't have pension info
                category: category.label,
                categoryName: category.name
            });
        });
    });

    // Sort by salary descending
    allTableData.sort((a, b) => b.salary - a.salary);

    // Initially show all data
    filteredTableData = [...allTableData];
    renderTable();
}

/**
 * Populate table with Google Sheets data (for form responses)
 * @param {Array} rawData - Raw data from Google Sheets
 */
function populateTableFromGoogleSheets(rawData) {
    const tableBody = document.getElementById('salary-table-body');
    const resultsCounter = document.getElementById('results-counter');

    if (!tableBody || !resultsCounter) {
        console.warn('Table elements not found');
        return;
    }

    // Clear existing data
    allTableData = [];

    // Filter and process valid data
    const validData = rawData.filter(item => item.company && item.hourlySalary > 0);

    validData.forEach(item => {
        // Determine category based on company name
        const category = categorizeCompany(item.company);

        allTableData.push({
            company: item.company,
            jobTitle: item.jobTitle || 'לא צוין',
            salary: Math.round(item.hourlySalary),
            semester: item.semester || 'לא צוין',
            previousExperience: item.previousExperience || 'לא צוין',
            pensionFund: item.pensionFund || 'לא צוין',
            category: getCategoryLabel(category),
            categoryName: category,
            specialNotes: item.specialNotes || '',
            timestamp: item.timestamp || ''
        });
    });

    // Sort by salary descending
    allTableData.sort((a, b) => b.salary - a.salary);

    // Initially show all data
    filteredTableData = [...allTableData];
    renderTable();
}

/**
 * Determine company category based on name
 * @param {string} companyName - Company name
 * @returns {string} Category name
 */
function categorizeCompany(companyName) {
    const americanIndicators = ['Microsoft', 'Google', 'Amazon', 'Intel', 'American'];
    const israeliIndicators = ['Check Point', 'CyberArk', 'Rafael', 'BigID', 'Atera'];

    const lowerName = companyName.toLowerCase();

    if (americanIndicators.some(indicator => lowerName.includes(indicator.toLowerCase()))) {
        return 'american';
    } else if (israeliIndicators.some(indicator => lowerName.includes(indicator.toLowerCase()))) {
        return 'israeli';
    } else {
        return 'other';
    }
}

/**
 * Get category label in Hebrew
 * @param {string} categoryName - Category name
 * @returns {string} Hebrew label
 */
function getCategoryLabel(categoryName) {
    const labels = {
        'american': 'חברות אמריקאיות',
        'israeli': 'חברות ישראליות',
        'other': 'אחרות'
    };
    return labels[categoryName] || 'אחרות';
}

/**
 * Render the table with current filtered data
 */
function renderTable() {
    const tableBody = document.getElementById('salary-table-body');
    const resultsCounter = document.getElementById('results-counter');

    if (!tableBody || !resultsCounter) return;

    // Update results counter with additional info
    const totalEntries = allTableData.length;
    const filteredEntries = filteredTableData.length;
    const avgSalary = filteredTableData.length > 0 ?
        Math.round(filteredTableData.reduce((sum, item) => sum + item.salary, 0) / filteredTableData.length) : 0;

    resultsCounter.innerHTML = `
        מוצגים <strong>${filteredEntries}</strong> תוצאות מתוך <strong>${totalEntries}</strong>
        ${filteredEntries > 0 ? `| ממוצע מסונן: <strong>₪${avgSalary}</strong>` : ''}
    `;

    // Clear table body
    tableBody.innerHTML = '';

    if (filteredTableData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #666;">
                    לא נמצאו תוצאות
                </td>
            </tr>
        `;
        return;
    }

    // Add rows to table
    filteredTableData.forEach((item, index) => {
        const row = document.createElement('tr');

        // Alternate row colors
        if (index % 2 === 0) {
            row.style.backgroundColor = '#f8f9fa';
        }

        // Add hover effect
        row.style.transition = 'background-color 0.2s';
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#e3f2fd';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
        });

        // Create salary display
        let salaryDisplay = `₪${item.salary}`;

        // Add rank indicator for top salaries
        let rankIndicator = '';
        if (currentSort.column === 'salary' && !currentSort.ascending && index < 3) {
            const medals = ['🥇', '🥈', '🥉'];
            rankIndicator = `<span style="margin-left: 8px;">${medals[index]}</span>`;
        }

        // Format experience text - handle undefined values
        let experienceText = item.previousExperience || 'לא צוין';
        if (experienceText && experienceText !== 'לא צוין') {
            // Clean up common variations
            experienceText = experienceText.replace(/^לא$/, 'ללא ניסיון');
            experienceText = experienceText.replace(/^כן/, 'יש ניסיון');
        }

        // Format pension fund text - handle undefined values
        let pensionText = item.pensionFund || 'לא צוין';
        if (pensionText && pensionText !== 'לא צוין') {
            pensionText = pensionText.replace(/^כן$/, '✓');
            pensionText = pensionText.replace(/^לא$/, '✗');
        }

        row.innerHTML = `
            <td style="padding: 12px 15px; text-align: right; font-weight: 500; max-width: 150px;">
                <div title="${item.company || ''}">
                    ${item.company || ''}${rankIndicator}
                </div>
            </td>
            <td style="padding: 12px 15px; text-align: center; max-width: 120px;">
                <div title="${item.jobTitle || 'לא צוין'}" style="font-size: 14px;">
                    ${item.jobTitle || 'לא צוין'}
                </div>
            </td>
            <td style="padding: 12px 15px; text-align: center; font-weight: bold; color: #2575fc;">
                ${salaryDisplay}
            </td>
            <td style="padding: 12px 15px; text-align: center; font-size: 14px;">
                ${item.semester || 'לא צוין'}
            </td>
            <td style="padding: 12px 15px; text-align: center; font-size: 14px;">
                ${experienceText}
            </td>
            <td style="padding: 12px 15px; text-align: center; font-size: 14px;">
                ${pensionText}
            </td>
            <td style="padding: 12px 1px; text-align: center;">
                <span style="
                    background: ${getCategoryColor(item.categoryName)}; 
                    color: white; 
                    padding: 4px 12px; 
                    border-radius: 15px; 
                    font-size: 12px;
                    font-weight: bold;
                ">
                    ${item.category || 'אחרות'}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Update sort icons
    updateSortIcons();
}

/**
 * Get color for category badge
 * @param {string} categoryName - Category name
 * @returns {string} CSS color
 */
function getCategoryColor(categoryName) {
    const colors = {
        'american': '#4CAF50',  // Green
        'israeli': '#2196F3',   // Blue
        'other': '#FF9800'      // Orange
    };
    return colors[categoryName] || '#757575';
}

/**
 * Filter table data based on search term
 * @param {string} searchTerm - Search term
 */
function filterTable(searchTerm) {
    if (!searchTerm.trim()) {
        filteredTableData = [...allTableData];
    } else {
        const term = searchTerm.toLowerCase().trim();
        filteredTableData = allTableData.filter(item =>
            (item.company && typeof item.company === 'string' && item.company.toLowerCase().includes(term)) ||
            (item.category && typeof item.category === 'string' && item.category.includes(term)) ||
            (item.jobTitle && typeof item.jobTitle === 'string' && item.jobTitle.toLowerCase().includes(term)) ||
            (item.semester && typeof item.semester === 'string' && item.semester.toLowerCase().includes(term)) ||
            (item.previousExperience && typeof item.previousExperience === 'string' && item.previousExperience.toLowerCase().includes(term)) ||
            (item.pensionFund && typeof item.pensionFund === 'string' && item.pensionFund.toLowerCase().includes(term))
        );
    }
    renderTable();
}

/**
 * Initialize table search functionality
 */
function initializeTableSearch() {
    const searchInput = document.getElementById('company-search');
    const clearButton = document.getElementById('clear-search');

    if (!searchInput || !clearButton) {
        console.warn('Search elements not found');
        return;
    }

    // Add search functionality
    searchInput.addEventListener('input', (e) => {
        filterTable(e.target.value);
    });

    // Add clear functionality
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        filterTable('');
        searchInput.focus();
    });

    // Add Enter key support
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterTable(searchInput.value);
        }
    });
}

/**
 * Sorting state management
 */
let currentSort = {
    column: 'salary',
    ascending: false
};

/**
 * Toggle sort for a column
 * @param {string} column - Column to sort by
 */
function toggleSort(column) {
    // If clicking the same column, toggle direction
    if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        // New column, start with descending for salary, ascending for others
        currentSort.column = column;
        currentSort.ascending = column === 'salary' ? false : true;
    }

    // Update sort icons
    updateSortIcons();

    // Sort and render
    sortTable(column, currentSort.ascending);
}

/**
 * Update sort icons in table headers
 */
function updateSortIcons() {
    // Reset all icons
    ['company', 'jobTitle', 'salary', 'semester', 'experience', 'pension', 'category'].forEach(col => {
        const icon = document.getElementById(`sort-${col}-icon`);
        if (icon) {
            icon.textContent = '↕️';
            icon.style.opacity = '0.7';
        }
    });

    // Set active column icon
    const activeIcon = document.getElementById(`sort-${currentSort.column}-icon`);
    if (activeIcon) {
        activeIcon.textContent = currentSort.ascending ? '↑' : '↓';
        activeIcon.style.opacity = '1';
    }
}

/**
 * Sort table by column
 * @param {string} column - Column to sort by ('company', 'jobTitle', 'salary', 'semester', 'previousExperience', 'pensionFund', 'category')
 * @param {boolean} ascending - Sort direction
 */
function sortTable(column, ascending = true) {
    filteredTableData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        // Handle undefined/null values
        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        // Handle different data types
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (ascending) {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });

    renderTable();
}


// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Show initial loading state for table
    const resultsCounter = document.getElementById('results-counter');
    const tableBody = document.getElementById('salary-table-body');

    if (resultsCounter) {
        resultsCounter.textContent = 'טוען נתונים...';
        resultsCounter.style.color = '#666';
    }

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #666;">
                    טוען נתונים...
                </td>
            </tr>
        `;
    }

    // Initialize search functionality first
    initializeTableSearch();

    // Then initialize charts and data (with a small delay to ensure DOM is ready)
    setTimeout(() => {
        initializeSalaryCharts();
    }, 100);
});
