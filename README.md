# Chain of callbacks

A pure JavaScript and NodeJS implementation of ["Chain of Responsability Pattern"](https://refactoring.guru/design-patterns/chain-of-responsibility).

In this implementation, you can `register` each link as an object, containing a `name` and a `callback` function, which receives three parameters: `data` (a mutated object, which will be shared sequentially between each chain link), `next` (function to call next chain link) and `failure` (function to mark current link status as `fail`).

Inside each `callback` function, you can add promises and asynchronous tasks, just making sure to call `next` or `callback` after this processes.

This implementation makes easy to link a chain of tasks to an interactive UI.

## Further information
- You must call either `next` or `failure` inside each `callback` function (even in the last registered function in the chain!), to keep the chain statuses always correct.
- You can mutate `data` object, to pass data from a link to another.
- You can use asynchronous functions inside each callback function.
- You can `start` and `pause` the chain using the Chain functions, but once you call `cancel` function, all subsequent links will be marked as `cancelled`.
- All registered links starts with status `idle`.

## Example

```js
const Chain = require('./Chain');
const chain = Chain();

chain.register({
    name: 'getInfoFromAPI',
    callback: (data, next, failure) => {
        setTimeout(() => {
            const info = {
                config: 'test',
            };
            console.log('info from API:', info);
            next(info);
        }, 1000);
    }
});

chain.register({
    name: 'parseData',
    callback: (data, next, failure) => {
        setTimeout(() => {
            data.config = 'infoParsed';
            console.log('parsed data:', data);
            next(data);
        }, 1000);
    }
});

chain.register({
    name: 'sendToDatabase',
    callback: (data, next, failure) => {
        setTimeout(() => {
            console.log('data sent to database!', data);
            next();
        }, 1000);
    }
});

chain.start();
```

Output:
```sh
# after 1000ms
> info from API: { config: 'test' }
# after 1000ms
> parsed data: { config: 'infoParsed' }
# after 1000ms
> data sent to database! { config: 'infoParsed' }
```

Under the hood, the chain info:
```sh
> { name: 'getInfoFromAPI',
    callback: [Function: callback],
    status: 'running' }
# after 1000ms
> { name: 'getInfoFromAPI',
    callback: [Function: callback],
    status: 'success' }
> { name: 'parseData',
    callback: [Function: callback],
    status: 'running' }
# after 1000ms
> { name: 'parseData',
    callback: [Function: callback],
    status: 'success' }
> { name: 'sendToDatabase',
    callback: [Function: callback],
    status: 'running' }
# after 1000ms
> { name: 'sendToDatabase',
    callback: [Function: callback],
    status: 'success' }
```