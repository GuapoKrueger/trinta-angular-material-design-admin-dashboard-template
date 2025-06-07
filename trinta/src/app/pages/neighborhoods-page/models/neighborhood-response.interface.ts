export interface NeighborhoodResponse {
    id : number;
    name: string;
    city: string;
    municipal: string
    state: boolean;
    stateNeighborhood: string
    latitude: string;
    longitude: string
    hasSubdivision: boolean;
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