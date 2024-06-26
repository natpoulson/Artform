require('dotenv').config();

// Status enums
const NEW = 'New';
const QUEUED = 'Queued';
const IN_PROGRESS = 'In Progress';
const ON_HOLD = 'On Hold';
const COMPLETED = 'Completed';
const REJECTED = 'Rejected';
const CANCELLED = 'Cancelled';

// Status registration
const STATUSES = [
    NEW,
    QUEUED,
    IN_PROGRESS,
    ON_HOLD,
    COMPLETED,
    REJECTED,
    CANCELLED
];

const LEGAL_CHANGES = [
    { 
        initial: NEW,
        legal: [
            QUEUED,
            REJECTED
        ]
    },
    {
        initial: QUEUED,
        legal: [
            IN_PROGRESS,
            ON_HOLD,
            CANCELLED
        ]
    },
    {
        initial: IN_PROGRESS,
        legal: [
            ON_HOLD,
            COMPLETED,
            CANCELLED
        ]
    },
    {
        initial: ON_HOLD,
        legal: [
            IN_PROGRESS,
            COMPLETED,
            CANCELLED
        ]
    },
    {
        initial: COMPLETED,
        legal: []
    },
    {
        initial: REJECTED,
        legal: []
    },
    {
        initial: CANCELLED,
        legal: []
    }
]

// Number of times for a password to be hashed
const BCRYPT_HASHCOUNT = 10;

// The secret and expriation for the JSON Web Tokens issued
// To set your secret, add it as JWT_SECRET="{Your Secret Here}" to a .env file in the /server directory
// If you're using a webhosting service, you should add an environment variable called JWT_SECRET and the value as your secret
// If you need to generate a secret, consider using openSSL's generator from a command line/terminal "openssl rand -hex 32"
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '2h';

const CREATOR_EMAIL = "creator@example.com";
const DEFAULT_DEPOSIT = 10;

module.exports = {
    STATUSES,
    LEGAL_CHANGES,
    BCRYPT_HASHCOUNT,
    JWT_SECRET,
    JWT_EXPIRATION,
    CREATOR_EMAIL,
    DEFAULT_DEPOSIT
}