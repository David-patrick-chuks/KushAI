import type { Command } from "commander"
import ora from "ora"
import chalk from "chalk"
import { Kushai } from "@kushai/sdk"
import { getApiKey, getBaseUrl, hasValidApiKey } from "../config"
import { handleError } from "../utils"

/**
 * Registers the generate command
 * @param program The Commander program instance
 */
export function registerGenerateCommand(program: Command): void {
  program
    .command("generate")
    .description("Generate text from a prompt")
    .requiredOption("-p, --prompt <prompt>", "The prompt to generate text from")
    .option("-m, --model <model>", "Model to use (e.g., kush-2.0-pro)")
    .option("-t, --max-tokens <number>", "Maximum number of tokens to generate", Number.parseInt)
    .option("-T, --temperature <number>", "Sampling temperature (0-1)", Number.parseFloat)
    .option("-s, --stop <sequences...>", "Stop sequences")
    .action(async (options) => {
      try {
        // Check if API key is configured
        if (!hasValidApiKey()) {
          console.error(chalk.red("Error: API key not configured or invalid"))
          console.log(`Run ${chalk.cyan("kushai config set --api-key")} to set your API key`)
          process.exit(1)
        }

        const spinner = ora("Generating text...").start()

        // Create SDK instance
        const kushai = new Kushai(getApiKey()!, {
          baseURL: getBaseUrl(),
        })

        // Call the API
        const response = await kushai.generate({
          prompt: options.prompt,
          model: options.model,
          maxTokens: options.maxTokens,
          temperature: options.temperature,
          stopSequences: options.stop,
        })

        spinner.succeed("Text generated successfully")

        // Display the result
        console.log("\n" + chalk.green("Result:"))
        console.log(response.text)

        // Display model information
        console.log("\n" + chalk.blue("Model:"))
        console.log(chalk.blue(response.model))

        // Display usage information
        console.log("\n" + chalk.dim("Usage:"))
        console.log(chalk.dim(`Prompt tokens: ${response.usage.promptTokens}`))
        console.log(chalk.dim(`Completion tokens: ${response.usage.completionTokens}`))
        console.log(chalk.dim(`Total tokens: ${response.usage.totalTokens}`))
      } catch (error) {
        handleError(error)
      }
    })
}
