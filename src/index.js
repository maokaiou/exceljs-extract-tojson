const { readExcel, sheetEachRow } = require('./utils/excelReader');
const { cleanAltValues, extractTDK, isSimilar } = require('./utils/utils');
const levenshtein = require('fast-levenshtein');
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

// 合并数据。
function mergeJsonData(existingItem, newItem) {
  // 更新 ssr 属性
  if (newItem.ssr) {
    existingItem.ssr = existingItem.ssr || {};
    Object.assign(existingItem.ssr, newItem.ssr);
}
  // 更新 imgAltValue 属性
  existingItem.imgAltValue = newItem.imgAltValue || [];
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
module.exports= { 
  extractDataFromRow,
  mergeJsonData,
  extractTagFromRow,
  operationExcelRow
}