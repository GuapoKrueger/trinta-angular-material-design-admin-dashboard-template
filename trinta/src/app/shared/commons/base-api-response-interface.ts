export interface BaseApiResponse<T> {
    isSuccess: boolean;
    data: any;
    message: string;
    totalRecords: number;
    errors: T;
  }