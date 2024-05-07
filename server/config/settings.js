// Status enums
const NEW = 'New';
const QUEUED = 'Queued';
const IN_PROGRESS = 'In Progress';
const ON_HOLD = 'On Hold';
const COMPLETED = 'Completed';
const REJECTED = 'Rejected';

const STATUSES = [
    NEW,
    QUEUED,
    IN_PROGRESS,
    ON_HOLD,
    COMPLETED,
    REJECTED
];

const BCRYPT_HASHCOUNT = 10;

module.exports = {
    STATUSES,
    BCRYPT_HASHCOUNT
}