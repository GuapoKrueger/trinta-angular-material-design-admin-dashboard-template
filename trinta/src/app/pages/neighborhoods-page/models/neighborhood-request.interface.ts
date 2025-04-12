
export interface Neighborhood {
    id: number;
    name: string;
    city: string;
    municipal: string;
    state: boolean;
    latitude: string;
    longitude: string;
    hasSubdivision: boolean;
    subdivisions?: Subdivision[];
  }

  export interface Subdivision {
    id:number;
    name: string;
    streets?: Street[];
  }
  
  export interface Street {
    id: number;
    name: string;
  }

  export interface NeighborhoodUpdate {
    id: number;
    name?: string;
    city?: string;
    municipal?: string;
    state?: boolean;
    latitude?: string;
    longitude?: string;
    hasSubdivision: boolean;
    subdivisions?: SubdivisionUpdate[];
  }
  
  export interface SubdivisionUpdate {
    id?: number;
    name?: string;
    delete: boolean;
    streets?: StreetUpdate[];
  }
  
  export interface StreetUpdate {
    id?: number;
    name?: string;
    delete: boolean;
  }
  
  