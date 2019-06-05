import { accessTokenManager, decryptPassword } from '../../../front-end/src/infrastructure/security'
import { execScript as execS } from '../../../scripts'
import { exec } from 'child_process'
import { user as userEntity } from '../../../../domain/entities'
import { createBudgetRoutes } from './budget'
import { createUserRoutes } from './user'

export const createRoutes = ({
    collections,
    dbDriver
}) => [
    ...createBudgetRoutes({ 
        dbDriver, 
        collectionName: collections.coffer
    }),
    ...createUserRoutes({ 
        accessTokenManager,
        userEntity,
        execScript: ({ script }) => execS({ script, exec }),
        collectionName: collections.coffer,
        dbDriver,
        decryptPassword
    })
]