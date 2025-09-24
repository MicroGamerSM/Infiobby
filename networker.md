# Networker
Provides various tools to send data between the client and the server.

> Designed to be used in **TypeScript**.

# Arguments
> type forwarder

## Type Parameters

### T
If T is a single type, Arguments is `[T]`. Otherwise, Arguments is `T`.

## Resolves To
`T` when T extends unknown[], otherwise `[T]`.

# ClientEventCallback
> type forwarder

## Type Parameters

### I extends unknown[]
Arguments to the function.

## Resolves To
`(...args: I) => undefined | void`

# ServerEventCallback
> type forwarder

## Type Parameters

### I extends unknown[]
Arguments to the function.

## Resolves To
`(player: Player, ...args: I) => undefined | void`

# EventV2
>class

RemoteEvent wrapper

## Type Parameters

### ClientToServer
The data sent from the client, to the server. 

### ServerToClient
The data sent from the server, to the client.

## Methods

### FireServer
`EventV2.FireServer(...args: Arguments<ClientToServer>)`
<br>Sends data from the client, to the server.

### FireClient
`EventV2.FireClient(clients: Player[], ...args: Arguments<ServerToClient>)`
<br>Sends data from the server, to the client.

### FireClients
`EventV2.FireClients(client: Player, ...args: Arguments<ServerToClient>)`
<br>Sends data from the server, to the provided clients.

### FireAllClients
`EventV2.FireAllClients(client: Player, ...args: Arguments<ServerToClient>)`
<br>Sends data from the server, to all clients.

### OnClientFired
`EventV2.OnClientFired(callback: (...args: Arguments<ServerToClient>) => void): () => void`
<br>Links the provided function to be run when the server fires the event for the client. Returns an unlinker.

### OnServerFired
`EventV2.OnServerFired(callback: (player: Player, ...args: Arguments<ClientToServer>) => void): () => void`
<br> Links the provided function to be run when a client fires the event for the server. Returns an unlinker.

## Construction
The standard constructor cannot be used. Instead, use
```ts
EventV2.Get(name: string): EventV2
```
to get an EventV2 by name. If it does not exist, it will be constructed.