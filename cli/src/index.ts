#!/usr/bin/env node
import { Command } from "commander"
import chalk from "chalk"
import { version } from "../package.json"
import { registerCommands } from "./commands"
import { loadConfig, saveConfig } from "./config"

// Create the CLI program
const program = new Command()

// Set basic information
program.name("kushai").description("Kushai AI command-line interface").version(version)

// Add global options
program
  .option("-k, --api-key <key>", "Kushai API key")
  .option("--base-url <url>", "Custom API base URL")
  .option("--debug", "Enable debug mode")

// Register all commands
registerCommands(program)

// Handle global options
program.hook("preAction", (thisCommand) => {
  const options = thisCommand.opts()
  const config = loadConfig()

  // Set API key from command line or config
  if (options.apiKey) {
    config.apiKey = options.apiKey
    saveConfig(config)
  }

  // Set base URL from command line or config
  if (options.baseUrl) {
    config.baseUrl = options.baseUrl
    saveConfig(config)
  }

  // Enable debug mode if requested
  if (options.debug) {
    process.env.DEBUG = "true"
  }
})

// Add help information
program.addHelpText(
  "after",
  `
Examples:
  $ ${chalk.cyan("kushai generate")} --prompt "Explain quantum computing"
  $ ${chalk.cyan("kushai image")} --prompt "A futuristic city"
  $ ${chalk.cyan("kushai config")} set --api-key "your-api-key"

For more information, visit ${chalk.underline("https://docs.kushai.com")}
`,
)

// Parse command line arguments
program.parse()

// If no arguments provided, show help
if (process.argv.length <= 2) {
  program.help()
}
