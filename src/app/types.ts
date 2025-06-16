export interface ClanInfo {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface League {
  id: number;
  name: string;
  iconUrls: {
    small: string;
    tiny: string;
    medium: string;
  };
}

export interface Troop {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface Hero {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface Spell {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface Achievement {
  name: string;
  stars: number;
  value: number;
  target: number;
  info: string;
  completionInfo: string | null;
  village: string;
}

export interface PlayerData {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  clan?: ClanInfo;
  league?: League;
  troops?: Troop[];
  heroes?: Hero[];
  spells?: Spell[];
  achievements?: Achievement[];
  role?: string;
  warPreference?: string;
  donations: number;
  donationsReceived: number;
} 