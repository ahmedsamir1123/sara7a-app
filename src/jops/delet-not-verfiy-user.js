import cron from "node-cron";
import { User } from './../db/model/user.model.js';
export function startDeleteUnverifiedJob() {
    cron.schedule('*/60 * * * * *', async () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const result = await User.deleteMany({
            isverifed: false,
            createdAt: { $lt: oneMonthAgo }
        });

        console.log(`Deleted ${result.deletedCount} unverified accounts`);
    });
}