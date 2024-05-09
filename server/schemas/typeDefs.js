const { STATUSES } = require('../config/settings');

const enumStatuses = () => {
    const output = [];

    for (stat of STATUSES) {
        output.push(`    ${stat}`); // Emulate spacing so it's consistent with the schema structure
    }
    return output.join("\n"); // Separate each entry with a new line and return as a single string
}

const typeDefs = `
type Option {
    name: String!
    price: Float!
}

type Addon {
    name: String!
    price: Float!
    hasQuantity: Boolean
    maxQuantity: Int
}

type CommissionAddon {
    _id: ID!
    name: String!
    price: Float!
    quantity: Int
}

type Attribute {
    _id: ID!
    name: String!
    options: [Option]
}

enum CommissionStatus {
    ${enumStatuses}
}

type Media {
    _id: ID!
    name: String!
    extension: String!
    fullName: String!
    original: String
    compressed: String
    createdAt: String
    updatedAt: String
}

type Commission {
    _id: ID!
    title: String!
    description: String!
    commissioner: User
    balance: [Balance]
    status: CommissionStatus
    options: [Option]
    addons: [Addon]
    anonymous: Boolean
    private: Boolean
    references: [Media]
    final: Media
    createdAt: String
    updatedAt: String
}

type Work {
    _id: ID!
    title: String!
    description: String!
    commission: Commission!
    private: Boolean!
    paid: Boolean
    publish: Boolean!
    feature: Boolean!
    image: Media
}

type User {
    _id: ID!
    email: String!
    displayName: String!
    totalOwing: Float
    commissions: [Commission]
    isCreator: Boolean
    createdAt: String
    updatedAt: String
}

enum TransactionType {
    Payment
    Refund
    Chargeback
    Credit
    Adjustment
}

enum TransactionStatus {
    Confirmed
    Pending
    Processing
    Complete
    Cancelled
    Declined
}

type Transaction {
    _id: ID!
    type: TransactionType!
    status: TransactionStatus!
    amount: Float!
    currency: String!
    method: String!
}

type Lineitem {
    _id: ID!
    name: String!
    type: String!
    quantity: Int
    price: Float
    currency: String
}

type Balance {
    _id: ID!
    user: User
    commission: Commission
    lineitems: [Lineitem]
    total: Float
    depositPercentage: Float
    paidAmount: Float
    transactions: [Transaction]
    owing: Float
    deposit: Float
    isDepositPaid: Boolean
    isFullyPaid: Boolean
}

input UserAttributes {
    email: String
    displayName: String
    currentPassword: String
    newPassword: String
}

input NewCommissionAttributes {
    title: String!
    description: String
    options: [Option]!
    addons: [CommissionAddon]
    anonymous: Boolean
}

input UpdateCommissionAttributes {
    title: String
    description: String
    status: CommissionStatus
    anonymous: Boolean
}

input NewWorkAttributes {
    title: String!
    description: String
    commission: ID!
    private: Boolean
    paid: Boolean
    publish: Boolean
    feature: Boolean
}

input UpdateWorkAttributes {
    title: String
    description: String
    private: Boolean
    paid: Boolean
    publish: Boolean
    feature: Boolean
}

input NewTransaction {
    type: TransactionType!
    status: TransactionStatus!
    amount: Float!
    currency: String!
    method: String!
}

type Query {
    users: [User]
    user(id: ID, email: String): User
    commissions: [Commission]
    commission(id: ID!): Commission
    balances: [Balance]
    balance(id: ID!): Balance
    works: [Work]
    work(id: ID!): Work
    allMedia: [Media]
    mediaById(id: ID!): Media
}

type Mutation {
    addUser(email: String!, displayName, password: String!): User
    updateUser(id: ID!, attributes: UserAttributes!): User
    removeUser(id: ID!): String
    addCommission(attributes: NewCommissionAttributes!): Commission
    updateCommission(id: ID!, attributes: UpdateCommissionAttributes!): Commission
    addWork(attributes: NewWorkAttributes!): Work
    updateWork(id: ID!, attributes: UpdateWorkAttributes!): Work
    payBalance(id: ID!, transaction: NewTransaction!): Balance
    updateTransaction(id: ID!, status: TransactionStatus): Transaction
}
`;

module.exports = typeDefs;