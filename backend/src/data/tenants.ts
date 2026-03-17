import { Tenant } from "../domain/tenant";

export const tenants: Tenant[] = [
    {
        id: "tenant_brightmarket",
        name: "BrightMarket",
        domain: "brightmarket.com",
        industry: "ecommerce"
    },
    {
        id: "tenant_cloudsync",
        name: "CloudSync",
        domain: "cloudsync.io",
        industry: "saas"
    }
];