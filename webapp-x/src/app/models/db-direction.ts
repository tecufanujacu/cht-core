export interface DbDirection {
  name: string;
  options: DbDirectionOption;
  allowed(): any;
  onDenied?(any): any;
  onChange?(any): any;
}

export interface DbDirectionOption {
  filter?(any): any;
  checkpoint?: string;
  heartbeat?: number;
  timeout?: number;
}
