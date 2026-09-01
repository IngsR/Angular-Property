export type TransactionType = 'BUY';

export type PropertyAvailability = 'AVAILABLE' | 'LIMITED' | 'SOLD' | 'UNAVAILABLE';

export type ImageCategory =
  | 'EXTERIOR'
  | 'INTERIOR'
  | 'BEDROOM'
  | 'BATHROOM'
  | 'KITCHEN'
  | 'FACILITY'
  | 'ENVIRONMENT';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  category: ImageCategory;
  sortOrder: number;
}

export interface FloorPlanRoom {
  name: string;
  dimension: string; // e.g. "3.5 x 4.0 m"
  area: number; // in m2
  type?: 'bedroom' | 'living' | 'kitchen' | 'bathroom' | 'balcony' | 'carport' | 'garden' | 'other';
}

export interface FloorPlan {
  id: string;
  url: string;
  name: string;
  floor: number;
  area: number; // in m2
  bedrooms?: number;
  bathrooms?: number;
  rooms?: FloorPlanRoom[];
  note?: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  category?: 'SECURITY' | 'WELLNESS' | 'LIFESTYLE' | 'CONVENIENCE';
}

export interface Location {
  id: string;
  address: string;
  district?: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  nearbyPlaces?: Array<{
    name: string;
    category: 'TRANSIT' | 'EDUCATION' | 'SHOPPING' | 'HOSPITAL';
    distance: string;
  }>;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  verified: boolean;
  phone?: string;
  email?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  partnerId: string;
  locationId: string;
  totalUnits?: number;
  completionYear?: number;
}

export interface Unit {
  id: string;
  projectId: string;
  propertyId: string;
  unitCode: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  price: number;
}

export interface PropertyType {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PropertySpecification {
  bedrooms: number;
  bathrooms: number;
  landArea: number; // in m2
  buildingArea: number; // in m2
  floors: number;
  parking: number;
  certificate?: string; // e.g. SHM, HGB
  electricity?: string; // e.g. 2200 VA
  furnishing?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULL_FURNISHED';
  facing?: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline?: string;
  transactionType: TransactionType;
  price: number;
  currency: 'IDR';
  propertyTypeId: string;
  propertyTypeName: string;
  specification: PropertySpecification;
  locationId: string;
  location: Location;
  images: PropertyImage[];
  floorPlans: FloorPlan[];
  facilityIds: string[];
  facilities: Facility[];
  availability: PropertyAvailability;
  partnerId?: string;
  partner?: Partner;
  projectId?: string;
  project?: Project;
  featured?: boolean;
  yearBuilt?: number;
  createdAt: string;
}

export type PropertySortOption = 
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'land_area_desc'
  | 'building_area_desc';

export interface PropertyQuery {
  search?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | '4+';
  bathrooms?: number | '3+';
  minLandArea?: number;
  maxLandArea?: number;
  minBuildingArea?: number;
  maxBuildingArea?: number;
  facilities?: string[];
  availability?: PropertyAvailability[];
  sort?: PropertySortOption;
  page?: number;
  limit?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
