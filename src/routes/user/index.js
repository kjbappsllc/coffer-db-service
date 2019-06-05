
export const createUserRoutes = ({
    accessTokenManager,
    userEntity,
    execScript,
    collectionName: collection,
    dbDriver,
    decryptPassword
}) => {
    return [
        {
            method: 'POST',
            path: '/users/register',
            handler: (request, h) => {
                console.log("Request For Register")
                let user
                const payload = request.payload
                return dbDriver.find({ 
                    collection, 
                    doc: { user: {$exists: true} } 
                }).then((res) => {
                    if (res.length === 0) {
                        return execScript({ script: 'whoami' })
                    }
                    throw new Error("A user already exists")
                }).then((name) => {
                    try {
                        user = { ...userEntity.init({ name: name.trim() }) }
                    } catch (err) {
                        throw new Error(err.message)
                    }
                    console.log("Inserting User: ", user, " into DB")
                    return dbDriver.insert({ 
                        collection,
                        doc: { user: { ...user, password: payload.pass } }
                    })
                }).then((user) => {
                    return accessTokenManager.generate({ payload: { id: user._id }})
                }).then(token => {
                    const response = h.response({ ...user, token }).code(200)
                    return response
                }).catch(err => {
                    console.error(err.message)
                    const response = h.response({ token: null, err: err.message }).code(500)
                    return response
                })
            }
        },
        {
            method: 'POST',
            path: '/users/login',
            handler: (request, h) => {
                console.log("Request For Login")
                let user
                const payload = request.payload
                return dbDriver.find({ 
                    collection, 
                    doc: { user: {$exists: true} } 
                }).then((res) => {
                    if (res.length === 0) {
                        throw new Error("There is no user registered")
                    }
                    user = res[0].user
                }).then(() => {
                    return new Promise((resolve) => {
                        let userPwAttempt, storedPW
                        decryptPassword({ 
                            encryptedPass: payload.pass
                        }).then(pass => {
                            userPwAttempt = pass
                            return decryptPassword({ 
                                encryptedPass: user.password
                            })
                        }).then(pass => {
                            storedPW = pass
                        }).then(() => {
                            return resolve(userPwAttempt === storedPW)
                        })
                    })
                }).then(isCorrectPw => {
                    if(isCorrectPw) {
                        return accessTokenManager.generate({ payload: { id: user._id }})
                    }
                    throw new Error("Incorrect password")
                }).then(token => {
                    delete user.password
                    const response = h.response({ ...user, token }).code(200)
                    return response
                }).catch(err => {
                    console.error(err.message)
                    const response = h.response({ token: null, err: err.message }).code(500)
                    return response
                })
            }
        }
    ]
}