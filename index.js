const express = require('express');
const app = express();
const fs = require('fs');
const ExcelJS = require('exceljs');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx.readFile('ArchivoCom.xlsx')
    .then(() => {
      const worksheet = workbook.getWorksheet(1);
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const [codigo, descripcion, precio, marca, varValue] = row.values.slice(1, 6);
          const varColor = getVarColor(varValue);

          data.push({ codigo, descripcion, precio, marca, varValue, varColor });
        }
      });

      res.render('index', { data });
    })
    .catch(error => {
      console.error(error);
      res.send('Error al leer el archivo Excel');
    });
});

function getVarColor(varValue) {
  if (varValue === 'I') return 'green';
  if (varValue === 'M') return 'red';
  if (varValue === 'N') return 'blue';
  return 'black';
}

app.get('/download', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx.readFile('ArchivoCom.xlsx')
    .then(() => {
      const worksheet = workbook.getWorksheet(1);
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const [codigo, descripcion, precio, marca, varValue] = row.values.slice(1, 6);
          const varColor = getVarColor(varValue);

          data.push({ codigo, descripcion, precio, marca, varValue, varColor });
        }
      });

      const tempFilePath = `${__dirname}/temp_lista_precios.xlsx`;
      workbook.xlsx.writeFile(tempFilePath)
        .then(() => {
          res.download(tempFilePath, 'lista_precios.xlsx', () => {
            fs.unlink(tempFilePath, (error) => {
              if (error) {
                console.error('Error al eliminar el archivo temporal:', error);
              }
            });
          });
        })
        .catch(error => {
          console.error('Error al guardar el archivo Excel:', error);
          res.send('Error al generar el archivo Excel');
        });
    })
    .catch(error => {
      console.error('Error al leer el archivo Excel:', error);
      res.send('Error al leer el archivo Excel');
    });
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
