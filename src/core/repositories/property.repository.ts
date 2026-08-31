import {
  Property,
  PropertyQuery,
  PropertySearchResult,
  PropertyType,
  Facility,
  Location,
  Partner,
  Project
} from '../types/property.types';

// Raw mock data imports
import rawProperties from '../../assets/mock/properties.json';
import rawProjects from '../../assets/mock/projects.json';
import rawPartners from '../../assets/mock/partners.json';
import rawLocations from '../../assets/mock/locations.json';
import rawFacilities from '../../assets/mock/facilities.json';
import rawPropertyTypes from '../../assets/mock/property-types.json';

export interface IPropertyRepository {
  getProperties(query?: PropertyQuery): Promise<PropertySearchResult>;
  getPropertyBySlug(slug: string): Promise<Property | null>;
  getPropertyById(id: string): Promise<Property | null>;
  getPropertiesByIds(ids: string[]): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getSimilarProperties(property: Property, limit?: number): Promise<Property[]>;
  getCities(): Promise<string[]>;
  getPropertyTypes(): Promise<PropertyType[]>;
  getFacilities(): Promise<Facility[]>;
}

const getArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.default)) return data.default;
  return [];
};

export class MockPropertyRepository implements IPropertyRepository {
  private hydratedProperties: Property[] = [];
  private locationsMap = new Map<string, Location>();
  private partnersMap = new Map<string, Partner>();
  private projectsMap = new Map<string, Project>();
  private facilitiesMap = new Map<string, Facility>();
  private propertyTypes: PropertyType[] = getArray(rawPropertyTypes) as PropertyType[];

  constructor() {
    this.initMaps();
    this.hydrate();
  }

  private initMaps() {
    (getArray(rawLocations) as Location[]).forEach((loc) => this.locationsMap.set(loc.id, loc));
    (getArray(rawPartners) as Partner[]).forEach((p) => this.partnersMap.set(p.id, p));
    (getArray(rawProjects) as Project[]).forEach((proj) => this.projectsMap.set(proj.id, proj));
    (getArray(rawFacilities) as Facility[]).forEach((fac) => this.facilitiesMap.set(fac.id, fac));
  }

  private hydrate() {
    this.hydratedProperties = (getArray(rawProperties) as any[]).map((raw) => {
      const location = this.locationsMap.get(raw.locationId) || {
        id: raw.locationId,
        address: 'Alamat tidak terdaftar',
        city: 'Indonesia',
        province: 'Indonesia',
        latitude: -0.9,
        longitude: 100.3,
      };

      const partner = raw.partnerId ? this.partnersMap.get(raw.partnerId) : undefined;
      const project = raw.projectId ? this.projectsMap.get(raw.projectId) : undefined;
      const facilities = (raw.facilityIds || [])
        .map((fId: string) => this.facilitiesMap.get(fId))
        .filter(Boolean) as Facility[];

      return {
        ...raw,
        location,
        partner,
        project,
        facilities,
      } as Property;
    });
  }

