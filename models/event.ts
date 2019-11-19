
/**
 * This schema conforms to https://schema.org/Event
 */
export interface EventSchema {
    id?: string,
    identifier?: string,
    name?: string,
    description?: string,
    image?: string,
    disambiguatingDescription?: string,
    location: any,
    date: string,
    price?: string,
    startTime?: string,
    doorTime?: string,
    ageRestrictions?: string,
    status?: 'available'|'sold out'|'cancelled',
    url?: string;
}
