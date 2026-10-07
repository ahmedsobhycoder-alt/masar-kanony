interface AppConfigEntity {
    id: string;
    appName: string;
    appVersion :String;
    description: string;
    
    contactInfo: {
        whatsappNumber: string;
        email: string;
        workingHours: string;

    }
    stats: {
        courtsCount: number,
        governoratesCount: number,
        lastDataUpdate?: Date,
    },
    socialMediaLinks: {
        facebook?: string;
        instagram?: string;
    },
    createdAt?: Date;
    updatedAt?: Date;


}
export default AppConfigEntity;