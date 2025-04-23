export interface UserCreate {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    role: string,
    foto?: File,
    permissions: { id: number; name: string }[];       // ahora es array de objetos
    fraccionamientos: { id: number; name: string }[];  // ahora es array de objetos
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    checked: boolean;
}

export interface Fraccionmiento {
    checked: boolean;
    id: string;
    name: string;
}
