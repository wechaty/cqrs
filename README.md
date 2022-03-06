# CQRS Wechaty

A event-driven architecture wrapper for Wechaty that applies the CQS principle by using separate Query and Command messages to retrieve and modify the bot state, respectively.

![Command Query Responsibility Segeragation (CQRS) Wechaty](docs/images/cqrs-wechaty.png)

> Command query responsibility separation (CQRS) generalises CQS to message-driven and event-driven architectures: it applies the CQS principle by using separate Query and Command messages to retrieve and modify data, respectively.
>
> &mdash; [Wikipedia: Command–query separation](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)

## Diagrams

```mermaid
graph LR
  classDef event fill:DarkGoldenRod
  classDef command fill:blue
  classDef query fill:green

    C(VerbNounCommand):::command

  subgraph Event
    ER(ReceivedEvent):::event
    EC(NounVerbedEvent):::event
    EQ(GetNounResponseEvent):::event
  end

  Q(GetNounQuery):::query

  C-->EC

  ER-->ER

  Q-->EQ
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
    Redux->>Bus: CommandExecutedEvent
```

### Query

```mermaid
sequenceDiagram
    participant Bus
    participant Redux
    participant Wechaty

    Bus->>Redux: GetQuery
    Redux->>Wechaty: Call
    Wechaty->>Redux: Call Return (value)
    Redux->>Bus: GetResponseEvent
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

## Resources

- [class-transformer](https://github.com/typestack/class-transformer) - Decorator-based transformation, serialization, and deserialization between objects and classes.

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), [Microsoft Regional Director](https://rd.microsoft.com/en-us/huan-li), <zixia@zixia.net>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Code & Docs © 2022 Huan (李卓桓) \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
