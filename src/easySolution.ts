/*
 * Данное решение я нашел в недрах Stack Overflow, не буду присваивать его себе, ведь это не честно.
 * Стоит отметить, что это одно из лучших решений, ведь что у windows, что у unix-like системах,
 * встроенный "sort" написан на C и невероятно оптимизирован. Данный встроенный в OC модуль подгружается
 * при первом запуске устройства (windows, mac, unix-like) и запущенный скрипт на NodeJS почти не потратит ОЗУ.
 *
 * Ссылка: https://stackoverflow.com/questions/63713652
 */

import { INPUT_FILE_PATH, OUTPUT_FILE_PATH } from './constants'
import { createWriteStream } from 'fs'
import { spawn } from 'child_process'

export default function easySolution() {
    const sortInputFile = spawn('sort', [INPUT_FILE_PATH])

    const outputWriteStream = createWriteStream(OUTPUT_FILE_PATH)

    sortInputFile.stdout.on('data', (data) => {
        outputWriteStream.write(data)
    })

    sortInputFile.on('exit', () => {
        outputWriteStream.end()
    })
}
