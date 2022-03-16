# CQRS Wechaty

[![NPM Version](https://img.shields.io/npm/v/wechaty-cqrs?color=brightgreen)](https://www.npmjs.com/package/wechaty-cqrs)
[![NPM](https://github.com/wechaty/cqrs/workflows/NPM/badge.svg)](https://github.com/wechaty/cqrs/actions?query=workflow%3ANPM)
[![Ducksify Extension](https://img.shields.io/badge/Redux-Ducksify-yellowgreen)](https://github.com/huan/ducks#3-ducksify-extension-currying--api-interface)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

A event-driven architecture wrapper for Wechaty
that applies the CQS principle
by using separate Query and Command messages
to retrieve and modify the bot state,
respectively.

![Command Query Responsibility Segregation (CQRS) Wechaty](docs/images/cqrs-wechaty.png)

> Image source: [Introducing Derivative Event Sourcing](https://www.confluent.io/blog/event-sourcing-vs-derivative-event-sourcing-explained/)

## Command Query Responsibility Separation (CQRS)

> Command query responsibility separation (CQRS) generalises CQS
  to message-driven and event-driven architectures:
  it applies the CQS principle by using separate Query and Command messages
  to retrieve and modify data, respectively.
>
> &mdash; [Wikipedia: Command–query separation](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)

![Command Query Responsibility Segregation (CQRS) Pattern](docs/images/cqrs-pattern.png)

> Image source: [CQRS (command query responsibility segregation)](https://www.techtarget.com/searchapparchitecture/definition/CQRS-command-query-responsibility-segregation)

## Usage

### Install

```sh
npm install wechaty-cqrs wechaty
```

### Quick start

Here's the CQRS version of the Wechaty ding/dong bot:

```ts
import * as CQRS    from 'wechaty-cqrs'
import * as WECHATY from 'wechaty'
import { filter, map, mergeMap }  from 'rxjs/operators'

const wechaty = WECHATY.WechatyBuilder.build()
await wechaty.init()

const bus$ = CQRS.from(wechaty)

bus$.pipe(
  filter(CQRS.isActionOf(CQRS.actions.messageReceivedEvent)),
  // MessageReceivedEvent -> Sayable
  map(messageId => CQRS.duck.actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageId,
  )),
  mergeMap(CQRS.execute$(bus$)(CQRS.duck.actions.sayablePayloadGotResponse)),
  // Log `sayable` to console
).subscribe(sayable =>
  console.info('Sayable:', sayable),
)

bus$.next(CQRS.duck.actions.startCommand(wechaty.puppet.id))
```

## Getting Started

Here's a video introduction for CQRS Wechaty with live demo, presented by Huan:

[![CQRS Wechaty Getting Started](docs/images/cqrs-wechaty-getting-started.webp)](https://youtu.be/kauxyPVa0jo)

> YouTube: <https://youtu.be/kauxyPVa0jo>

The getting started [ding-dong-bot.ts](https://github.com/wechaty/getting-started/blob/main/examples/cqrs/ding-dong-bot.ts)
in the video: <https://github.com/wechaty/getting-started/blob/main/examples/cqrs/ding-dong-bot.ts>

## Diagrams

![CQRS Events Structure](docs/images/cqrs-events-diagram.svg)

```mermaid
graph LR
  classDef event fill:DarkGoldenRod
  classDef command fill:blue
  classDef query fill:green

  subgraph Command
    C(VerbNounCommand):::command
  end

  subgraph Response
    RC(VerbNounCommandResponse)
    RQ(GetNounQueryResponse)
  end
    
  subgraph Query
    Q(GetNounQuery):::query
  end

  subgraph Event
    ER(ReceivedEvent):::event
  end

  C-->RC

  ER-->ER

  Q-->RQ
```

### Command

```mermaid
sequenceDiagram
    participant Bus
    participant Redux
    participant Wechaty

    Bus->>Redux: ExecuteCommand
    Redux->>Wechaty: Call
    Wechaty->>Redux: Call Return (void)
    Redux->>Bus: ExecuteCommandResponse
```

### Query

```mermaid
sequenceDiagram
    participant Bus
    participant Redux
    participant Wechaty

    Bus->>Redux: GetNounQuery
    Redux->>Wechaty: Call
    Wechaty->>Redux: Call Return (value)
    Redux->>Bus: GetNounQueryResponse
```

### Event

```mermaid
sequenceDiagram
    participant Bus
    participant Redux
    participant Wechaty

    Wechaty->>Redux: ReceivedEvent
    Redux->>Bus: ReceivedEvent
```

## API Docs

TBW

## Resources

- [class-transformer](https://github.com/typestack/class-transformer) -
  Decorator-based transformation, serialization, and deserialization
  between objects and classes.

## History

### main v0.6 (Mar 13, 2022)

Alpha release.

- v0.4 (Mar 13, 2022): CQRS Ding/Dong BOT works as expected.
- v0.2 (Mar 11, 2022): Unit tests all passed, DevOps enabled.
- v0.0.1 (Mar 6, 2022): Init README & Draft design.

## Author

[Huan LI](https://github.com/huan)
([李卓桓](http://linkedin.com/in/zixia)),
[Microsoft Regional Director](https://rd.microsoft.com/en-us/huan-li),
<zixia@zixia.net>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Code & Docs © 2022 Huan (李卓桓) \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
