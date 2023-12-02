import {NextFunction, Response} from "express";

import {CustomRequest} from "../interfaces/func";
import {InstitutionSchema as Institution, InstitutionNewsSchema as InstitutionNews, UserSchema as User, AdminSchema as Admin, ManagerSchema as Manager} from "../dataBase";

class StatisticsController {

    constructor() {
        this.institutionsStatistics = this.institutionsStatistics.bind(this);
        this.newsStatistics = this.newsStatistics.bind(this);
        this.usersStatistics = this.usersStatistics.bind(this);
    }
    async institutionsStatistics(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const totalEstablishment = await Institution.countDocuments();

            if (!totalEstablishment) {
                return res.status(200).json([])
            }
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const createdInLastMonth = await Institution.countDocuments({createdAt: {$gte: lastMonth}});

            const drafts = await Institution.countDocuments({verify: 'draft'});
            const published = await Institution.countDocuments({verify: 'published'});
            const rejected = await Institution.countDocuments({verify: 'rejected'});

            res.status(200).json({
                totalEstablishment,
                createdInLastMonth,
                drafts,
                published,
                rejected
            })

        } catch (e) {
            next(e)
        }
    }
    async newsStatistics(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const totalNews = await InstitutionNews.countDocuments();

            if (!totalNews) {
                return res.status(200).json([])
            }
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const createdInLastMonth = await InstitutionNews.countDocuments({createdAt: {$gte: lastMonth}});

            const drafts = await InstitutionNews.countDocuments({status: "draft"});
            const published = await InstitutionNews.countDocuments({status: "published"});
            // const rejected = await Institution_newsSchema.countDocuments({ verify: 'rejected' });

            res.status(200).json({
                totalNews,
                createdInLastMonth,
                drafts,
                published,
                // rejected
            })

        } catch (e) {
            next(e)
        }
    }
    async usersStatistics(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const total = await User.countDocuments();
            const totalUsers = await User.countDocuments({status: 'user'});
            const totalAdmins = await Admin.countDocuments();
            const totalManagers = await Manager.countDocuments({'verify.isVerify': true});

            const usersInLastMonth = await User.countDocuments({createdAt: {$gte: lastMonth}});

            const activatedByEmail = await User.countDocuments({isActivated: true});
            const notActivatedByEmail = await User.countDocuments({isActivated: false});

            const activeAccountsInLastMonth = await User.countDocuments({ createdAt: { $gte: lastMonth }, isActivated: true });

            const verifiedByPhone = await User.countDocuments({phoneVerify: true});
            const notVerifiedByPhone = await User.countDocuments({phoneVerify: false});

            const blockedAccounts = await User.countDocuments({"blocked.isBlocked": true})

            res.status(200).json({
                total,
                totalUsers,
                totalAdmins,
                totalManagers,
                usersInLastMonth,
                activatedByEmail,
                notActivatedByEmail,
                activeAccountsInLastMonth,
                verifiedByPhone,
                notVerifiedByPhone,
                blockedAccounts
            })

        } catch (e) {
            next(e)
        }
    }
}

export default new StatisticsController();