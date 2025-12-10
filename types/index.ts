/**
 * Define your TypeScript types and interfaces here
 * Example:
 */

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}
