import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class HttpServiceProviders {
  constructor(
    private httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async get<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    console.log('url===>', url, config);
    return firstValueFrom(
      this.httpService.get(url, config).pipe(
        map((response: AxiosResponse<T, T>) => {
          return response.data;
        }),
      ),
    );
  }

  async post<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    return firstValueFrom(
      this.httpService.post(url, config.data, config).pipe(
        map((response: AxiosResponse<T, T>) => {
          return response.data;
        }),
      ),
    );
  }

  async put<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    return firstValueFrom(
      this.httpService.put(url, config).pipe(
        map((response: AxiosResponse<T, T>) => {
          return response.data;
        }),
      ),
    );
  }

  async patch<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    return firstValueFrom(
      this.httpService.patch(url, config).pipe(
        map((response: AxiosResponse<T, T>) => {
          return response.data;
        }),
      ),
    );
  }

  async delete<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    return firstValueFrom(
      this.httpService.delete(url, config).pipe(
        map((response: AxiosResponse<T, T>) => {
          return response.data;
        }),
      ),
    );
  }
}
