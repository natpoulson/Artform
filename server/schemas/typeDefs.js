const { STATUSES } = require('../config/settings');

const enumStatuses = () => {
    const output = [];

    for (stat of STATUSES) {
        output.push(`    ${stat}`); // Emulate spacing so it's consistent with the schema structure
    }
    return output.join("\n"); // Separate each entry with a new line and return as a single string
}

const typeDefs = `
type AboutContent {
    portrait: Media
    banner: Media
    bio: String
    willDo: [String]
    wontDo: [String]
    askMe: [String]
    conditions: [String]
}

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
    ${enumStatuses()}
}

type CompressedMedia {
    _id: ID!
    name: String!
    extension: String!
    fullName: String!
    compressed: String
    createdAt: String
    updatedAt: String
}

type Media {
    _id: ID!
    name: String!
    extension: String!
    fullName: String!
    original: String
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

type Auth {
    token: String!
    user: User!
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

input UserSearch {
    id: ID
    email: String
}

input UserAttributes {
    email: String
    displayName: String
    currentPassword: String
    newPassword: String
}

input OptionInput {
    name: String!
    price: Float!
}

input CommissionAddonInput {
    name: String!
    price: Float!
    quantity: Int
}

input NewCommissionAttributes {
    title: String!
    description: String
    options: [OptionInput]!
    addons: [CommissionAddonInput]
    private: Boolean
    anonymous: Boolean
}

input UpdateCommissionAttributes {
    title: String
    description: String
    status: CommissionStatus
    private: Boolean
    anonymous: Boolean
}

input NewWorkAttributes {
    title: String!
    description: String
    commission: ID!
    private: Boolean
    publish: Boolean
    feature: Boolean
}

input UpdateWorkAttributes {
    title: String
    description: String
    private: Boolean
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

union UpdateUserResult = User | Auth

type Query {
    about: AboutContent
    user(query: UserSearch!): User
    me: User
    commissions: [Commission]
    commission(id: ID!): Commission
    balances: [Balance]
    balance(id: ID!): Balance
    works: [Work]
    work(id: ID!): Work
    allMedia: [CompressedMedia]
    mediaById(id: ID!): Media
}

type Mutation {
    addUser(email: String!, displayName: String, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateUser(attributes: UserAttributes!): UpdateUserResult
    addCommission(attributes: NewCommissionAttributes!): Commission
    updateCommission(id: ID!, attributes: UpdateCommissionAttributes!): Commission
    addWork(attributes: NewWorkAttributes!): Work
    updateWork(id: ID!, attributes: UpdateWorkAttributes!): Work
    payBalance(id: ID!, transaction: NewTransaction!): Balance
    updateTransaction(id: ID!, status: TransactionStatus): Transaction
    setAboutContent(bio: String, willDo: [String], wontDo: [String], askMe: [String], conditions: [String], portrait: ID, banner: ID): AboutContent
}
`;

module.exports = typeDefs;