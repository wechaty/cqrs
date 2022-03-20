import { classifyMap }  from '../classify/classify-map.js'
import * as commands    from '../duck/actions/commands.js'

export const {
  DingCommand,
  ResetCommand,
  SendMessageCommand,
  StartCommand,
  StopCommand,
} = classifyMap(commands)
