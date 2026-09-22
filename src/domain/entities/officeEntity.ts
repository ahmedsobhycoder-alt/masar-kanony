import mongoose from "mongoose";
interface OfficeEntity {

    court: mongoose.Types.ObjectId;       // Needed because it specifies the court (e.g., الدور الأرضي)   
    floor: mongoose.Types.ObjectId;       // Needed because it specifies the floor (e.g., الدور الأرضي)
    officeType: mongoose.Types.ObjectId;
    // Core Details

    roomNumber: string;    // Maps to the room badge: "غرفة G04"

    description: string;   // Maps to the long description under the title

    // Location & Hours
    locationDirection: string;     // Maps to the specific location row: "يمين المدخل"
    startingWorkingHours: string;  // Extracted from "9:00 ص - 1:30 م" (Store as "09:00")
    endWorkingHours: string;       // Extracted from "9:00 ص - 1:30 م" (Store as "13:30")

    // Services
    services: string[];    // Array of strings mapping to the checklist under "الخدمات المتاحة"

    // Optional / Interactive
    mapUrl: string;       // Needed for the bottom button: "عرض الموقع على الخريطة"

}

export default OfficeEntity