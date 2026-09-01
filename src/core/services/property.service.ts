import { Injectable } from '@angular/core';
import {
  Property,
  PropertyQuery,
  PropertySearchResult,
  PropertyType,
  Facility,
  Location,
  Partner,
  Project,
} from '../types/property.types';

// Raw mock data imports
import rawProperties from '../../assets/mock/properties.json';
import rawProjects from '../../assets/mock/projects.json';
import rawPartners from '../../assets/mock/partners.json';
import rawLocations from '../../assets/mock/locations.json';
import rawFacilities from '../../assets/mock/facilities.json';
import rawPropertyTypes from '../../assets/mock/property-types.json';

const getArray = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && 'default' in data && Array.isArray((data as { default: unknown }).default)) {
    return (data as { default: T[] }).default;
  }
  return [];
};

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private hydratedProperties: Property[] = [];
  private locationsMap = new Map<string, Location>();
  private partnersMap = new Map<string, Partner>();
  private projectsMap = new Map<string, Project>();
  private facilitiesMap = new Map<string, Facility>();
  private propertyTypes: PropertyType[] = getArray<PropertyType>(rawPropertyTypes);

  constructor() {
    this.initMaps();
    this.hydrate();
  }

  private initMaps(): void {
    getArray<Location>(rawLocations).forEach((loc) => this.locationsMap.set(loc.id, loc));
    getArray<Partner>(rawPartners).forEach((p) => this.partnersMap.set(p.id, p));
    getArray<Project>(rawProjects).forEach((proj) => this.projectsMap.set(proj.id, proj));
    getArray<Facility>(rawFacilities).forEach((fac) => this.facilitiesMap.set(fac.id, fac));
  }

  private hydrate(): void {
    const rawList = getArray<Record<string, unknown>>(rawProperties);
    this.hydratedProperties = rawList.map((raw) => {
      const locationId = (raw['locationId'] as string) || '';
      const location: Location = this.locationsMap.get(locationId) || {
        id: locationId,
        address: 'Alamat tidak terdaftar',
        city: 'Indonesia',
        province: 'Indonesia',
        latitude: -0.9,
        longitude: 100.3,
      };

      const partnerId = raw['partnerId'] as string | undefined;
      const partner = partnerId ? this.partnersMap.get(partnerId) : undefined;

      const projectId = raw['projectId'] as string | undefined;
      const project = projectId ? this.projectsMap.get(projectId) : undefined;

      const facilityIds = (raw['facilityIds'] as string[]) || [];
      const facilities = facilityIds
        .map((fId) => this.facilitiesMap.get(fId))
        .filter((f): f is Facility => Boolean(f));

      return {
        ...raw,
        location,
        partner,
        project,
        facilities,
      } as unknown as Property;
    });
  }

  private async simulateLatency<T>(data: T, ms = 80): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  }

  async getProperties(query: PropertyQuery = {}): Promise<PropertySearchResult> {
    let result = [...this.hydratedProperties];

    // Smart search filter
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

        return tokens.every((token) => searchableText.includes(token));
      });
    }

    // Filter by city
    if (query.city && query.city !== 'ALL') {
      result = result.filter(
        (p) => p.location.city.toLowerCase() === query.city!.toLowerCase()
      );
    }

    // Filter by property type
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
    return this.simulateLatency(cities, 10);
  }

  async getPropertyTypes(): Promise<PropertyType[]> {
    return this.simulateLatency(this.propertyTypes, 10);
  }

  async getFacilities(): Promise<Facility[]> {
    return this.simulateLatency(Array.from(this.facilitiesMap.values()), 10);
  }
}
