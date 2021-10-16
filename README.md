# dipress

[![Version](https://img.shields.io/npm/v/dipress.svg)](https://www.npmjs.com/package/dipress)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/AntoRin/dipress#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/AntoRin/dipress/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/AntoRin/dipress)](https://github.com/AntoRin/dipress/blob/master/LICENSE)

> A TypeScript decorator library built on top of express.js

### 🏠 [Homepage](https://github.com/AntoRin/dipress)

## Install

```sh
npm install dipress
```

## Usage

> Create an express server using TypeScript decorators.

Use the @ApplicationServer decorator for your main server class, and have your express server initialized behind the scenes. Following that, you can use an @RestController class decorator to initialize API routes (if it is the same class as your main application server, make sure @RestController comes second), and each method in that class can be an API endpoint, considering which of the available method decorators like @GET, @POST, @PUT, etc., you use.

## Decorators

```ts
@ApplicationServer(app?: Express.Application)
```

Initialize express server. You can either pass in your app with all the basic middlewares like cors, body-parser, etc., or have a basic app created for you.

---

```ts
@RestController(routePrefix?: string)
```

Initialize your controller, either with or without a route prefix.

---

```ts
@UseBefore(middlewares: Array<RequestHandler> | RequestHandler)
```

The middleware functions provided will be used before request enters a controller, if the decorator is used controller-level, or before request enters a handler, if the decorator is used handler-level.

---

```ts
@UseAfter(middlewares: Array<RequestHandler> | RequestHandler)
```

The middleware functions provided will be used after request enters a controller, if the decorator is used controller-level, or after request enters a handler, if the decorator is used handler-level.

---

```ts
@GET(path: string)
@POST(path: string)
@PUT(path: string)
@DELETE(path: string)
@ALL(path: string)
```

These decorators correspond to the respective Express router methods.

---

```ts
@Factory
```

Return an array of handlers within your endpoint method.

---

## Author

👤 **AntoRin**

-  Github: [@AntoRin](https://github.com/AntoRin)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [AntoRin](https://github.com/AntoRin).

This project is [MIT](https://github.com/AntoRin/dipress/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
