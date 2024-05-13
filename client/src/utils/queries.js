import { gql } from '@apollo/client';

export const QUERY_PROFILE = gql`
query User($id: ID!) {
    User(_id: $id) {
        _id
        displayName
        email
        totalOwing
        isCreator
    }
}
`;

export const QUERY_USER = gql`
query User($email: String!) {
    User(email: $email) {
        _id
        displayName
        email
        totalOwing
        isCreator
        commissions {
            _id
            title
            status
            balance {
                _id
                total
                paidAmount
                owing
                isDepositPaid
                isFullyPaid
            }
        }
    }
}
`;