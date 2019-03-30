const csv = require('csv-parser');  
const fs = require('fs');
var i = new Number(0);
fs.createReadStream('contacts.csv')  
  .pipe(csv())
  .on('data', (row) => {
    var name = row.Name;
    var number = row['Phone 1 - Value'];
    if(name.slice(name.length-9,name.length)=='Classmate')
    {
      //console.log("LOG : CLASSMATE DETECTED...:")
      console.log('Classmate number :'+i)
      i = i + 1;
      console.log(name)
      console.log(number);
      var k = 0;
      while(number[k]!=':' && k<number.length){
        k = k + 1;
      }
      number = number.slice(0,k);
      if(number[0]!='+')
      {
        console.log('Adding +91 ...')
        number = '+91'+number;
      }
      console.log("Changed number : "+number+"\n");
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });