/*
 * Данное решение мне предложили в шутку, когда я создал тред на reddit.com
 * P.S: данный тред стал мега популярным, около 20к просмотров, 92% рейтинга.
 * не считаю чем-то неправильным взаимодействие с сообществом, лишь хотел больше мнений услышать.
 * и вот мнение, которое там меня улыбнуло и я добавлю его сюда - использовать субд.
 * чанками загрузить строки в базу и запросить уже отфильтрованно.
 *
 * P.S.s: я бы мог сделать tcp соединение и заморочится с подключением к базе на чистом nodejs,
 * но считаю это глупой затеей, когда есть драйверы.
 *
 * !!! Из-за комментариев код может выглядеть не очень хорошо.
 *
 * Ссылка: https://www.reddit.com/r/node/comments/1ac6scw/comment/kjski69
 */

import { INPUT_FILE_PATH, OUTPUT_FILE_PATH } from './constants'
import { createReadStream, createWriteStream } from 'fs'
import { Client } from 'pg'
import { createInterface } from 'readline'

const CLIENT = new Client({
    host: process.env.HOST,
    port: +process.env.PORT!,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
})
export default async function hackSolution() {
    await CLIENT.connect()

    // удаляем таблицу.
    await CLIENT.query('DROP TABLE IF EXISTS stringSorting;')

    // создаем таблицу.
    await CLIENT.query('CREATE TABLE IF NOT EXISTS stringSorting (i serial primary key, line VARCHAR);')

    // создаем стримы чтения и записи входного и итогового файла

    const readFileStream = createReadStream(INPUT_FILE_PATH, {
        encoding: 'utf-8',
    })

    const writeFileStream = createWriteStream(OUTPUT_FILE_PATH, {
        encoding: 'utf-8',
    })

    const readlineInterface = createInterface({
        input: readFileStream,
        crlfDelay: Infinity,
    })

    for await (const line of readlineInterface) {
        await CLIENT.query(`INSERT INTO stringSorting(line) VALUES($1)`, [line])
    }

    readFileStream.close()
    readlineInterface.close()

    // получаем кол-во строк
    const { rows } = await CLIENT.query('SELECT COUNT(*) FROM stringSorting;')
    let count = +rows[0].count

    const limit = 500
    let offset = 0

    // получаем по 500 записей в отсортированном виде и записываем в итоговый файл.
    while (count > 0) {
        count -= limit
        offset += limit

        const { rows } = await CLIENT.query(`SELECT line FROM stringSorting ORDER BY line ASC LIMIT $1 OFFSET $2;`, [
            limit,
            offset,
        ])

        for (const row of rows) {
            writeFileStream.write(row.line + '\r\n', () => {
                if (count < 0) {
                    process.exit()
                }
            })
        }
    }
}
