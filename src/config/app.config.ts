interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: ['End Customer'],
  tenantRoles: ['Business Owner', 'Admin User', 'Data Manager', 'Purchase Analyst'],
  tenantName: 'Organization',
  applicationName: 'purchase tracking',
  addOns: [],
};
