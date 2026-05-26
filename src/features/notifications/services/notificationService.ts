// ============================================================
// Notification Service - Notificaciones internas del ciudadano
// Conectado a la base de datos de InsForge
// ============================================================

import { insforge } from '../../../lib/insforge';
import type { Notification } from '../../../shared/types';

/**
 * Obtener notificaciones del ciudadano.
 */
export async function getMyNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await insforge.database
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error al obtener tus notificaciones');
  }

  return (data as Notification[]) || [];
}

/**
 * Marcar una notificación específica como leída.
 */
export async function markNotificationAsRead(id: number): Promise<void> {
  const { error } = await insforge.database
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    throw new Error('Error al actualizar notificación');
  }
}
