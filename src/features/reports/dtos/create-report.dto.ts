export interface CreateReportDto {
  title: string;
  description: string;
  category_id: number;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  neighborhood?: string | null;
}
