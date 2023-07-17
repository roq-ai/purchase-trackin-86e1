import { PurchaseInterface } from 'interfaces/purchase';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SongInterface {
  id?: string;
  name: string;
  version: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  purchase?: PurchaseInterface[];
  user?: UserInterface;
  _count?: {
    purchase?: number;
  };
}

export interface SongGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  version?: string;
  user_id?: string;
}
