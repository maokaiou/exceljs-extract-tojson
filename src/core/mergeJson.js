const { writeFileSync, readJsonFile, updateExistingData } = require('../utils/utils');
const { XLSX_FILE_PATH: xlsxPath, DEV_JSON_PATH: devFilePath, DESKTOP_JSON_PATH: existingJsonPath } =require('../global');
const { mergeJsonData } = require('../index')
// 1、读取生成的 JSON 文件。
// 2、读取本地存在的 JSON 文件。
// 3、比较两个 JSON 文件中的数据。
// 4、合并数据。
async function main(devFilePath, existingFilePath) {
  try {
    const devData = await readJsonFile(devFilePath);
    const existingData = await readJsonFile(existingFilePath);
    const mergedData = updateExistingData(existingData,devData,mergeJsonData);
    await writeFileSync(existingFilePath, mergedData);
    console.log('Data merged and written to file successfully.');
  } catch (error) {
    console.error('Error merging files:', error);
  }
}
main(devFilePath, existingJsonPath);