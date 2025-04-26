import chalk from "chalk"

/**
 * Handles errors in CLI commands
 * @param error The error to handle
 */
export function handleError(error: unknown): void {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const { code, message, status } = error as { code: string; message: string; status?: number }
    console.error(chalk.red(`Error (${code}${status ? ` - ${status}` : ""}): ${message}`))
  } else if (error instanceof Error) {
    console.error(chalk.red(`Error: ${error.message}`))
  } else {
    console.error(chalk.red("An unknown error occurred"))
  }

  // Exit with error code
  process.exit(1)
}

/**
 * Validates that a file exists and is readable
 * @param filePath The path to the file
 * @returns True if the file exists and is readable
 */
export function validateFile(filePath: string): boolean {
  try {
    const fs = require("fs")
    fs.accessSync(filePath, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Reads a file as base64
 * @param filePath The path to the file
 * @returns The file content as base64
 */
export function readFileAsBase64(filePath: string): string {
  const fs = require("fs")
  const buffer = fs.readFileSync(filePath)
  return buffer.toString("base64")
}
