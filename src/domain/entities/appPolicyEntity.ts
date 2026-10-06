interface PolicySectionEntity{
    order : number;
    sectionTitle : string;
    sectionContent : string
}
interface AppPolicyEntity{
    type : string;
    intro : string;
    lastUpdate : Date;
    sections : PolicySectionEntity[]
}
export {AppPolicyEntity, PolicySectionEntity}
export default AppPolicyEntity;