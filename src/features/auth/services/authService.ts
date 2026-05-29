
import { insforge } from '../../../lib/insforge';
import type { User } from '../../../shared/types';
import type { LoginDto } from '../dtos/login.dto';
import type { RegisterDto } from '../dtos/register.dto';


const DEMO_USER: User = {
  id: '7a10e1bb-4b8f-4ead-80ce-2ddd78453964',
  full_name: 'Ciudadana Demo',
  email: 'ciudadana@reportatarija.bo',
  phone: '76543210',
  role: 'CITIZEN',
  area_id: null,
  is_active: true,
  reputation_points: 120,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};


export async function login(credentials: LoginDto): Promise<User> {
  const { data: authData, error: authError } = await insforge.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (authError) {
    throw new Error(authError.message || 'Credenciales inválidas');
  }

  if (!authData?.user) {
    throw new Error('No se pudo obtener la información del usuario');
  }

  const { data: users, error: dbError } = await insforge.database
    .from('users')
    .select()
    .eq('email', credentials.email)
    .limit(1);

  if (dbError) {
    throw new Error('Error al obtener perfil del usuario');
  }

  if (!users || users.length === 0) {
    throw new Error('Usuario no encontrado en el sistema');
  }

  const user = users[0] as User;

  if (!user.is_active) {
    throw new Error('Tu cuenta ha sido desactivada');
  }

  return user;
}


export async function register(userData: RegisterDto): Promise<User> {
  const { data: authData, error: authError } = await insforge.auth.signUp({
    email: userData.email,
    password: userData.password,
    name: userData.fullName,
  });

  if (authError) {
    const errorMessage = authError.message || 'Error al crear la cuenta';
    throw new Error(errorMessage);
  }

  if (!authData?.user) {
    throw new Error('No se pudo crear la cuenta');
  }

  const newUser = {
    id: authData.user.id,
    full_name: userData.fullName,
    email: userData.email,
    phone: userData.phone || null,
    role: 'CITIZEN' as const,
    is_active: true,
  };

  const { data: createdUsers, error: dbError } = await insforge.database
    .from('users')
    .insert(newUser)
    .select();

  if (dbError) {
    console.error('Error al crear perfil en DB:', dbError);
    return {
      ...newUser,
      area_id: null,
      reputation_points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (createdUsers?.[0] as User) || {
    ...newUser,
    area_id: null,
    reputation_points: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function logout(): Promise<void> {
  const { error } = await insforge.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
  }
}


export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: authData } = await insforge.auth.getCurrentUser();

    if (!authData?.user) {
      return null;
    }

    const { data: users } = await insforge.database
      .from('users')
      .select()
      .eq('email', authData.user.email)
      .limit(1);

    if (!users || users.length === 0) {
      return null;
    }

    return users[0] as User;
  } catch {
    return null;
  }
}

export async function loginDemo(): Promise<User> {
  try {
    const { data: users } = await insforge.database
      .from('users')
      .select()
      .eq('email', 'ciudadana@reportatarija.bo')
      .limit(1);

    if (users && users.length > 0) {
      return users[0] as User;
    }
  } catch (error) {
    console.error('Error al iniciar sesión en modo demo:', error);
  }

  return DEMO_USER;
}
