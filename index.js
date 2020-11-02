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