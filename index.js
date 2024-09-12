const ExcelJS = require('exceljs');
const fs = require('node:fs');
// 读取Excel文件
async function readExcelAndExtractData(filePath,sheetName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  // 初始化结果数组
  const result = [];
  // 打印所有工作表名称
  workbook.eachSheet((worksheet, sheetId)=> {
    if(sheetId===16){
      const worksheet = workbook.getWorksheet(16);
       // 遍历每一行
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // 跳过标题行
          const page = row.getCell(1).value;
          
          const tdk = row.getCell(3).value.richText;
          let alt = row.getCell(8).value.split('\n');
        
          let extractText =[]
          if(alt){
              // 处理 imgAltValue
            const cleanedImgAltValues = alt.map(value => {
              const cleanedValue = value.replace(/^\d+、/, '').trim(); // 去掉序号
              return cleanedValue;
            });
            alt=cleanedImgAltValues
          }
          if(tdk){
            const texts=tdk.map((ele,item)=>{
              return ele.text
            }).join(' ').split('\n')  
            extractText =texts.map((ele)=>{
              return ele.split('：').slice(1)[0].trim()
            })
          }
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
          result.push(data);
        }
      });
    } 
  });
  //  // 检查工作表是否存在
  //  if (!worksheet) {
  //   throw new Error('Worksheet not found');
  // }
  return result;
}

// 使用示例
const filePath = './1.xlsx'; // 替换为你的文件路径
const sheetName = '工程机'; // 替换为表名
readExcelAndExtractData(filePath,sheetName)
  .then(data => {
    console.log(JSON.stringify(data, null, 2)); // 打印结果
    try {
      fs.writeFileSync(`./json/${sheetName}.json`, JSON.stringify(data, null, 2));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  })
  .catch(error => {
    console.error('Error reading the file:', error);
  });