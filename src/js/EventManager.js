const EventManager = (() => {

    // val eventHandlers:Map<EventType as String, List<Consumer<Event>>>
    const eventHandlers = {};

    const publish = (type, event) => {
        event.type = type
        if (!event.type) {
            console.error("Unable to publish event without type:")
            console.error({event})
            return
        }
        console.debug(`Publish: ${event.type}`)
        console.debug({event})
        const handlers = eventHandlers[event.type]
        if (!!handlers === false) return
        handlers.forEach((handler) => {
            handler.call(this, event)
        })
    }

    const subscribe = (type, handler) => {
        let handlers = eventHandlers[type]
        if (!!handlers === false) {
            handlers = eventHandlers[type] = []
        }
        handlers.push(handler)
    }

    const unsubscribe = (type, handler) => {
        const handlers = eventHandlers[type]
        if (!!handlers === false) return
        const handlerIdx = handlers.indexOf(handler)
        handlers.splice(handlerIdx)
    }

    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    }
})()

export default EventManager
