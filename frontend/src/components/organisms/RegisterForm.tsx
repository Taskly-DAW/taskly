'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '@/schemas/authSchema';
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

export const RegisterForm = () => {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLocalError(null);
    try {
      const newData = { ...data, tenant_id: '', roles: ['admin'] };
      await registerUser(newData);
      router.push('/login');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Criar Conta
        </CardTitle>
        <CardDescription className="text-center">
          Preencha os dados abaixo para começar
        </CardDescription>
      </CardHeader>

      <CardContent>
        {localError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome Completo</Label>
            <Input
              id="username"
              placeholder="Ex: João Silva"
              {...register('username')}
            />
            {errors.username && (
              <span className="text-sm text-red-500">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
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
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando
                conta...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Cadastrar
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-gray-600 w-full">
          Já tem uma conta?{' '}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Faça login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};
