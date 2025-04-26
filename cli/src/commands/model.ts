import type { Command } from "commander"
import chalk from "chalk"
import Table from "cli-table3"
import { Kushai } from "@kushai/sdk"
import { getApiKey, getBaseUrl, hasValidApiKey } from "../config"
import { handleError } from "../utils"

/**
 * Registers the models command
 * @param program The Commander program instance
 */
export function registerModelsCommand(program: Command): void {
  const modelsCommand = program.command("models").description("List and manage models")

  // List all models
  modelsCommand
    .command("list")
    .description("List all available models")
    .option("-c, --capability <capability>", "Filter by capability")
    .action(async (options) => {
      try {
        // Check if API key is configured
        if (!hasValidApiKey()) {
          console.error(chalk.red("Error: API key not configured or invalid"))
          console.log(`Run ${chalk.cyan("kushai config set --api-key")} to set your API key`)
          process.exit(1)
        }

        // Create SDK instance
        const kushai = new Kushai(getApiKey()!, {
          baseURL: getBaseUrl(),
        })

        // Get models
        let models
        if (options.capability) {
          models = await kushai.getModelsWithCapability(options.capability)
        } else {
          models = await kushai.listModels()
        }

        // Create a table for display
        const table = new Table({
          head: [
            chalk.cyan("ID"),
            chalk.cyan("Name"),
            chalk.cyan("Version"),
            chalk.cyan("Capabilities"),
            chalk.cyan("Context"),
            chalk.cyan("Status"),
          ],
          colWidths: [20, 25, 10, 30, 10, 15],
        })

        // Add rows to the table
        models.forEach((model) => {
          const status = []
          if (model.beta) status.push(chalk.yellow("BETA"))
          if (model.deprecated) status.push(chalk.red("DEPRECATED"))
          if (!model.beta && !model.deprecated) status.push(chalk.green("STABLE"))

          table.push([
            model.id,
            model.name,
            model.version,
            model.capabilities.join(", "),
            model.maxContext.toLocaleString(),
            status.join(", "),
          ])
        })

        // Display the table
        console.log(table.toString())
        console.log(`\nTotal models: ${models.length}`)

        if (options.capability) {
          console.log(chalk.blue(`Filtered by capability: ${options.capability}`))
        }
      } catch (error) {
        handleError(error)
      }
    })

  // Get details for a specific model
  modelsCommand
    .command("info <modelId>")
    .description("Get detailed information about a model")
    .action(async (modelId) => {
      try {
        // Check if API key is configured
        if (!hasValidApiKey()) {
          console.error(chalk.red("Error: API key not configured or invalid"))
          console.log(`Run ${chalk.cyan("kushai config set --api-key")} to set your API key`)
          process.exit(1)
        }

        // Create SDK instance
        const kushai = new Kushai(getApiKey()!, {
          baseURL: getBaseUrl(),
        })

        // Get model details
        const model = await kushai.getModel(modelId)

        // Display model information
        console.log(chalk.bold("\nModel Information:"))
        console.log(chalk.cyan("ID:") + ` ${model.id}`)
        console.log(chalk.cyan("Name:") + ` ${model.name}`)
        console.log(chalk.cyan("Provider:") + ` ${model.provider}`)
        console.log(chalk.cyan("Version:") + ` ${model.version}`)
        console.log(chalk.cyan("Description:") + ` ${model.description}`)
        console.log(chalk.cyan("Max Context:") + ` ${model.maxContext.toLocaleString()} tokens`)
        console.log(chalk.cyan("Capabilities:") + ` ${model.capabilities.join(", ")}`)

        console.log(chalk.bold("\nPricing:"))
        console.log(chalk.cyan("Input:") + ` $${model.pricing.inputPerMillionTokens} per million tokens`)
        console.log(chalk.cyan("Output:") + ` $${model.pricing.outputPerMillionTokens} per million tokens`)
        console.log(chalk.cyan("Currency:") + ` ${model.pricing.currency}`)

        if (model.beta) {
          console.log(chalk.yellow("\nThis model is in BETA and may change without notice."))
        }

        if (model.deprecated) {
          console.log(chalk.red("\nThis model is DEPRECATED and will be removed in the future."))
        }
      } catch (error) {
        handleError(error)
      }
    })
}
