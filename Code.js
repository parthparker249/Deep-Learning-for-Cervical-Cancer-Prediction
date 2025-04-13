/**
 * Cervical Cancer Risk Factors Dashboard
 * This script handles server-side functionality for the dashboard web app
 * that visualizes and analyzes cervical cancer risk factors data.
 */

/**
 * Entry point for the web app
 * @returns {HtmlOutput} The HTML content to display
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Cervical Cancer Risk Factors Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Include external files (CSS, JS) in the HTML template
 * @param {string} filename - Name of the file to include
 * @returns {string} The content of the file
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Get data from the Google Sheet
 * @returns {Array} The data from the sheet
 */
function getData() {
  try {
    // Reference the spreadsheet by ID
    // Replace 'YOUR_SPREADSHEET_ID' with your actual spreadsheet ID
    const spreadsheetId = '15vFUSckQJmvVy-IHPBwKdExyKB4ZxUWIDo-ZwdZh_QQ'; 
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('risk_factors_cervical_cancer');
    
    if (!sheet) {
      throw new Error('Sheet "risk_factors_cervical_cancer" not found');
    }
    
    // Get all data including headers
    const data = sheet.getDataRange().getValues();
    
    // Extract headers (first row)
    const headers = data[0];
    
    // Convert data to array of objects
    const jsonData = [];
    for (let i = 1; i < data.length; i++) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        // Handle '?' values
        row[headers[j]] = data[i][j] === '?' ? null : data[i][j];
      }
      jsonData.push(row);
    }
    
    return {
      success: true,
      data: jsonData,
      headers: headers
    };
  } catch (error) {
    console.error('Error fetching data: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculate summary metrics for the dashboard
 * @returns {Object} Summary metrics
 */
function getSummaryMetrics() {
  try {
    const dataResult = getData();
    
    if (!dataResult.success) {
      return dataResult; // Return error
    }
    
    const data = dataResult.data;
    const totalRecords = data.length;
    
    // Calculate % of patients who had STDs
    let patientsWithSTDs = 0;
    data.forEach(row => {
      if (row['STDs'] === 1) patientsWithSTDs++;
    });
    const percentSTDs = (patientsWithSTDs / totalRecords) * 100;
    
    // Calculate avg number of sexual partners
    let totalPartners = 0;
    let validPartnerRecords = 0;
    data.forEach(row => {
      if (row['Number of sexual partners'] !== null) {
        totalPartners += row['Number of sexual partners'];
        validPartnerRecords++;
      }
    });
    const avgPartners = totalPartners / validPartnerRecords;
    
    // NEW METRIC 1: First sexual intercourse age distribution
    let firstIntercourseSum = 0;
    let firstIntercourseCounts = 0;
    data.forEach(row => {
      if (row['First sexual intercourse'] !== null) {
        firstIntercourseSum += row['First sexual intercourse'];
        firstIntercourseCounts++;
      }
    });
    const avgFirstIntercourseAge = firstIntercourseSum / firstIntercourseCounts;
    
    // NEW METRIC 2: Hormonal contraceptives usage duration
    let hormonalContraceptivesYearsSum = 0;
    let hormonalContraceptivesYearsCounts = 0;
    data.forEach(row => {
      if (row['Hormonal Contraceptives (years)'] !== null) {
        hormonalContraceptivesYearsSum += row['Hormonal Contraceptives (years)'];
        hormonalContraceptivesYearsCounts++;
      }
    });
    const avgHormonalContraceptivesYears = hormonalContraceptivesYearsSum / hormonalContraceptivesYearsCounts;
    
    // NEW METRIC 3: IUD usage percentage and duration
    let iudUsers = 0;
    let iudYearsSum = 0;
    let iudYearsCounts = 0;
    data.forEach(row => {
      if (row['IUD'] === 1) iudUsers++;
      if (row['IUD (years)'] !== null) {
        iudYearsSum += row['IUD (years)'];
        iudYearsCounts++;
      }
    });
    const percentIUD = (iudUsers / totalRecords) * 100;
    const avgIUDYears = iudYearsCounts > 0 ? iudYearsSum / iudYearsCounts : 0;
    
    // Calculate % of patients with abnormal test results
    let abnormalResults = 0;
    data.forEach(row => {
      if (row['Hinselmann'] === 1 || row['Schiller'] === 1 || row['Citology'] === 1) {
        abnormalResults++;
      }
    });
    const percentAbnormal = (abnormalResults / totalRecords) * 100;
    
    // Calculate STDs by age group for the bar chart
    const ageGroups = {
      '< 20': { count: 0, stds: 0 },
      '20-29': { count: 0, stds: 0 },
      '30-39': { count: 0, stds: 0 },
      '40-49': { count: 0, stds: 0 },
      '50+': { count: 0, stds: 0 }
    };
    
    data.forEach(row => {
      const age = row['Age'];
      let stdCount = 0;
      
      // Count STDs
      const stdFields = [
        'STDs:condylomatosis', 'STDs:cervical condylomatosis',
        'STDs:vaginal condylomatosis', 'STDs:vulvo-perineal condylomatosis',
        'STDs:syphilis', 'STDs:pelvic inflammatory disease',
        'STDs:genital herpes', 'STDs:molluscum contagiosum',
        'STDs:AIDS', 'STDs:HIV', 'STDs:Hepatitis B',
        'STDs:HPV'
      ];
      
      stdFields.forEach(field => {
        if (row[field] === 1) stdCount++;
      });
      
      // Assign to age group
      let ageGroup;
      if (age < 20) ageGroup = '< 20';
      else if (age >= 20 && age < 30) ageGroup = '20-29';
      else if (age >= 30 && age < 40) ageGroup = '30-39';
      else if (age >= 40 && age < 50) ageGroup = '40-49';
      else ageGroup = '50+';
      
      ageGroups[ageGroup].count++;
      ageGroups[ageGroup].stds += stdCount;
    });
    
    // Calculate average STDs per age group
    const stdsByAgeGroup = Object.keys(ageGroups).map(group => {
      return [
        group, 
        ageGroups[group].count > 0 ? ageGroups[group].stds / ageGroups[group].count : 0
      ];
    });
    
    // Calculate data for line chart: Smoking years vs Age
    const smokingData = data
      .filter(row => row['Smokes (years)'] !== null && row['Age'] !== null)
      .map(row => [row['Age'], row['Smokes (years)']]);
    
    // NEW VISUALIZATION: Test results distribution by age group
    const ageTestResults = {
      '< 20': { total: 0, positive: 0 },
      '20-29': { total: 0, positive: 0 },
      '30-39': { total: 0, positive: 0 },
      '40-49': { total: 0, positive: 0 },
      '50+': { total: 0, positive: 0 }
    };
    
    data.forEach(row => {
      const age = row['Age'];
      
      // Assign to age group
      let ageGroup;
      if (age < 20) ageGroup = '< 20';
      else if (age >= 20 && age < 30) ageGroup = '20-29';
      else if (age >= 30 && age < 40) ageGroup = '30-39';
      else if (age >= 40 && age < 50) ageGroup = '40-49';
      else ageGroup = '50+';
      
      ageTestResults[ageGroup].total++;
      
      if (row['Hinselmann'] === 1 || row['Schiller'] === 1 || row['Citology'] === 1) {
        ageTestResults[ageGroup].positive++;
      }
    });
    
    const positiveRatesByAge = [['Age Group', 'Positive Rate (%)']];
    Object.keys(ageTestResults).forEach(ageGroup => {
      const positiveRate = ageTestResults[ageGroup].total > 0 
        ? (ageTestResults[ageGroup].positive / ageTestResults[ageGroup].total) * 100 
        : 0;
      positiveRatesByAge.push([ageGroup, positiveRate]);
    });
    
    return {
      success: true,
      metrics: {
        totalRecords: totalRecords,
        percentSTDs: percentSTDs.toFixed(2),
        avgPartners: avgPartners.toFixed(2),
        avgFirstIntercourseAge: avgFirstIntercourseAge.toFixed(1),
        avgHormonalContraceptivesYears: avgHormonalContraceptivesYears.toFixed(1),
        percentIUD: percentIUD.toFixed(2),
        avgIUDYears: avgIUDYears.toFixed(1),
        percentAbnormal: percentAbnormal.toFixed(2)
      },
      chartData: {
        positiveRatesByAge: positiveRatesByAge,  // New chart data replacing pie chart
        barChart: [['Age Group', 'Average Number of STDs']].concat(stdsByAgeGroup),
        lineChart: [['Age', 'Smoking Years']].concat(smokingData)
      }
    };
  } catch (error) {
    console.error('Error calculating metrics: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Apply filters to data and recalculate metrics
 * @param {Object} filters - Filter criteria
 * @returns {Object} Filtered data and metrics
 */
function getFilteredData(filters) {
  try {
    const dataResult = getData();
    
    if (!dataResult.success) {
      return dataResult; // Return error
    }
    
    let data = dataResult.data;
    
    // Apply age range filter
    if (filters.ageMin !== null && filters.ageMax !== null) {
      data = data.filter(row => {
        return row['Age'] >= filters.ageMin && row['Age'] <= filters.ageMax;
      });
    }
    
    // Apply number of pregnancies filter
    if (filters.pregnancies !== null) {
      data = data.filter(row => {
        return row['Num of pregnancies'] === filters.pregnancies;
      });
    }
    
    // Apply smoking status filter
    if (filters.smoking !== null) {
      data = data.filter(row => {
        return row['Smokes'] === filters.smoking;
      });
    }
    
    // Apply birth control filter
    if (filters.birthControl !== null) {
      data = data.filter(row => {
        return row['Hormonal Contraceptives'] === filters.birthControl;
      });
    }
    
    // Recalculate metrics with filtered data
    const totalRecords = data.length;
    
    if (totalRecords === 0) {
      return {
        success: true,
        metrics: {
          totalRecords: 0,
          percentSTDs: "0.00",
          avgPartners: "0.00",
          avgFirstIntercourseAge: "0.0",
          avgHormonalContraceptivesYears: "0.0",
          percentIUD: "0.00",
          avgIUDYears: "0.0",
          percentAbnormal: "0.00"
        },
        chartData: {
          positiveRatesByAge: [['Age Group', 'Positive Rate (%)']],
          barChart: [['Age Group', 'Average Number of STDs']],
          lineChart: [['Age', 'Smoking Years']]
        }
      };
    }
    
    // Calculate % of patients who had STDs
    let patientsWithSTDs = 0;
    data.forEach(row => {
      if (row['STDs'] === 1) patientsWithSTDs++;
    });
    const percentSTDs = (patientsWithSTDs / totalRecords) * 100;
    
    // Calculate avg number of sexual partners
    let totalPartners = 0;
    let validPartnerRecords = 0;
    data.forEach(row => {
      if (row['Number of sexual partners'] !== null) {
        totalPartners += row['Number of sexual partners'];
        validPartnerRecords++;
      }
    });
    const avgPartners = validPartnerRecords > 0 ? totalPartners / validPartnerRecords : 0;
    
    // NEW METRIC 1: First sexual intercourse age distribution
    let firstIntercourseSum = 0;
    let firstIntercourseCounts = 0;
    data.forEach(row => {
      if (row['First sexual intercourse'] !== null) {
        firstIntercourseSum += row['First sexual intercourse'];
        firstIntercourseCounts++;
      }
    });
    const avgFirstIntercourseAge = firstIntercourseCounts > 0 ? firstIntercourseSum / firstIntercourseCounts : 0;
    
    // NEW METRIC 2: Hormonal contraceptives usage duration
    let hormonalContraceptivesYearsSum = 0;
    let hormonalContraceptivesYearsCounts = 0;
    data.forEach(row => {
      if (row['Hormonal Contraceptives (years)'] !== null) {
        hormonalContraceptivesYearsSum += row['Hormonal Contraceptives (years)'];
        hormonalContraceptivesYearsCounts++;
      }
    });
    const avgHormonalContraceptivesYears = hormonalContraceptivesYearsCounts > 0 ? 
      hormonalContraceptivesYearsSum / hormonalContraceptivesYearsCounts : 0;
    
    // NEW METRIC 3: IUD usage percentage and duration
    let iudUsers = 0;
    let iudYearsSum = 0;
    let iudYearsCounts = 0;
    data.forEach(row => {
      if (row['IUD'] === 1) iudUsers++;
      if (row['IUD (years)'] !== null) {
        iudYearsSum += row['IUD (years)'];
        iudYearsCounts++;
      }
    });
    const percentIUD = (iudUsers / totalRecords) * 100;
    const avgIUDYears = iudYearsCounts > 0 ? iudYearsSum / iudYearsCounts : 0;
    
    // Calculate % of patients with abnormal test results
    let abnormalResults = 0;
    data.forEach(row => {
      if (row['Hinselmann'] === 1 || row['Schiller'] === 1 || row['Citology'] === 1) {
        abnormalResults++;
      }
    });
    const percentAbnormal = (abnormalResults / totalRecords) * 100;
    
    // Calculate STDs by age group for the bar chart
    const ageGroups = {
      '< 20': { count: 0, stds: 0 },
      '20-29': { count: 0, stds: 0 },
      '30-39': { count: 0, stds: 0 },
      '40-49': { count: 0, stds: 0 },
      '50+': { count: 0, stds: 0 }
    };
    
    data.forEach(row => {
      const age = row['Age'];
      let stdCount = 0;
      
      // Count STDs
      const stdFields = [
        'STDs:condylomatosis', 'STDs:cervical condylomatosis',
        'STDs:vaginal condylomatosis', 'STDs:vulvo-perineal condylomatosis',
        'STDs:syphilis', 'STDs:pelvic inflammatory disease',
        'STDs:genital herpes', 'STDs:molluscum contagiosum',
        'STDs:AIDS', 'STDs:HIV', 'STDs:Hepatitis B',
        'STDs:HPV'
      ];
      
      stdFields.forEach(field => {
        if (row[field] === 1) stdCount++;
      });
      
      // Assign to age group
      let ageGroup;
      if (age < 20) ageGroup = '< 20';
      else if (age >= 20 && age < 30) ageGroup = '20-29';
      else if (age >= 30 && age < 40) ageGroup = '30-39';
      else if (age >= 40 && age < 50) ageGroup = '40-49';
      else ageGroup = '50+';
      
      ageGroups[ageGroup].count++;
      ageGroups[ageGroup].stds += stdCount;
    });
    
    // Calculate average STDs per age group
    const stdsByAgeGroup = Object.keys(ageGroups).map(group => {
      return [
        group, 
        ageGroups[group].count > 0 ? ageGroups[group].stds / ageGroups[group].count : 0
      ];
    });
    
    // Calculate data for line chart: Smoking years vs Age
    const smokingData = data
      .filter(row => row['Smokes (years)'] !== null && row['Age'] !== null)
      .map(row => [row['Age'], row['Smokes (years)']]);
    
    // NEW VISUALIZATION: Test results distribution by age group
    const ageTestResults = {
      '< 20': { total: 0, positive: 0 },
      '20-29': { total: 0, positive: 0 },
      '30-39': { total: 0, positive: 0 },
      '40-49': { total: 0, positive: 0 },
      '50+': { total: 0, positive: 0 }
    };
    
    data.forEach(row => {
      const age = row['Age'];
      
      // Assign to age group
      let ageGroup;
      if (age < 20) ageGroup = '< 20';
      else if (age >= 20 && age < 30) ageGroup = '20-29';
      else if (age >= 30 && age < 40) ageGroup = '30-39';
      else if (age >= 40 && age < 50) ageGroup = '40-49';
      else ageGroup = '50+';
      
      ageTestResults[ageGroup].total++;
      
      if (row['Hinselmann'] === 1 || row['Schiller'] === 1 || row['Citology'] === 1) {
        ageTestResults[ageGroup].positive++;
      }
    });
    
    const positiveRatesByAge = [['Age Group', 'Positive Rate (%)']];
    Object.keys(ageTestResults).forEach(ageGroup => {
      const positiveRate = ageTestResults[ageGroup].total > 0 
        ? (ageTestResults[ageGroup].positive / ageTestResults[ageGroup].total) * 100 
        : 0;
      positiveRatesByAge.push([ageGroup, positiveRate]);
    });
    
    return {
      success: true,
      metrics: {
        totalRecords: totalRecords,
        percentSTDs: percentSTDs.toFixed(2),
        avgPartners: avgPartners.toFixed(2),
        avgFirstIntercourseAge: avgFirstIntercourseAge.toFixed(1),
        avgHormonalContraceptivesYears: avgHormonalContraceptivesYears.toFixed(1),
        percentIUD: percentIUD.toFixed(2),
        avgIUDYears: avgIUDYears.toFixed(1),
        percentAbnormal: percentAbnormal.toFixed(2)
      },
      chartData: {
        positiveRatesByAge: positiveRatesByAge,
        barChart: [['Age Group', 'Average Number of STDs']].concat(stdsByAgeGroup),
        lineChart: [['Age', 'Smoking Years']].concat(smokingData)
      }
    };
  } catch (error) {
    console.error('Error filtering data: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}