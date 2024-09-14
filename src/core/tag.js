const { readExcel,sheetEachRow } =require('../utils/excelReader')
const { readJsonFile, writeFileSync, updateExistingData} =require('../utils/utils')
const { extractTagFromRow, operationExcelRow } = require('../index')
const { XLSX_FILE_PATH:xlsxPath ,SHEET_NAME: sheetName, EXISTING_JSON_PATH: existingJsonPath } =require('../global')

async function addTag(filePath,sheetName,existingJsonPath){
  const workSheet =await readExcel(filePath,sheetName)
  const newdata =await sheetEachRow(workSheet, extractTagFromRow)
  // 读取文件
  const existingData = await readJsonFile(existingJsonPath)
  const updatedExistingData = updateExistingData(existingData,newdata,operationExcelRow)
  await writeFileSync(existingJsonPath,updatedExistingData)
}

addTag(xlsxPath,sheetName, existingJsonPath)