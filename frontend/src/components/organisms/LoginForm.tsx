'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { loginSchema, LoginFormValues } from '@/schemas/authSchema';
import { useAuthStore } from '@/store/authStore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const LoginForm = () => {
  const router = useRouter();

  const { login, isLoading, error } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLocalError(null);
    console.log(data);
    try {
      await login({ ...data, tenant_id: '' });
      router.push('/');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Acessar Conta
        </CardTitle>
        <CardDescription className="text-center">
          Entre com seu e-mail e senha para continuar
        </CardDescription>
      </CardHeader>

      <CardContent>
        {(localError || error) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError || error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="text"
              placeholder="seu@email.com"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-gray-600 w-full">
          Não tem uma conta?{' '}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Cadastre-se
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};
