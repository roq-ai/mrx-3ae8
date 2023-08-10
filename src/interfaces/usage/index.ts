import { VehicleInterface } from 'interfaces/vehicle';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface UsageInterface {
  id?: string;
  vehicle_id: string;
  user_id: string;
  usage_date: any;
  usage_time: any;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  user?: UserInterface;
  _count?: {};
}

export interface UsageGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
  user_id?: string;
}
