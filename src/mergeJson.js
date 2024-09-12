const fs = require('node:fs/promises');
const path = require('node:path');
const { writeFileSync, readJsonFile } = require('./utils');
// 1、读取生成的 JSON 文件。
// 2、读取本地存在的 JSON 文件。
// 3、比较两个 JSON 文件中的数据。
// 4、合并数据。



function mergeJsonData(newData, existingData) {
  const mergedData = existingData.map(existingItem => {
    const newItem = newData.find(item => item.型号 === existingItem.型号);
    if (newItem) {
      // 更新 ssr 属性
      if (newItem.ssr) {
        existingItem.ssr = existingItem.ssr || {};
        Object.assign(existingItem.ssr, newItem.ssr);
      }
      // 更新 imgAltValue 属性
      existingItem.imgAltValue = newItem.imgAltValue || [];
    }
    return existingItem;
  });
  return mergedData;
}

async function main(newFilePath, existingFilePath) {
  try {
    const newData = await readJsonFile(newFilePath);
    const existingData = await readJsonFile(existingFilePath);
    
    const mergedData = mergeJsonData(newData, existingData);
    
    await writeFileSync(existingFilePath, mergedData);
    console.log('Data merged and written to file successfully.');
  } catch (error) {
    console.error('Error merging files:', error);
  }
}
// 使用示例
const sheetName ='工程机'
const newFilePath = `../json/new-json/${sheetName}.json`;
const existingFilePath = `../json/local-json/${sheetName}.json`;
main(newFilePath, existingFilePath);