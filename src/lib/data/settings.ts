export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  enableVoiceInput: boolean;
  requireEmailOtp: boolean;
  rateLimitPerIp: number;
  maintenanceMode: boolean;
  updatedAt: string;
}

let settingsStore: PlatformSettings = {
  siteName: "Build Tamil Nadu",
  supportEmail: "vanakkam@buildtamilnadu.in",
  enableVoiceInput: true,
  requireEmailOtp: false, // seamless 1-click instant verification by default, toggleable to OTP
  rateLimitPerIp: 10,
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
};

export function getPlatformSettings(): PlatformSettings {
  return { ...settingsStore };
}

// Alias for server-side siteConfig usage
export const getStoredSettings = getPlatformSettings;

export function updatePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  settingsStore = {
    ...settingsStore,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return { ...settingsStore };
}
