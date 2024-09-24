const path = require('node:path');

// const SHEET_NAME = process.argv[2].trim()
const SHEET_NAME = "高端商务系列"
const HOME =  process.env.HOME || process.env.USERPROFILE

module.exports = {
  HOME,
  SHEET_NAME,
  XLSX_FILE_PATH: path.join(__dirname, '../xlsx/2.xlsx'),
  EXISTING_JSON_PATH: path.join(__dirname, '../json/existing-json', `${SHEET_NAME}.json`), // 测试写入数据的路径
  DEV_JSON_PATH: path.join(__dirname, '../json/dev-json', `${SHEET_NAME}.json`),
  DESKTOP_JSON_PATH: path.join(HOME, 'Desktop', 'ricoh', 'ricoh-data', 'json', '产品中心', `${SHEET_NAME}.json`) // 实际需要写入数据的路径
};