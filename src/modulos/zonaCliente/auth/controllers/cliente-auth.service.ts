import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type Cliente from '../../_shared_/models/Cliente';

interface ApiResponse<T> {
  codigo: number;
  mensaje?: string;
  datos?: T;
}

interface LoginData {
  accessToken?: string;
  refreshToken?: string;
  cliente?: Cliente;
}

interface GoogleUrlData {
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteAuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/Cliente';

  login(email: string, password: string): Promise<ApiResponse<LoginData>> {
    return firstValueFrom(
      this.http.post<ApiResponse<LoginData>>(`${this.baseUrl}/Login`, { email, password }),
    );
  }

  registro(nombre: string, email: string, password: string): Promise<ApiResponse<LoginData>> {
    return firstValueFrom(
      this.http.post<ApiResponse<LoginData>>(`${this.baseUrl}/Registro`, {
        nombre,
        email,
        password,
      }),
    );
  }

  getGoogleUrlCallBack(): Promise<ApiResponse<GoogleUrlData>> {
    return firstValueFrom(
      this.http.get<ApiResponse<GoogleUrlData>>(`${this.baseUrl}/LoginGoogle`),
    );
  }
}
