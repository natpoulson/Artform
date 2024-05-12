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
                    gQLValidationErr("You need to provide a title.");
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
            try {
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

                const updatedCommission = await commission.save();

                if (!updatedCommission) {
                    gQLGeneralFailure("Commission failed to update. Please try again later.");
                }

                return updatedCommission;
            } catch (error) {
                return error;
            }
        },
        addWork: async (parent, { title, description, commission, private, publish, feature }, context) => {
            try {
                isLoggedIn(context);
                if (!context.user.isCreator) {
                    gQLForbiddenErr("You must be the creator to add works.");
                }
                const newWork = {};
                newWork.title = title,
                newWork.description = description,
                newWork.commission = commission,
                newWork.private = private,
                newWork.publish = publish,
                newWork.feature = feature

                const work = await Work.create(newWork);

                if (!work) {
                    gQLGeneralFailure("Failed to create new work. Please try again later.");
                }

                return work;
            } catch (error) {
                return error;
            }
        },
        updateWork: async (parent, { id, attributes }, context) => {
            try {
                if (!context.user.isCreator) {
                    gQLForbiddenErr("You must be the creator to change works.");
                }

                const work = await Work.findById(id);

                if (!work) {
                    gQLNotFoundErr("Could not find the work specified.");
                }
                const { title, description, publish, feature } = attributes;

                if (isDiff(work.title, title)) {
                    work.title = title;
                }
                if (isDiff(work.description, description)) {
                    work.description = description;
                }
                if (!work.publish === publish) {
                    work.publish = publish;
                }
                if (!work.feature === feature) {
                    work.feature = feature;
                }

                const updatedWork = await work.save();

                if (!updatedWork) {
                    gQLGeneralFailure("Failed to update work. Please try again later.");
                }

                return updatedWork;
            } catch (error) {
                return error;
            }
        },
        setAboutContent: async (parent, { bio, willDo, wontDo, askMe, conditions, portrait, banner }, context) => {
            try {
                if (!context.user.isCreator) {
                    gQLForbiddenErr("You must be the creator to edit this page.")
                }
                const about = await AboutContent.find({});

                let updatedContent;
                if (!about) {
                    updatedContent = await AboutContent.create({
                        bio: bio,
                        willDo: willDo,
                        wontDo: wontDo,
                        askMe: askMe,
                        conditions: conditions,
                        portrait: portrait,
                        banner: banner
                    });

                    return updatedContent;
                }

                if (isDiff(about.bio, bio)) {
                    about.bio = bio;
                }
                if (isDiff(about.willDo, willDo)) {
                    about.willDo = willDo;
                }
                if (isDiff(about.askMe, askMe)) {
                    about.askMe = askMe;
                }
                if (isDiff(about.conditions, conditions)) {
                    about.conditions = conditions;
                }
                if (isDiff(about.portrait, portrait)) {
                    about.portrait = portrait;
                }
                if (isDiff(about.banner, banner)) {
                    about.banner = banner;
                }

                updatedContent = await about.save();

                if (!updatedContent) {
                    gQLGeneralFailure("Could not update the content of this page.");
                }

                return updatedContent;
            } catch (error) {
                return error;
            }
        }
    }
};

module.exports = resolvers;