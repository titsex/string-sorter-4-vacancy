/*
 * Данное решение я придумал сам. Здесь у нас выходит константная затрата ОЗУ.
 * Суть в том, что я дроблю большой текстовый файл на чанки.
 * Описывать всё здесь не буду, следуйте комментариям ниже.
 * !!! Из-за комментариев код может выглядеть не очень хорошо.
 */

import { createReadStream, createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs'
import { CHUNK_FOLDER_PATH, INPUT_FILE_PATH, OUTPUT_FILE_PATH } from './constants'
import { join } from 'path'

const createAppendStream = (path: string) => createWriteStream(path, { encoding: 'utf-8', flags: 'a' })

export default function mediumSolution() {
    if (!existsSync(CHUNK_FOLDER_PATH)) mkdirSync(CHUNK_FOLDER_PATH)

    // создаем стримы чтения и записи входного и итогового файла

    const readFileStream = createReadStream(INPUT_FILE_PATH, {
        encoding: 'utf-8',
    })

    const writeFileStream = createWriteStream(OUTPUT_FILE_PATH, {
        encoding: 'utf-8',
    })

    const streams = new Map<string, WriteStream>()
    const isNextLine = new RegExp('\\r\\n')

    // наш стрим чтения входного файла возвращает чанки по 64кб (так указано в документации NodeJS)
    readFileStream.on('data', async (chunk: string) => {
        // учитываем перенос строк, я предположил, что мы сортируем строчку за строчкой.
        const lines = chunk.split(isNextLine).filter(Boolean)

        for (const line of lines) {
            const chunkFileName = line.slice(0, 2)
            const chunkFileStream = streams.get(chunkFileName)

            // самый интересный момент, где мы дробим на чанки наш входной файл.
            // и обязательно создаем стрим записи с флагом a (append), чтобы не перезаписывать предыдущие строки.
            // и обязательно сохраняем наш стрим в Map, чтобы каждый раз его не открывать.
            // позже, когда мы всё разобьем на чанки, мы удалим наш Map.

            if (!chunkFileStream) {
                const pathToChunkFile = join(CHUNK_FOLDER_PATH, `${chunkFileName}.txt`)
                streams.set(chunkFileName, createAppendStream(pathToChunkFile))
            } else chunkFileStream.write(line + '\r\n')
        }
    })

    readFileStream.on('close', async () => {
        // когда наш стрим закрылся, составляем массив путей к нашим чанкам и сортируем его,
        // чтобы он был в алфавитном порядке.
        const chunkFilesPaths = Array.from(streams.keys())
            .sort()
            .map((filename) => join(CHUNK_FOLDER_PATH, `${filename}.txt`))

        // очищаем Map со стримами записи наших чанков.
        streams.clear()

        for (const chunkFilePath of chunkFilesPaths) {
            // создаем стрим чтения каждого чанка, сортируем встроенным методом и записываем в output.

            const chunkFileStream = createReadStream(chunkFilePath, { encoding: 'utf-8' })

            chunkFileStream.on('data', (chunk: string) => {
                // P.S: здесь можно невероятно сэкономить, не читая каждый чанк и сортируя его,
                // а используя системный sort как в easySolution.ts
                writeFileStream.write(chunk.split(isNextLine).sort().join('\r\n'))
            })
        }
    })
}
