import { SelectOption } from '@/types/dashboard';

const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const authService = {
  getToken: (): string | null => {
    const token = localStorage.getItem('auth-storage');

    return token ? JSON.parse(token) : null;
  },

  getTenantId: (): string | null => {
    return localStorage.getItem('tenantId');
  },

  fetchUsers: async (): Promise<SelectOption[]> => {
    const token = authService.getToken();
    const tenantId = authService.getTenantId();

    if (!token) {
      throw new Error('Token de autenticação ou tenantId não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/auth/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.state.token}`,
          'x-tenant-id': '',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
      }

      const users: User[] = await response.json();

      return users.map((user) => ({
        value: user.id.toString(),
        label: user.username || user.email,
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
};

export default authService;
