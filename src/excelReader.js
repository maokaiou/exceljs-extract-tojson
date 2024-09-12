const ExcelJS = require('exceljs');
const { cleanAltValues, extractTDK } = require('./utils');

// 读取Excel文件
async function readExcel(filePath,sheetName){
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // 获取指定的工作表
  const worksheet = workbook.getWorksheet(sheetName);
  if(!worksheet) {
    throw new Error(`Worksheet '${sheetName}' not found`);
  }
  return worksheet
}


// 处理数据并提取所需内容
function extractDataFromRow(worksheet){
  const result = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // 跳过标题行
      const page = row.getCell(1).value;   
      const tdk = row.getCell(3).value.richText;
      let alt = row.getCell(8).value.split('\n') || [];
      alt = cleanAltValues(alt);
      const extractText = tdk ? extractTDK(tdk) : [];
      // 构建JSON对象
      const data = {
        "型号": page,
        "ssr":{
          "title":extractText[0],
          "keywords":extractText[1],
          "desc":extractText[2]
        },
        "imgAltValue":alt
      };
      result.push(data);
    }
  })
  return result
}

module.exports = {
  readExcel,
  extractDataFromRow
};