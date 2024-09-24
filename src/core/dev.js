
const { readExcel, sheetEachRow } = require('../utils/excelReader');
const { writeFileSync, cleanAltValues, extractTDK } = require('../utils/utils');
const path = require('node:path');
const { XLSX_FILE_PATH: xlsxPath, SHEET_NAME: sheetNameSet, DEV_JSON_PATH: devFilePath} =require('../global');
const { extractDataFromRow } = require('../index')
async function processExcelFile(filePath, sheetName, outputPath){
  try{
    const workSheet =await readExcel(filePath,sheetName)
    const data =await sheetEachRow(workSheet, extractDataFromRow)
    await writeFileSync(outputPath, data)
    console.log('Data written to file successfully.');
  }catch(error) {
    console.error('Error processing the file:', error);
  }
}

processExcelFile(xlsxPath, sheetNameSet, devFilePath);