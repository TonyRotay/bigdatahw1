const fs = require('fs')
const csv = require('csv-parser')

function getTimestamp(data) {
  return String((Number(Object.values(data)[0]) - 1) * 86400 + Number(Object.values(data)[1].slice(1)))
}

let Func = {

  h_values: ['31', '55', '80', '86'],

  allValues: [],

  avgspeedforh: async function getHAvgSpeed(h) {
    const avgSpeedValues = []
    for (let u = 1; u <= 20; u++) {
      let currentUser = []; // массив данных из одного файла
      try {
        await new Promise((res, rej) => {
          fs.createReadStream(`./data/userlog.h${h}.u${u}.csv`) // создание потока чтения
            .pipe(csv()) // парсинг csv-файла
            .on('data', (data) => {
              currentUser.push(Number(data['\tSpeed'].slice(1)))
            })
            .on('error', rej)
            .on('end', () => {
              const avgSpeed = currentUser.sort((a, b) => (b - a))[0]
              avgSpeedValues.push(avgSpeed)
              // calculateAverageSpeed(currentUser, this.allValues) // функция обработки полученных данных
              res()
            })
        })
      } catch (e) { console.error(e) }
    }

    console.log(`h=${h} >>> `, avgSpeedValues.reduce((prev, curr) => (prev + curr) / 2, 0))
  },

  init: function () {
    for (let h of this.h_values) {
      this.avgspeedforh(h)
    }
  },


}
Func.init()