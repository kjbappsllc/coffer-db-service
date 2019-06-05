import { createRoutes } from './routes'

export const createDbRestService = ({
    hapi,
    port,
    dbDriver,
    path
}) => {
    let server
    const collections = Object.freeze({ coffer: 'Coffer' })
    const folderPath = path.resolve(__dirname, '../../../../../database')
    return {
        dbRestAPI: {
            start: () => {
                if (!server) {
                    server = hapi.Server({
                        port,
                        host: 'localhost',
                        routes: { cors: true }
                    })
                    dbDriver.connect({
                        urls: Object.values(collections),
                        config: { folderPath }
                    }).catch(err => {
                        console.log(err)
                        process.exit(1)
                    })
                }
                server.route(createRoutes({ dbDriver, collections }));
                return server.start().then(() => {
                    return Promise.resolve(`DB API running at: ${server.info.uri}`)
                })
            }
        }
    }
}