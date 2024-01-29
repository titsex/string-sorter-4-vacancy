const COLORS: Record<string, string> = {
    NONE: '\x1b[0',
    CYAN: '\x1b[36',
    RED: '\x1b[31',
    YELLOW: '\x1b[33',
}

const FONT_WEIGHT: Record<string, string> = {
    NONE: 'm',
    BOLD: ';1m',
}

class Logger {
    private static errorLogPrefix: string = `[${COLORS.RED + FONT_WEIGHT.BOLD}ERROR${COLORS.NONE + FONT_WEIGHT.NONE}]`
    private static infoLogPrefix: string = `[${COLORS.CYAN + FONT_WEIGHT.BOLD}INFO${COLORS.NONE + FONT_WEIGHT.NONE}]`

    private static time(): string {
        return `${COLORS.YELLOW + FONT_WEIGHT.NONE}${new Date().toLocaleTimeString()}${COLORS.NONE}${FONT_WEIGHT.BOLD}`
    }

    public static info(...data: unknown[]): void {
        console.log(`${Logger.infoLogPrefix} ${Logger.time()}`, ...data)
    }

    public static error(...data: unknown[]): void {
        console.log(`${Logger.errorLogPrefix} ${Logger.time()}`, ...data)
    }
}

export default Logger
