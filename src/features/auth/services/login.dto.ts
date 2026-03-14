/**
 *  Data Transfer Object
 *  Responsible for defining the data structure of the request and response
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}
