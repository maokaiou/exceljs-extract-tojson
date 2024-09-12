const fs = require('node:fs/promises');

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
    return ele.split('：').slice(1)[0].trim()
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

module.exports = {
  cleanAltValues,
  extractTDK,
  writeFileSync,
  readJsonFile
}