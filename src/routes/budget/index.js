
export const createBudgetRoutes = ({
    dbDriver,
    collectionName: collection
}) => {
    return [
        {
            method: 'POST',
            path: '/budgets',
            handler: (request, h) => {
                const newBudget = request.payload
                console.log("Received post request to insert into DB: ", newBudget)
                return dbDriver.insert({
                    collection, doc: newBudget
                }).then((newDoc) => {
                    const response = h.response(newDoc).code(200)
                    return response
                }).catch((err) => {
                    let response
                    if( typeof err === 'string' ) {
                        response = h.response(err).code(400)
                        response = response.message(err)
                        return response
                    }
                    response = h.response(err).code(500)
                    return response
                })
            }
        }
    ]
}