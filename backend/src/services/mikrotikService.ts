import { RouterOSAPI } from 'node-routeros';

interface UserSession {
  sessionId: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  bytesIn: number;
  bytesOut: number;
  uptime: string;
}

class MikrotikService {
  private api: RouterOSAPI;
  private host: string;
  private username: string;
  private password: string;
  private port: number;

  constructor() {
    this.host = process.env.MIKROTIK_HOST || '192.168.1.1';
    this.username = process.env.MIKROTIK_USERNAME || 'admin';
    this.password = process.env.MIKROTIK_PASSWORD || '';
    this.port = parseInt(process.env.MIKROTIK_PORT || '8728');
    
    this.api = new RouterOSAPI({
      host: this.host,
      user: this.username,
      password: this.password,
      port: this.port
    });
  }

  async connect(): Promise<void> {
    try {
      await this.api.connect();
      console.log('✅ Connected to MikroTik router');
    } catch (error) {
      console.error('❌ Failed to connect to MikroTik router:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.api.close();
    } catch (error) {
      console.error('Error disconnecting from router:', error);
    }
  }

  async createHotspotUser(username: string, password: string, profile: string = 'default'): Promise<void> {
    try {
      await this.connect();
      
      await this.api.write('/ip/hotspot/user/add', [
        `=name=${username}`,
        `=password=${password}`,
        `=profile=${profile}`,
        '=disabled=no'
      ]);
      
      console.log(`✅ Created hotspot user: ${username}`);
    } catch (error) {
      console.error('❌ Failed to create hotspot user:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async removeHotspotUser(username: string): Promise<void> {
    try {
      await this.connect();
      
      // Find user by name
      const users = await this.api.write('/ip/hotspot/user/print', [`?name=${username}`]);
      
      if (users.length > 0) {
        const userId = users[0]['.id'];
        await this.api.write('/ip/hotspot/user/remove', [`=.id=${userId}`]);
        console.log(`✅ Removed hotspot user: ${username}`);
      }
    } catch (error) {
      console.error('❌ Failed to remove hotspot user:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async getActiveUsers(): Promise<UserSession[]> {
    try {
      await this.connect();
      
      const activeSessions = await this.api.write('/ip/hotspot/active/print');
      
      return activeSessions.map((session: any) => ({
        sessionId: session['.id'],
        username: session.user || 'unknown',
        ipAddress: session.address || '',
        macAddress: session['mac-address'] || '',
        bytesIn: parseInt(session['bytes-in'] || '0'),
        bytesOut: parseInt(session['bytes-out'] || '0'),
        uptime: session.uptime || '0s'
      }));
    } catch (error) {
      console.error('❌ Failed to get active users:', error);
      return [];
    } finally {
      await this.disconnect();
    }
  }

  async disconnectUser(sessionId: string): Promise<void> {
    try {
      await this.connect();
      
      await this.api.write('/ip/hotspot/active/remove', [`=.id=${sessionId}`]);
      console.log(`✅ Disconnected user session: ${sessionId}`);
    } catch (error) {
      console.error('❌ Failed to disconnect user:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async createUserProfile(profileName: string, rateLimit: string, sessionTimeout: string): Promise<void> {
    try {
      await this.connect();
      
      await this.api.write('/ip/hotspot/user/profile/add', [
        `=name=${profileName}`,
        `=rate-limit=${rateLimit}`,
        `=session-timeout=${sessionTimeout}`,
        '=shared-users=1',
        '=status-autorefresh=1m'
      ]);
      
      console.log(`✅ Created user profile: ${profileName}`);
    } catch (error) {
      console.error('❌ Failed to create user profile:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async updateUserProfile(username: string, profile: string): Promise<void> {
    try {
      await this.connect();
      
      const users = await this.api.write('/ip/hotspot/user/print', [`?name=${username}`]);
      
      if (users.length > 0) {
        const userId = users[0]['.id'];
        await this.api.write('/ip/hotspot/user/set', [
          `=.id=${userId}`,
          `=profile=${profile}`
        ]);
        console.log(`✅ Updated user profile for ${username} to ${profile}`);
      }
    } catch (error) {
      console.error('❌ Failed to update user profile:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async getUserUsage(username: string): Promise<{ bytesIn: number; bytesOut: number; uptime: string } | null> {
    try {
      await this.connect();
      
      const activeSessions = await this.api.write('/ip/hotspot/active/print', [`?user=${username}`]);
      
      if (activeSessions.length > 0) {
        const session = activeSessions[0];
        return {
          bytesIn: parseInt(session['bytes-in'] || '0'),
          bytesOut: parseInt(session['bytes-out'] || '0'),
          uptime: session.uptime || '0s'
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get user usage:', error);
      return null;
    } finally {
      await this.disconnect();
    }
  }

  // Helper method to convert speed to MikroTik format
  formatSpeedLimit(uploadSpeed: string, downloadSpeed: string): string {
    // Format: upload/download (e.g., "1M/5M" for 1Mbps up, 5Mbps down)
    return `${uploadSpeed}/${downloadSpeed}`;
  }

  // Helper method to convert time to seconds
  formatSessionTimeout(hours: number): string {
    return `${hours * 3600}s`;
  }
}

export default new MikrotikService();