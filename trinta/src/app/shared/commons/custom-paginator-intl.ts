import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elementos por página'; 
  paginatorIntl.nextPageLabel = 'Siguiente';
  paginatorIntl.previousPageLabel = 'Anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';

  return paginatorIntl;
}
