import type { Command } from "commander"
import ora from "ora"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { Kushai } from "@kushai/sdk"
import { getApiKey, getBaseUrl, hasValidApiKey } from "../config"
import { handleError } from "../utils"

/**
 * Registers the image command
 * @param program The Commander program instance
 */
export function registerImageCommand(program: Command): void {
  program
    .command("image")
    .description("Generate images from a prompt")
    .requiredOption("-p, --prompt <prompt>", "The prompt to generate images from")
    .option("-m, --model <model>", "Model to use (e.g., kush-2.5-creative)")
    .option("-w, --width <number>", "Image width in pixels (256-2048)", Number.parseInt)
    .option("-h, --height <number>", "Image height in pixels (256-2048)", Number.parseInt)
    .option("-n, --number <count>", "Number of images to generate (1-4)", Number.parseInt)
    .option("-s, --style <style>", "Style to apply to the generated images")
    .option("--negative <prompt>", "Negative prompt - what to exclude from the image")
    .option("-o, --output <directory>", "Directory to save images to")
    .action(async (options) => {
      try {
        // Check if API key is configured
        if (!hasValidApiKey()) {
          console.error(chalk.red("Error: API key not configured or invalid"))
          console.log(`Run ${chalk.cyan("kushai config set --api-key")} to set your API key`)
          process.exit(1)
        }

        const spinner = ora("Generating images...").start()

        // Create SDK instance
        const kushai = new Kushai(getApiKey()!, {
          baseURL: getBaseUrl(),
        })

        // Call the API
        const response = await kushai.generateImage({
          prompt: options.prompt,
          model: options.model,
          width: options.width,
          height: options.height,
          numberOfImages: options.number,
          style: options.style,
          negativePrompt: options.negative,
        })

        spinner.succeed(`Generated ${response.images.length} image(s) successfully`)

        // Save images if output directory is specified
        if (options.output) {
          const outputDir = path.resolve(options.output)

          // Create directory if it doesn't exist
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
          }

          // Save each image
          for (let i = 0; i < response.images.length; i++) {
            const imageData = response.images[i]
            const imageBuffer = Buffer.from(imageData.split(",")[1], "base64")
            const filename = path.join(outputDir, `image_${Date.now()}_${i}.png`)

            fs.writeFileSync(filename, imageBuffer)
            console.log(chalk.green(`Saved image to ${filename}`))
          }
        } else {
          // Display the result
          console.log("\n" + chalk.green("Result:"))
          console.log(`Generated ${response.images.length} image(s)`)
          console.log(chalk.dim("Images are returned as base64 data URLs"))
        }

        // Display model information
        console.log("\n" + chalk.blue("Model:"))
        console.log(chalk.blue(response.model))

        // Display usage information
        console.log("\n" + chalk.dim("Usage:"))
        console.log(chalk.dim(`Prompt tokens: ${response.usage.promptTokens}`))
        console.log(chalk.dim(`Total tokens: ${response.usage.totalTokens}`))
      } catch (error) {
        handleError(error)
      }
    })
}
