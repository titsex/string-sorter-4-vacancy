import Logger from '@class/Logger'

// import mediumSolution from './mediumSolution'
import easySolution from './easySolution'
// import hackSolution from './hackSolution'

import { CHUNK_FOLDER_PATH, INPUT_FILE_PATH, OUTPUT_FILE_PATH } from './constants'
import { existsSync, unlinkSync, rmSync } from 'fs'

if (existsSync(OUTPUT_FILE_PATH)) unlinkSync(OUTPUT_FILE_PATH)
if (existsSync(CHUNK_FOLDER_PATH)) rmSync(CHUNK_FOLDER_PATH, { recursive: true })

if (!existsSync(INPUT_FILE_PATH)) throw new Error(`Не найден файл: ${INPUT_FILE_PATH}`)

// P.S !!! я проверял затраты ОЗУ ограничивая ноде собственно ОЗУ,
// node --trace_gc --max-old-space-size=20
// для 300мб файла и для 600мб файла потребление никак не увеличивалось.

// mediumSolution() // средний по скорости, константное ОЗУ.
easySolution() // самый быстрый по скорости, константное ОЗУ.
// hackSolution() // самый медленный, так как line by line отправляется query запрос базе.

process.on('exit', () => Logger.info('Сортировка успешно завершена'))
