const { readExcel,extractTagFromRow } =require('./excelReader')
const { cleanAltValues,readJsonFile, writeFileSync} =require('./utils')
const path = require('node:path');
const levenshtein = require('fast-levenshtein');
function isSimilar(str1, str2, threshold = 0.6) {
  const distance = levenshtein.get(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = 1 - (distance / maxLength);
  return similarity >= threshold;
}
function updateExistingData(existingData, newData) {
  existingData.map((existingItem) => {
    const newItem = newData.find(item => item.型号 === existingItem.型号);
    if (newItem) {
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
  });
  return existingData;
}
async function addTag(filePath,sheetName,existingFilePath){
  const workSheet =await readExcel(filePath,sheetName)
  const newdata =await extractTagFromRow(workSheet)
  // 读取文件
  const existingData = await readJsonFile(existingFilePath)
  const updatedExistingData = updateExistingData(existingData,newdata)
  await writeFileSync(existingFilePath,updatedExistingData)
}

// 使用示例
const sheetName = '工程机';
const filePath = path.join(__dirname, '../xlsx/2.xlsx')
const outputPath = path.join(__dirname, '../json/new-json', `${sheetName}.json`);
const existingFilePath = path.join(__dirname, '../json/local-json', `${sheetName}.json`);
addTag(filePath,sheetName,existingFilePath)