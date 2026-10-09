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

const withNavigation = (
    model: any,
    navigationName: string,
    icon = 'Folder',
    options: Record<string, any> = {}
) => {
    const defaultProperties = {
        _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
    };

    return {
        resource: model,
        options: {
            navigation: { name: navigationName, icon },
            ...options,
            properties: {
                ...defaultProperties,
                ...(options.properties ?? {}),
            },
        },
    };
};

const userResource = withNavigation(UserModel, 'User Management', 'User', {
    listProperties: ['name', 'email', 'phone', 'role', 'createdAt'],
    id : "User",
    properties: {
        password: {
            isVisible: false,
        },
        resetCode: {
            isVisible: false,
        },
        resetCodeExpires: {
            isVisible: false,
        },
        passwordChangedAt: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
    },
});

const resources: Array<ResourceWithOptions | any> = [
    userResource,
   // withNavigation(CourtModel, 'Courts', 'Building'),
    withNavigation(AdsModel, 'Ads', 'Image'),
    withNavigation(GovernorateModel, 'Governorates', 'Map'),
    withNavigation(AppConfigModel, 'App Config', 'Settings'),
   //  withNavigation(AppPolicyModel, 'App Policy', 'File'),
    // withNavigation(CityModel, 'Cities', 'Map'),
    // 
    // withNavigation(CourtTypeModel, 'Court Types', 'Folder'),
    // withNavigation(FloorModel, 'Floors', 'Layers'),
    // withNavigation(FloorNameModel, 'Floor Names', 'List'),
    // 
//      withNavigation(OfficeModel, 'Offices', 'Building', {
//          options: {
//     properties: {
//       services: {
//         type: 'string',
//         isArray: true,
//       },
//     },
//   },
//      }),
    // withNavigation(OfficeTypeModel, 'Office Types', 'Folder'),
     withNavigation(PaymentModel, 'Payments', 'Money',{
        properties: {
            rejectReason: {
                isVisible: false,
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
        },
     }),
    // withNavigation(PaymentOptionModel, 'Payment Options', 'CreditCard'),
    // withNavigation(SubscriptionPlanModel, 'Subscription Plans', 'Book'),
];

export default resources;