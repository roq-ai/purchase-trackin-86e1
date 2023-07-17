import { SongInterface } from 'interfaces/song';
import { PlatformInterface } from 'interfaces/platform';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PurchaseInterface {
  id?: string;
  song_id?: string;
  platform_id?: string;
  units_purchased: number;
  purchase_date: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  song?: SongInterface;
  platform?: PlatformInterface;
  user?: UserInterface;
  _count?: {};
}

export interface PurchaseGetQueryInterface extends GetQueryInterface {
  id?: string;
  song_id?: string;
  platform_id?: string;
  user_id?: string;
}
