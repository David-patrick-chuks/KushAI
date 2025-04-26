import type { Command } from "commander"
import { registerGenerateCommand } from "./generate"
import { registerImageCommand } from "./image"
import { registerVideoCommand } from "./video"
import { registerAudioCommand } from "./audio"
import { registerVideoUnderstandCommand } from "./video-understand"
import { registerImageUnderstandCommand } from "./image-understand"
import { registerMultimodalCommand } from "./multimodal"
import { registerStructuredCommand } from "./structured"
import { registerFunctionCallCommand } from "./function-call"
import { registerConfigCommand } from "./config"
import { registerModelsCommand } from "./models"

/**
 * Registers all CLI commands
 * @param program The Commander program instance
 */
export function registerCommands(program: Command): void {
  registerGenerateCommand(program)
  registerImageCommand(program)
  registerVideoCommand(program)
  registerAudioCommand(program)
  registerVideoUnderstandCommand(program)
  registerImageUnderstandCommand(program)
  registerMultimodalCommand(program)
  registerStructuredCommand(program)
  registerFunctionCallCommand(program)
  registerConfigCommand(program)
  registerModelsCommand(program)
}
