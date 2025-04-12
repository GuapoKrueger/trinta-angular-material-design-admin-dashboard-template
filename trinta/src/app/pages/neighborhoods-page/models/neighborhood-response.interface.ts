export interface NeighborhoodResponse {
    Id : number;
    Name: string;
    City: string;
    Municipal: string
    State: boolean;
    StateNeighborhood: string
    Latitude: string;
    Longitude: string
    HasSubdivision: boolean;
}

export interface NeighborhoodByIdResponse  {
    id: number;
    name: string;
    city: string;
    municipal: string;
    state: boolean;
    latitude: string;
    longitude: string;
    hasSubdivision: boolean;
    subdivisions: Subdivision[];
  }
  
  export interface Subdivision {
    id: number;
    name: string;
    streets: Street[];
  }
  
  export interface Street {
    id: number;
    name: string;
  }