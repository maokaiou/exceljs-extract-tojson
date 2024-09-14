const fs = require('node:fs');
const path = require('node:path');
const levenshtein = require('fast-levenshtein');
const { readExcel,sheetEachRow } =require('./utils/excelReader')
const { cleanAltValues,readJsonFile, writeFileSync, updateExistingData} =require('./utils/utils')
const { XLSX_FILE_PATH:xlsxPath ,SHEET_NAME: sheetName, EXISTING_JSON_PATH: existingJsonPath } =require('./config')

function isSimilar(str1, str2, threshold = 0.6) {
  const distance = levenshtein.get(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = 1 - (distance / maxLength);
  return similarity >= threshold;
}

// excle行数据生成json对象
function extractTagFromRow(row){
  const page = row.getCell(1).value;
  const h2Tag = row.getCell(5).value;
  let h3Tag = row.getCell(6).value.split('\n');
  h3Tag=cleanAltValues(h3Tag) || []
  return {
    "型号": page,
    "h2": h2Tag,
    "h3": h3Tag
  }
}

function operationExcelRow(existingItem, newItem){ 
  existingItem['主要特征']['核心卖点'] = existingItem['主要特征']['核心卖点'].map((item) => {
    if (isSimilar(item, newItem.h2)) {
      return `<h2>${item}</h2>`;
    } else if (newItem.h3.some(h3Item => isSimilar(item, h3Item))) {
      return `<h3>${item}</h3>`;
    } else {
      return item;
    }
  });
}
async function addTag(filePath,sheetName,existingJsonPath){
  const workSheet =await readExcel(filePath,sheetName)
  const newdata =await sheetEachRow(workSheet, extractTagFromRow)
  // 读取文件
  const existingData = await readJsonFile(existingJsonPath)
  console.log(newdata)
  const updatedExistingData = updateExistingData(existingData,newdata,operationExcelRow)
  await writeFileSync(existingJsonPath,updatedExistingData)
}

addTag(xlsxPath,sheetName, existingJsonPath)