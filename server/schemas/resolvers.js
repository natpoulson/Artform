const { signToken, AuthError, checkPasswordStrength } = require('../utils/auth');
const {
    User,
    Commission,
    Balance,
    Work,
    Media,
    AboutContent
} = require('../models');
const {
    gQLForbiddenErr,
    gQLNotFoundErr,
    gQLValidationErr,
    gQLGeneralFailure,
    isLoggedIn,
    isDiff,
    isLegal
} = require('../utils/resolverHelpers');

const resolvers = {
    Query: {
        about: async (parent) => {
            return await AboutContent.find({});
        },
        user: async (parent, { id, email }, context) => {
            try {
                const user = await User.findOne( {_id: id, email: email } );
                if (user && context.user.isCreator) {
                    return user;
                }
                gQLForbiddenErr("You don't have permission to look up users.");
            } catch (error) {
                return error;
            }
        },
        me: async (parent, {}, context) => {
            try {
                isLoggedIn(context);
                const user = await User.findById(context.user._id);

                if (!user) {
                    gQLNotFoundErr("Could not locate your profile. Please try logging in again.");
                }

                return user;
            } catch (error) {
                return error;
            }
        },
        commissions: async (parent, {}, context) => {
            try {
                isLoggedIn(context);
                if (context.user.isCreator) {
                    const commissions = await Commission.find({});
                    return commissions;
                } else {
                    const commissions = await Commission.find({commissioner: context.user._id});

                    if (!commissions) {
                        gQLNotFoundErr("No commissions found for this account.");
                    }

                    return commissions;
                }
                
            } catch (error) {
                return error;
            }
        },
        commission: async (parent, { id }, context) => {
            try {
                isLoggedIn(context);
                const commission = await Commission.findById(id);

                if (!commission) {
                    gQLNotFoundErr("Commission not found.");
                }

                if (!commission.commissioner === context.user._id && !context.user.isCreator) {
                    gQLForbiddenErr("You are not authorised to view this commission.");
                }

                return commission;
            } catch (error) {
                return error;
            }
        },
        balances: async (parent, {}, context) => {
            try {
                isLoggedIn(context);
                if (context.user.isCreator) {
                    return await Balance.find({});
                }

                const balances = await Balance.find({user: context.user._id});
                if (!balances) {
                    gQLNotFoundErr("No balances found for this account.");
                }

                return balances;
            } catch (error) {
                return error;
            }
        },
        balance: async (parent, { id }, context) => {
            try {
                isLoggedIn(context);
                const balance = await Balance.findById(id);

                if (!balance || (!balance.user === context.user._id && !context.user.isCreator)) {
                    gQLNotFoundErr("No balance under that account found.");
                }

                return balance;
            } catch (error) {
                return error;
            }
        },
        works: async (parent, {}, context) => {
            try {
                if (context.user && context.user.isCreator) {
                    const works = await Work.find({});

                    if (works) {
                        return works;
                    }

                    gQLNotFoundErr("No works found.");
                }
                // Only return the works that are published and not private
                const works = await Work.find({ $and: { publish: true } });
                if (works) {
                    return works;
                }

                gQLNotFoundErr("No works found. Please check again later.");
            } catch (error) {
                return error;
            }
        },
        work: async (parent, { id }, context) => {
            try {
                const work = await Work.findById(id);
                if (context.user && context.user.isCreator) {
                    if (work) {
                        return work;
                    }
                    gQLNotFoundErr("No work found at this ID.")
                }

                if (!work.publish) {
                    gQLNotFoundErr("No work found at this ID.")
                }

                return work;
            } catch (error) {
                return error;
            }
        },
        allMedia: async (parent, { }, context) => {
            try {
                let media;

                // original: 0 is excluding the binary of the raw media from results to improve performance
                if (context.user && !context.user.isCreator) {
                    media = await Media.find({ publish: true }, {original: 0, compressed: 0, serialOriginal: 0});
                }

                if (context.user.isCreator) {
                    media = await Media.find({ }, { original: 0, compressed: 0, serialOriginal: 0 });
                }

                if (!media) {
                    gQLNotFoundErr("No Media found.");
                }

                return media;

            } catch (error) {
                return error;
            }
        },
        mediaById: async (parent, { id }) => {
            try {
                const media = await Media.findById(id, { compressed: 0, original: 0, serialCompressed: 0 });

                if (!media) {
                    gQLNotFoundErr("Specified Media could not be found.");
                }

                return media;
            } catch (error) {
                return error;
            }
        }
    },
    UpdateUserResult: {
        __resolveType(obj) {
            if (obj.token) {
                return 'Auth';
            } else {
                return 'User';
            }
        }
    },
    Mutation: {
        addUser: async (parent, { email, password }) => {
            try {
                if (!checkPasswordStrength(password)) {
                    gQLValidationErr("The password does not meet complexity requirements. It must be at least 8 characters long, with at least one of each type (Uppercase, Lowercase, Numbers, and Symbols).")
                }
    
                const user = await User.create({
                    email: email,
                    password: password
                });
    
                if (!user) {
                    gQLGeneralFailure("We couldn't generate an account for you. Please try again later.");
                }

                const token = signToken(user);
                return { token, user };

            } catch (error) {
                return error;
            }
            
        },
        login: async (parent, { email, password }) => {
            try {
                const user = await User.find({ email: email });

                if (!user || !user.checkPassword(password)) {
                    throw AuthError;
                }

                const token = signToken(user);
                return { token, user };

            } catch (error) {
                return error;
            }
        },
        updateUser: async (parent, { attributes }, context) => {
            try {
                if (!context.user) {
                    throw AuthError;
                }

                const user = await User.findById(context.user._id);

                const { email, displayName, currentPassword, newPassword } = attributes;

                if (!user) {
                    gQLNotFoundErr("Could not locate your user account. Please try again later.");
                }

                let issueToken = false;

                if (displayName) {
                    user.displayName = displayName;
                }
                if (currentPassword === newPassword) {
                    throw gQLValidationErr("Your new password can't be the same as your old password.");
                }
                if (currentPassword && user.checkPassword(currentPassword) && newPassword) {
                    user.password = newPassword;
                    issueToken = true;
                }
                if (email && currentPassword && user.checkPassword(currentPassword)) {
                    user.email = email;
                    issueToken = true;
                }

                const updatedUser = await user.save();

                if (!updatedUser) {
                    throw gQLGeneralFailure("Failed to update user account.");
                }

                if (issueToken) {
                    const token = signToken(user);
                    return { token, user };
                } else {
                    return user;
                }

            } catch (error) {
                return error;
            }
        },
        addCommission: async (parent, { title, description, options, addons, private, anonymous }, context) => {
            try {
                isLoggedIn(context);

                if (!title) {
                    gQLValidationErr("You need to provide a title");
                }

                const newComm = {};

                newComm.title = title;
                newComm.commissioner = context.user._id;
                newComm.description = description;
                newComm.private = private;
                newComm.anonymous = anonymous;
                newComm.options = [...options];
                newComm.addons = [...addons];

                const commission = await Commission.create(newComm);

                if (!commission) {
                    gQLGeneralFailure("Failed to create commission. Please try again later.");
                }

                return commission;
            } catch (error) {
                return error;
            }
        },
        updateCommission: async (parent, { id, attributes }, context) => {
            isLoggedIn(context);

            if (!id || !attributes) {
                gQLValidationErr("You must provide an id and attributes to update the commission with.");
            }

            const commission = await Commission.findById(id);

            if (!context.user._id === commission.commissioner) {
                gQLForbiddenErr("You're not authorised to edit this commission.");
            }

            const { title, description, status, private, anonymous } = attributes;

            if (isDiff(title, commission.title)) {
                commission.title = title;
            }
            if (isDiff(description, commission.description)) {
                commission.description = description;
            }
            if (isDiff(status, commission.status) && isLegal(status, commission.status)) {
                commission.status = status;
            }
            if (!private === commission.private) {
                commission.private = private;
            }
            if (!anonymous === commission.anonymous) {
                commission.anonymous = anonymous;
            }

        },
        addWork: async (parent, { title, description, commission, private, paid, publish, feature }, context) => {
            // TBA
        },
        updateWork: async (parent, { id, attributes }) => {
            // TBA
        },
        setAboutContent: async (parent, { bio, willDo, wontDo, askMe, conditions, portrait, banner }, context) => {
            // 
        }
    }
};

module.exports = resolvers;