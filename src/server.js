import hapi from "@hapi/hapi"

export const createDbRestService = ({
    h = hapi
} = {}) => {

    let server = h.Server({
        port: 8081,
        host: 'localhost',
        routes: { cors: true }
    })

    return {
        start: () => {
            return server.start().then(() => { console.log("Server Started") })
        }
    }
}