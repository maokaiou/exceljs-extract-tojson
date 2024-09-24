const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const levenshtein = require('fast-levenshtein');
/**
 * 清洗alt值
 * @param {Array<string>} alt - 原始alt值数组
 * @returns {Array<string>} 清洗后的alt值数组
 */
function cleanAltValues(alt) {
  return alt.map(value => value.replace(/^\d+、/, '').trim());
}

function extractTDK(tdk) {
  const texts=tdk.map((ele,item)=>{
    return ele.text
  }).join(' ').split('\n')  
  return texts.map((ele)=>{
    // 分割字符串并获取第二部分
    const parts = ele.split('：');
    const value = parts.length > 1 ? parts[1].trim() : '';
    return value
  })
}

async function readJsonFile(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
}
// 写入 JSON 文件
async function writeFileSync(writePath,content) {
  try {
    await fs.writeFile(`${writePath}`, JSON.stringify(content, null, 2));
  } catch (err) {
    console.log(err);
  }
}

function updateExistingData(existingData, newData,callback) {
  existingData.map((existingItem) => {
    const newItem = newData.find(item => item.型号 === existingItem.型号);
    if (newItem) {
      callback(existingItem,newItem)
    }
  });
  return existingData;
}

function isSimilar(str1, str2, threshold = 0.39) {
  const distance = levenshtein.get(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = 1 - (distance / maxLength);
  return similarity >= threshold;
}

module.exports = {
  cleanAltValues,
  extractTDK,
  writeFileSync,
  readJsonFile,
  updateExistingData,
  isSimilar
}