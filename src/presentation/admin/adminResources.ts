import { ResourceWithOptions } from 'adminjs';
import AdsModel from '../../infrastructure/database/models/adsModel';
import AppConfigModel from '../../infrastructure/database/models/appConfigModel';
import AppPolicyModel from '../../infrastructure/database/models/appPolicyModel';
import CityModel from '../../infrastructure/database/models/cityModel';
import CourtModel from '../../infrastructure/database/models/courtModel';
import CourtTypeModel from '../../infrastructure/database/models/courtTypeModel';
import FloorModel from '../../infrastructure/database/models/floorModel';
import FloorNameModel from '../../infrastructure/database/models/floorNameModel';
import GovernorateModel from '../../infrastructure/database/models/governorateModel';
import OfficeModel from '../../infrastructure/database/models/officeModel';
import OfficeTypeModel from '../../infrastructure/database/models/officeTypeModel';
import OtpModel from '../../infrastructure/database/models/otpModel';
import PaymentModel from '../../infrastructure/database/models/paymentModel';
import PaymentOptionModel from '../../infrastructure/database/models/paymentOptionModel';
import SubscriptionPlanModel from '../../infrastructure/database/models/subscriptionPlanModel';
import UserModel from '../../infrastructure/database/models/userModel';

const defaultIdProperty = {
    _id: {
        isVisible: { list: false, filter: true, show: true, edit: false },
    },
};

const buildResource = (
    model: any,
    navigationName: string,
    icon = 'Folder',
    overrideOptions: Record<string, any> = {}
) => ({
    resource: model,
    options: {
        navigation: { name: navigationName, icon },
        ...overrideOptions,
        properties: {
            ...defaultIdProperty,
            ...(overrideOptions.properties ?? {}),
        },
    },
});

const userResource = buildResource(UserModel, 'User Management', 'User', {
    listProperties: ['name', 'email', 'phone', 'role', 'createdAt'],
    id: "User",
    properties: {
        password: { isVisible: false },
        resetCode: { isVisible: false },
        resetCodeExpires: { isVisible: false },
        passwordChangedAt: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
    },
});

const resources: Array<ResourceWithOptions | any> = [
    userResource,
    buildResource(AdsModel, 'Ads', 'Image'),
    // buildResource(AppConfigModel, 'App Config', 'Settings'),
    // buildResource(AppPolicyModel, 'App Policy', 'File'),
    // buildResource(CityModel, 'Cities', 'Map'),
    // buildResource(CourtModel, 'Courts', 'Building'),
    // buildResource(CourtTypeModel, 'Court Types', 'Folder'),
    // buildResource(FloorModel, 'Floors', 'Layers'),
    // buildResource(FloorNameModel, 'Floor Names', 'List'),
    buildResource(GovernorateModel, 'Governorates', 'Map'),
    // buildResource(OfficeModel, 'Offices', 'Building'),
     buildResource(OfficeTypeModel, 'Office Types', 'Folder'),
    buildResource(PaymentModel, 'Payments', 'Money', {
        properties: {
            currency: {
                isVisible: false
            },
            currencySymbol: {
                isVisible: false
            },
            reviewedByAdminId: {
                isVisible: false
            },
            reviewedAt: {
                isVisible: false
            },
            userWalletNumber: {
                isVisible: { list: false, filter: true, show: true, edit: false },
            },
            walletNumber: {
                isVisible: { list: false, filter: true, show: true, edit: false },
            },
            receiptImageUrl: {
                isVisible: { list: false, filter: true, show: true, edit: false },
            },
            rejectionReason: {
                isVisible: false,
            },
            rejectionMessage: {
                isVisible: false,
            },
        },
    }),
    // buildResource(PaymentOptionModel, 'Payment Options', 'CreditCard'),
    // buildResource(SubscriptionPlanModel, 'Subscription Plans', 'Book'),
];

export default resources;