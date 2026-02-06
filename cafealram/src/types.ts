export type RequestType = 'WATER' | 'BILL' | 'WAITER' | 'CLEAN' | 'MANAGER';

export type RequestStatus = 'PENDING' | 'COMPLETED';

export interface ServiceRequest {
    id: string;
    restaurantId: string;
    tableId: string;
    type: RequestType;
    status: RequestStatus;
    createdAt: number;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface Restaurant {
    id: string;
    name: string;
    tableCount: number;
    menu: MenuItem[];
    menuImage?: string | null;
    logo?: string | null;
    instagramUrl?: string;
    googleMapsUrl?: string;
    websiteUrl?: string;
}
