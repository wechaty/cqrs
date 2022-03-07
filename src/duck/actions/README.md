Huan(20220307): In case of we forgot the design pattern, we create this README file.

## Actions

`Action` is a concept from redux, it is just a PJO payload.

Below are the 4 types, theroretically they are all `Event`s

1. Event
1. Command (an Event that will send a mutation request and will trigger a response event to identify whether the command is sent successfully or not, only)
1. Query (an Event that will send a query request and will trigger a response event, with the query value)
1. Message (the response of the Command and Query. Response to the Command will only has the `meta`, in the other hand the response to the Query will contains the `payload`)

## Message v.s. Event

1. Message is replying to a specific source.
1. Event is just firing for anyone who might be interested.

## Command & Query will trigger a Message as its response

## Meta v.s. Payload

Meta:

1. `id`: UUID v4
1. `puppetId`: Puppet ID

Payload:

1. Command & Query: The exact same data as the Puppet API parameters as Object key/value
1. Message (response for Command & Query): The exact same data as the Puppet API return value
