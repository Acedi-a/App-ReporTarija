import { uploadEvidence } from '@/src/features/evidence/services/evidenceService';
import { createReport } from '@/src/features/reports/services/reportService';
import {
  createReportSchema,
  MIN_REPORT_DESCRIPTION_LENGTH,
  MIN_REPORT_TITLE_LENGTH,
  type CreateReportFormData,
} from '@/src/lib/validations';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

const REPORTS_ROUTE = '/(tabs)/reports' as const;

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

const INITIAL_COORDINATES: Coordinates = { latitude: null, longitude: null };

export function useCreateReportForm() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>(INITIAL_COORDINATES);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateReportFormData>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: undefined,
      address: '',
      neighborhood: '',
    },
  });

  const watchDescription = watch('description', '');
  const watchTitle = watch('title', '');
  const watchCategory = watch('category_id');
  const watchAddress = watch('address', '');
  const watchNeighborhood = watch('neighborhood', '');

  const isFormInvalid =
    watchTitle.length < MIN_REPORT_TITLE_LENGTH ||
    watchDescription.length < MIN_REPORT_DESCRIPTION_LENGTH ||
    !watchCategory;

  useEffect(() => {
    if (params.categoryId) {
      const categoryIdNumber = parseInt(params.categoryId, 10);
      if (!isNaN(categoryIdNumber)) {
        setValue('category_id', categoryIdNumber, { shouldValidate: true });
      }
    }
  }, [params.categoryId, setValue]);

  function handleLocationChange(
    lat: number | null,
    lng: number | null,
    addr: string,
    neigh: string
  ) {
    setCoordinates({ latitude: lat, longitude: lng });
    setValue('address', addr, { shouldValidate: true });
    setValue('neighborhood', neigh, { shouldValidate: true });
  }

  function resetFormAndNavigate() {
    reset();
    setImageUri(null);
    setCoordinates(INITIAL_COORDINATES);
    router.push(REPORTS_ROUTE);
  }

  async function tryUploadEvidence(reportId: string, userId: string): Promise<boolean> {
    if (!imageUri) return true;

    try {
      await uploadEvidence(reportId, imageUri, userId);
      return true;
    } catch (imgError) {
      console.error('Error al subir la evidencia fotográfica:', imgError);
      Alert.alert(
        'Reporte registrado',
        'Tu reporte fue registrado con éxito, pero hubo un inconveniente al cargar la foto de evidencia.'
      );
      return false;
    }
  }

  async function onSubmit(data: CreateReportFormData) {
    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión para registrar un reporte.');
      return;
    }

    setSubmitting(true);
    try {
      const report = await createReport(user.id, {
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: data.address || null,
        neighborhood: data.neighborhood || null,
      });

      const evidenceUploadedOk = await tryUploadEvidence(report.id, user.id);

      if (evidenceUploadedOk) {
        Alert.alert('¡Excelente!', 'Tu reporte ha sido registrado con éxito.');
      }

      resetFormAndNavigate();
    } catch (error: any) {
      console.error('Error al enviar reporte:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al enviar el reporte.');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    submitting,
    isFormInvalid,
    imageUri,
    setImageUri,
    coordinates,
    watchAddress,
    watchNeighborhood,
    handleLocationChange,
  };
}
