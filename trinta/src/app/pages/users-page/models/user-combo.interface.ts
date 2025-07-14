/**
 * Representa un usuario para combos/listas, típicamente con el rol de vigilante.
 * 'displayName' es el nombre a mostrar en el combo.
 */
export interface VigilanteList {
  id: number;
  displayName: string;
  username: string;
  email: string;
  roleName: string;
}
