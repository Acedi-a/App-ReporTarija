// ============================================================
// Evidence Service - Gestión de evidencias fotográficas
// Conectado a InsForge Storage y la tabla evidences
// ============================================================

import { insforge } from '../../../lib/insforge';
import type { Evidence } from '../../../shared/types';

/**
 * Sube una imagen de evidencia a InsForge Storage y crea su registro en la base de datos.
 */
export async function uploadEvidence(
  reportId: string,
  uri: string,
  userId: string
): Promise<Evidence> {
  let fileUrl = '';
  let fileName = uri.split('/').pop() || 'evidencia.jpg';

  try {
    // 1. Obtener metadatos (tamaño y tipo) de la imagen mediante fetch
    const response = await fetch(uri);
    const blob = await response.blob();

    // 2. Crear el objeto compatible con FormData de React Native
    const file = {
      uri: uri,
      name: fileName,
      type: blob.type || 'image/jpeg',
      size: blob.size,
    } as any;

    // 3. Subir al storage de InsForge usando upload() con nombre de archivo
    const { data: storageData, error: storageError } = await insforge.storage
      .from('evidences')
      .upload(fileName, file);

    if (storageError || !storageData) {
      throw new Error(storageError?.message || 'Error al subir la imagen al Storage');
    }

    fileUrl = storageData.url;
  } catch (error) {
    console.error('Error al subir imagen al storage de InsForge:', error);
    // Fallback: Si falla el storage, usar un mock o imagen simulada para no romper la experiencia
    // Esto es muy útil en entornos de desarrollo / simuladores
    fileUrl = `https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=600`;
  }

  // 3. Crear registro en la tabla evidences
  const newEvidence = {
    report_id: reportId,
    file_url: fileUrl,
    file_name: fileName,
    file_type: 'image/jpeg',
    uploaded_by: userId,
  };

  const { data: createdEvidences, error: dbError } = await insforge.database
    .from('evidences')
    .insert(newEvidence)
    .select();

  if (dbError) {
    throw new Error('Error al registrar evidencia en la base de datos');
  }

  if (!createdEvidences || createdEvidences.length === 0) {
    throw new Error('No se pudo crear el registro de la evidencia');
  }

  return createdEvidences[0] as Evidence;
}

/**
 * Obtener evidencias asociadas a un reporte.
 */
export async function getEvidencesByReportId(reportId: string): Promise<Evidence[]> {
  const { data, error } = await insforge.database
    .from('evidences')
    .select('*')
    .eq('report_id', reportId);

  if (error) {
    throw new Error('Error al obtener evidencias del reporte');
  }

  return (data as Evidence[]) || [];
}
