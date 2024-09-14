
const { readExcel, sheetEachRow } = require('./utils/excelReader');
const { writeFileSync, cleanAltValues, extractTDK } = require('./utils/utils');
const path = require('node:path');
const { XLSX_FILE_PATH: xlsxPath, SHEET_NAME: sheetNameSet, DEV_JSON_PATH: devFilePath} =require('./config');

// 处理数据并提取所需内容
function extractDataFromRow(row){
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
  return data
}

async function processExcelFile(filePath, sheetName, outputPath){
  try{
    const workSheet =await readExcel(filePath,sheetName)
    const data =await sheetEachRow(workSheet, extractDataFromRow)
    console.log(data)
    await writeFileSync(outputPath, data)
    console.log('Data written to file successfully.');
  }catch(error) {
    console.error('Error processing the file:', error);
  }
}

processExcelFile(xlsxPath, sheetNameSet, devFilePath);