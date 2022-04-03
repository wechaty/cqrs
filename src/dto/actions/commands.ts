import * as duckCommands    from '../../duck/actions/commands/mod.js'
import { classifyMap }      from '../../classify/classify-map.js'

/**
 * Selective export `Command` only
 */
export const {
  DingCommand,
  ResetCommand,
  NopCommand,
  SendMessageCommand,
  StartCommand,
  StopCommand,
} = classifyMap(duckCommands)
