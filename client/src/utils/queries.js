import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query User($email: String!) {
    user(email: $email) {
        _id
        displayName
        email
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