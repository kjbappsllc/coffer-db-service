import hapi from "@hapi/hapi"

export const createDbRestService = ({
    h = hapi
} = {}) => {

    let server = h.Server({
        port: 8081,
        host: 'localhost',
        routes: { cors: true }
    })

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });
    

    return {
        start: () => {
            return server.start().then(() => { console.log("Server Started") })
        }
    }
}