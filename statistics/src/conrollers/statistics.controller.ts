import {NextFunction, Response} from "express";

import {CustomRequest} from "../interfaces/func";
import {Institution, InstitutionNews, User, Admin, Manager} from "../dataBase";

class StatisticsController {
    async institutionsStatistics(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const totalInstitutions = await Institution.countDocuments();

            if (!totalInstitutions) {
                return res.status(200).json([])
            }
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const createdInLastMonth = await Institution.countDocuments({createdAt: {$gte: lastMonth}});

            const drafts = await Institution.countDocuments({verify: 'draft'});
            const published = await Institution.countDocuments({verify: 'published'});
            const rejected = await Institution.countDocuments({verify: 'rejected'});

            res.status(200).json({
                totalInstitutions,
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

            const drafts = await InstitutionNews.countDocuments({"publishAt.isPublish": false});
            const published = await InstitutionNews.countDocuments({"publishAt.isPublish": true});
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
            const totalAdmins = await Admin.countDocuments({status: 'admin'});
            const totalManagers = await Manager.countDocuments({status: 'manager'});

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