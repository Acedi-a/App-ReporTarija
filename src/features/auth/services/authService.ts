// ============================================================
// Auth Service - Servicio de autenticación
// Conecta con InsForge Auth + tabla users
// Incluye modo demo para pruebas rápidas
// ============================================================

import { insforge } from '../../../lib/insforge';
import type { User } from '../../../shared/types';

// ============================================================
// Datos demo para pruebas sin conexión real
// ============================================================

const DEMO_USER: User = {
  id: '7a10e1bb-4b8f-4ead-80ce-2ddd78453964',
  full_name: 'Ciudadana Demo',
  email: 'ciudadana@reportatarija.bo',
  phone: '76543210',
  role: 'CITIZEN',
  area_id: null,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

// ============================================================
// Funciones del servicio
// ============================================================

/**
 * Iniciar sesión con correo y contraseña.
 * Primero autentica con InsForge Auth, luego busca el usuario en la tabla users.
 */
export async function login(email: string, password: string): Promise<User> {
  // Autenticar con InsForge Auth
  const { data: authData, error: authError } = await insforge.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message || 'Credenciales inválidas');
  }

  if (!authData?.user) {
    throw new Error('No se pudo obtener la información del usuario');
  }

  // Buscar el usuario en la tabla users por email
  const { data: users, error: dbError } = await insforge.database
    .from('users')
    .select()
    .eq('email', email)
    .limit(1);

  if (dbError) {
    throw new Error('Error al obtener perfil del usuario');
  }

  if (!users || users.length === 0) {
    throw new Error('Usuario no encontrado en el sistema');
  }

  const user = users[0] as User;

  // Verificar que sea ciudadano activo
  if (!user.is_active) {
    throw new Error('Tu cuenta ha sido desactivada');
  }

  return user;
}

/**
 * Registrar un nuevo ciudadano.
 * 1. Crea la cuenta en InsForge Auth
 * 2. Crea el registro en la tabla users con rol CITIZEN
 */
export async function register(
  fullName: string,
  email: string,
  phone: string | undefined,
  password: string,
): Promise<User> {
  // 1. Registrar en InsForge Auth
  const { data: authData, error: authError } = await insforge.auth.signUp({
    email,
    password,
    name: fullName,
  });

  if (authError) {
    const errorMessage = authError.message || 'Error al crear la cuenta';
    throw new Error(errorMessage);
  }

  if (!authData?.user) {
    throw new Error('No se pudo crear la cuenta');
  }

  // 2. Crear registro en la tabla users
  const newUser = {
    id: authData.user.id,
    full_name: fullName,
    email,
    phone: phone || null,
    role: 'CITIZEN' as const,
    is_active: true,
  };

  const { data: createdUsers, error: dbError } = await insforge.database
    .from('users')
    .insert(newUser)
    .select();

  if (dbError) {
    console.error('Error al crear perfil en DB:', dbError);
    // Si falla la DB pero el auth se creó, devolver datos básicos
    return {
      ...newUser,
      area_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (createdUsers?.[0] as User) || {
    ...newUser,
    area_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Cerrar sesión
 */
export async function logout(): Promise<void> {
  const { error } = await insforge.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

/**
 * Obtener el usuario actual autenticado
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: authData } = await insforge.auth.getCurrentUser();

    if (!authData?.user) {
      return null;
    }

    // Buscar en tabla users
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

/**
 * Acceso demo - devuelve el usuario ciudadano demo sin autenticación real
 */
export async function loginDemo(): Promise<User> {
  // Intentar obtener el usuario demo de la DB
  try {
    const { data: users } = await insforge.database
      .from('users')
      .select()
      .eq('email', 'ciudadana@reportatarija.bo')
      .limit(1);

    if (users && users.length > 0) {
      return users[0] as User;
    }
  } catch {
    // Si falla la conexión, devolver datos locales
  }

  return DEMO_USER;
}
