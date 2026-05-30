export interface SubmissionProps {
  id: number;
  material_id: number;
  material_title: string;
  student_id: number;
  student_name: string;
  student_group?: string;
  file_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  grade?: 2 | 3 | 4 | 5;
  teacher_comment?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}
