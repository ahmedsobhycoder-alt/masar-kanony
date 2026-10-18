import { SubscriptionPlanAnalytics, SubscriptionPlanViewer } from "../database/models/subscriptionPlanAnalyticsModel";

export const recordSubscriptionPlanGet = async (user?: { _id: unknown; role: string } | null) => {
    if (user?.role === "admin") return;
    const now = new Date();
    await SubscriptionPlanAnalytics.updateOne({ _id: "public-get" }, {
        $inc: { requests: 1, authenticatedRequests: user ? 1 : 0, guestRequests: user ? 0 : 1 },
        $set: { lastRequestedAt: now },
        $setOnInsert: { startedAt: now },
    }, { upsert: true });
    if (user) {
        await SubscriptionPlanViewer.updateOne({ _id: String(user._id) }, {
            $setOnInsert: { firstRequestedAt: now },
        }, { upsert: true });
    }
};

export const getSubscriptionPlanStatistics = async () => {
    const [totals, uniqueUsers] = await Promise.all([
        SubscriptionPlanAnalytics.findById("public-get").lean(),
        SubscriptionPlanViewer.countDocuments(),
    ]);
    return {
        requests: totals?.requests || 0,
        authenticatedRequests: totals?.authenticatedRequests || 0,
        guestRequests: totals?.guestRequests || 0,
        uniqueUsers,
        startedAt: totals?.startedAt || null,
        lastRequestedAt: totals?.lastRequestedAt || null,
    };
};
