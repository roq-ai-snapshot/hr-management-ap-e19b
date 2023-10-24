import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface HrManagerInterface {
  id?: string;
  user_id: string;
  company_id: string;
  start_date: any;
  end_date?: any;
  experience: number;
  specialization: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  company?: CompanyInterface;
  _count?: {};
}

export interface HrManagerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  company_id?: string;
  specialization?: string;
}
