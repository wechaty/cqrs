import { classifyMap }  from '../classify/classify-map.js'
import * as events      from '../duck/actions/events.js'

export const {
  DongReceivedEvent,
  ErrorReceivedEvent,
  FriendshipReceivedEvent,
  HeartbeatReceivedEvent,
  LoginReceivedEvent,
  LogoutReceivedEvent,
  MessageReceivedEvent,
  ReadyReceivedEvent,
  ResetReceivedEvent,
  RoomInviteReceivedEvent,
  RoomJoinReceivedEvent,
  RoomLeaveReceivedEvent,
  RoomTopicReceivedEvent,
  ScanReceivedEvent,
  StartedEvent,
  StateActivatedEvent,
  StateInactivatedEvent,
  StoppedEvent,
} = classifyMap(events)
