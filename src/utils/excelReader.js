const ExcelJS = require('exceljs');
const { cleanAltValues, extractTDK } = require('./utils');

// 读取Excel文件
async function readExcel(filePath,sheetName){
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  console.log( workbook.worksheets.map((worksheet) => worksheet.name))
  // 获取指定的工作表
  const worksheet = workbook.getWorksheet(sheetName);
  if(!worksheet) {
    throw new Error(`Worksheet '${sheetName}' not found`);
  }
  return worksheet
}
// 读取指定表所有行
function sheetEachRow(workSheet,callback){
  const result = []
  workSheet.eachRow((row, rowNumber)=>{
    if (rowNumber > 1) { // 跳过标题行
      const data = callback(row)
      result.push(data)
    }
  })
  return result
}

module.exports = {
  readExcel,
  sheetEachRow
};