  private async simulateLatency<T>(data: T, ms = 120): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  }

  async getProperties(query: PropertyQuery = {}): Promise<PropertySearchResult> {
    let result = [...this.hydratedProperties];

    // Smart search filter (title, description, tagline, city, district, address, project, partner, certificate)
    if (query.search && query.search.trim() !== '') {
      const rawQuery = query.search.toLowerCase().trim();
      const tokens = rawQuery.split(/\s+/).filter(Boolean);

      result = result.filter((p) => {
        const searchableText = [
          p.title,
          p.description,
          p.tagline || '',
          p.location.city,
          p.location.district || '',
          p.location.address,
          p.propertyTypeName,
          p.project?.name || '',
          p.partner?.name || '',
          p.specification.certificate || '',
          `${p.specification.bedrooms} kamar`,
          `${p.specification.bedrooms} kt`,
          `${p.specification.bathrooms} km`,
          `tipe ${p.specification.buildingArea}`,
          `type ${p.specification.buildingArea}`,
        ]
          .join(' ')
          .toLowerCase();

        // Match all tokens or whole string
        return tokens.every((token) => searchableText.includes(token));
      });
    }

    // Filter by city
    if (query.city && query.city !== 'ALL') {
      result = result.filter(
        (p) => p.location.city.toLowerCase() === query.city!.toLowerCase()
      );
    }

    // Filter by property type slug or id
    if (query.propertyType && query.propertyType !== 'ALL') {
      result = result.filter(
        (p) =>
          p.propertyTypeId === query.propertyType ||
          p.propertyTypeId.toLowerCase().includes(query.propertyType!.toLowerCase())
      );
    }

    // Filter by price range
    if (query.minPrice !== undefined && query.minPrice > 0) {
      result = result.filter((p) => p.price >= query.minPrice!);
    }
    if (query.maxPrice !== undefined && query.maxPrice > 0) {
      result = result.filter((p) => p.price <= query.maxPrice!);
    }

    // Filter by bedrooms
    if (query.bedrooms !== undefined) {
      if (query.bedrooms === '4+') {
        result = result.filter((p) => p.specification.bedrooms >= 4);
      } else {
        const beds = Number(query.bedrooms);
        if (!isNaN(beds) && beds > 0) {
          result = result.filter((p) => p.specification.bedrooms >= beds);
        }
      }
    }

    // Filter by bathrooms
    if (query.bathrooms !== undefined) {
      if (query.bathrooms === '3+') {
        result = result.filter((p) => p.specification.bathrooms >= 3);
      } else {
        const baths = Number(query.bathrooms);
        if (!isNaN(baths) && baths > 0) {
          result = result.filter((p) => p.specification.bathrooms >= baths);
        }
      }
    }

    // Filter by facilities
    if (query.facilities && query.facilities.length > 0) {
      result = result.filter((p) =>
        query.facilities!.every((requiredFacId) => p.facilityIds.includes(requiredFacId))
      );
    }

    // Filter by availability
    if (query.availability && query.availability.length > 0) {
      result = result.filter((p) => query.availability!.includes(p.availability));
    }

    // Sorting logic
    const sort = query.sort || 'relevance';
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'land_area_desc':
        result.sort((a, b) => b.specification.landArea - a.specification.landArea);
        break;
      case 'building_area_desc':
        result.sort((a, b) => b.specification.buildingArea - a.specification.buildingArea);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'relevance':
      default:
        // Prioritize featured then newest
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    const page = query.page || 1;
    const limit = query.limit || 12;
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = result.slice((page - 1) * limit, page * limit);

    return this.simulateLatency({
      properties: paginated,
      total,
      page,
      limit,
      totalPages,
    });
  }

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    const item = this.hydratedProperties.find((p) => p.slug === slug) || null;
    return this.simulateLatency(item);
  }

  async getPropertyById(id: string): Promise<Property | null> {
    const item = this.hydratedProperties.find((p) => p.id === id) || null;
    return this.simulateLatency(item);
  }

  async getPropertiesByIds(ids: string[]): Promise<Property[]> {
    if (!ids || ids.length === 0) return [];
    const items = this.hydratedProperties.filter((p) => ids.includes(p.id));
    return this.simulateLatency(items);
  }

  async getFeaturedProperties(limit = 4): Promise<Property[]> {
    const items = this.hydratedProperties
      .filter((p) => p.featured)
      .slice(0, limit);
    return this.simulateLatency(items);
  }

  async getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
    const items = this.hydratedProperties
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.location.city === property.location.city ||
            p.propertyTypeId === property.propertyTypeId)
      )
      .slice(0, limit);
    return this.simulateLatency(items);
  }

  async getCities(): Promise<string[]> {
    const cities = Array.from(
      new Set(this.hydratedProperties.map((p) => p.location.city))
    ).sort();
    return this.simulateLatency(cities, 20);
  }

  async getPropertyTypes(): Promise<PropertyType[]> {
    return this.simulateLatency(this.propertyTypes, 20);
  }

  async getFacilities(): Promise<Facility[]> {
    return this.simulateLatency(Array.from(this.facilitiesMap.values()), 20);
  }
}

// Singleton repository instance
export const propertyRepository: IPropertyRepository = new MockPropertyRepository();
