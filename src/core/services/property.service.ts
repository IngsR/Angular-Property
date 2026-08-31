import {
  Property,
  PropertyQuery,
  PropertySearchResult,
  PropertyType,
  Facility,
} from '../types/property.types';
import { IPropertyRepository, propertyRepository } from '../repositories/property.repository';

export class PropertyService {
  private static instance: PropertyService;
  private repository: IPropertyRepository;

  private constructor(repo: IPropertyRepository = propertyRepository) {
    this.repository = repo;
  }

  public static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  public async getProperties(query?: PropertyQuery): Promise<PropertySearchResult> {
    return this.repository.getProperties(query);
  }

  public async getPropertyBySlug(slug: string): Promise<Property | null> {
    return this.repository.getPropertyBySlug(slug);
  }

  public async getPropertyById(id: string): Promise<Property | null> {
    return this.repository.getPropertyById(id);
  }

  public async getPropertiesByIds(ids: string[]): Promise<Property[]> {
    return this.repository.getPropertiesByIds(ids);
  }

  public async getFeaturedProperties(limit = 4): Promise<Property[]> {
    return this.repository.getFeaturedProperties(limit);
  }

  public async getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
    return this.repository.getSimilarProperties(property, limit);
  }

  public async getCities(): Promise<string[]> {
    return this.repository.getCities();
  }

  public async getPropertyTypes(): Promise<PropertyType[]> {
    return this.repository.getPropertyTypes();
  }

  public async getFacilities(): Promise<Facility[]> {
    return this.repository.getFacilities();
  }
}

export const propertyService = PropertyService.getInstance();
