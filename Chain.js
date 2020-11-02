const Chain = () => {
    const links = [];
    let shouldExecuteNext = true;
    let current = 0;
    let currentData = {};

    const getChain = () => links;
    const getCurrent = () => links[current];

    const _canExecuteNext = () => (
        links[current + 1] && typeof links[current + 1].callback === 'function' && links[current + 1].status !== 'cancelled'
    );

    const _run = (whichLinkIndex = current, data = currentData) => {
        const next = _canExecuteNext()
            ? (newData = {}) => {
                links[whichLinkIndex].status = 'success';
                if (!_canExecuteNext()) {
                    return;
                }
                current = whichLinkIndex + 1;
                currentData = newData;
                return _run(whichLinkIndex + 1, newData ? newData : data);
            }
            : () => {
                links[whichLinkIndex].status = 'success';
            };
        const failure = () => links[whichLinkIndex].status = 'fail';

        if (!shouldExecuteNext) {
            return;
        }
        links[whichLinkIndex].status = 'running';
        links[whichLinkIndex].callback(data, next, failure);
    };

    const register = link => links.push({
        ...link,
        status: 'idle',
    });
    const start = () => _run();
    const pause = () => shouldExecuteNext = false;
    const cancel = () => links.forEach((item, index) => {
        if (index > current) {
            item.status = 'cancelled';
        }
    });

    return {
        register,
        start,
        pause,
        cancel,
        getChain,
        getCurrent,
    };
};

module.exports = Chain;