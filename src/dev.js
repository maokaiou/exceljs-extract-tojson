
const { readExcel, extractDataFromRow } = require('./excelReader');
const { writeFileSync } = require('./utils');
const path = require('node:path');
async function processExcelFile(filePath, sheetName, outputPath){
  try{
    const workSheet =await readExcel(filePath,sheetName)
    console.log('workSheet',workSheet)
    const data =await extractDataFromRow(workSheet)
    await writeFileSync(outputPath, data)
    console.log('Data written to file successfully.');
  }catch(error) {
    console.error('Error processing the file:', error);
  }
}
// 使用示例
const sheetName = '工程机';
const filePath = path.join(__dirname, '../xlsx/2.xlsx')
const outputPath = path.join(__dirname, '../json/new-json', `${sheetName}.json`);

processExcelFile(filePath, sheetName, outputPath);