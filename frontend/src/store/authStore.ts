import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginFormValues, RegisterFormValues } from '@/schemas/authSchema';
import Cookies from 'js-cookie';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface AuthState {
  token: string | null;
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginFormValues) => Promise<void>;
  register: (data: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            'http://localhost:8000/auth/auth/login',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Falha na autenticação');
          }

          const data: AuthResponse = await response.json();

          Cookies.set('auth-token', data.access_token, { expires: 1 });

          set({
            token: data.access_token,
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.error(error);
          set({
            error: error.message || 'Erro ao conectar com o servidor',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { confirmPassword, ...payload } = formData;

          const response = await fetch(
            'http://localhost:8000/auth/auth/register',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Falha no cadastro');
          }

          set({ isLoading: false });
        } catch (error: any) {
          console.error(error);
          set({
            error: error.message || 'Erro ao realizar cadastro',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove('auth-token');
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
