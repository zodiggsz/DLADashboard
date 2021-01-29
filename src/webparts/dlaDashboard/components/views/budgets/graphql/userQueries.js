

export const getUserByEmail = /* GraphQL */ `
    query GetUserByEmail(
        $email: String
        $sortDirection: ModelSortDirection
        $filter: ModelRinnaiUserFilterInput
        $limit: Int
        $nextToken: String
    ) {
        getUserByEmail(
            email: $email
            sortDirection: $sortDirection
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                name
                email
                admin
                street
                firstname
                lastname
                phone_country_code
                phone
                primary_contact
                roles
                state
            }
        }
    }
    
`;