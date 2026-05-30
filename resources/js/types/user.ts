export interface UserProps {
  id: number;
  name: string;
  email?: string;
  login: string;
  password: string;
  role: 'student' | 'teacher';
  group?: string;
  department?: string;
}
