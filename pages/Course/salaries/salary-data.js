// Salary data structure
// Configuration: Set to true to use Google Sheets data, false for hardcoded data
const USE_GOOGLE_SHEETS_DATA = false;

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
            fetchFromGoogleSheets();
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
            company: cells[2]?.v || '', // Column 3
            hourlySalary: cells[6]?.v || 0, // Column 7 (שכר לשעה)
        };
    });

    console.log('Raw salary data from Google Sheets:', rawSalaryData);

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
                console.log(`🔄 Auto-categorized "${company}" as American company`);
            } else if (israeliIndicators.some(indicator => companyLower.includes(indicator))) {
                category = 'israeli';
                console.log(`🔄 Auto-categorized "${company}" as Israeli company`);
            } else {
                console.log(`ℹ️ New company "${company}" added to Other category`);
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

    console.log('Processed salary data:', categorizedData);
    console.log('Company mappings applied:', Object.keys(companyData).length, 'unique companies');
    
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

    } catch (error) {
        console.error('Error loading salary data:', error);
        // Could show an error message to user here
    }



}
