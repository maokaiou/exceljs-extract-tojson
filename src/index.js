
const { readExcel, extractDataFromRow } = require('./excelReader');
const { writeFileSync } = require('./utils');

async function processExcelFile(filePath, sheetName, outputPath){
  try{
    const workSheet =await readExcel(filePath,sheetName)
    const data =await extractDataFromRow(workSheet)
    await writeFileSync(outputPath, data)
    console.log('Data written to file successfully.');
  }catch(error) {
    console.error('Error processing the file:', error);
  }
}
// 使用示例
const filePath = './xlsx/1.xlsx';
const sheetName = '工程机';
const outputPath = `./json/${sheetName}.json`;

processExcelFile(filePath, sheetName, outputPath);