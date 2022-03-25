import * as PUPPET from 'wechaty-puppet'

export function isAttachment  (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.attatchment> { return sayable.type === PUPPET.types.Sayable.Attachment }
export function isAudio       (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.audio>       { return sayable.type === PUPPET.types.Sayable.Audio }
export function isContact     (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.contact>     { return sayable.type === PUPPET.types.Sayable.Contact }
export function isEmoticon    (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.emoticon>    { return sayable.type === PUPPET.types.Sayable.Emoticon }
export function isImage       (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.image>       { return sayable.type === PUPPET.types.Sayable.Image }
export function isLocation    (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.location>    { return sayable.type === PUPPET.types.Sayable.Location }
export function isMiniProgram (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.miniProgram> { return sayable.type === PUPPET.types.Sayable.MiniProgram }
export function isPost        (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.post>        { return sayable.type === PUPPET.types.Sayable.Post }
export function isText        (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.text>        { return sayable.type === PUPPET.types.Sayable.Text }
export function isUrl         (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.url>         { return sayable.type === PUPPET.types.Sayable.Url }
export function isVideo       (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.video>       { return sayable.type === PUPPET.types.Sayable.Video }

export const {
  attatchment,
  audio,
  contact,
  emoticon,
  image,
  location,
  miniProgram,
  post,
  text,
  url,
  video,
} = PUPPET.payloads.sayable

export const type = PUPPET.types.Sayable
