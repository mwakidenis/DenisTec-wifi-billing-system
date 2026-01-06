import { PrismaClient } from '@prisma/client';
import mikrotikService from './mikrotikService';
import smsService from './smsService';

const prisma = new PrismaClient();

export class SessionService {
  async createSession(userId: string, planId: string, sessionToken: string): Promise<any> {
    try {
      const plan = await prisma.plan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        throw new Error('Plan not found');
      }

      const endTime = new Date();
      endTime.setHours(endTime.getHours() + plan.duration);

      const session = await prisma.session.create({
        data: {
          userId,
          planId,
          sessionToken,
          endTime,
          status: 'ACTIVE'
        },
        include: {
          user: true,
          plan: true
        }
      });

      // Create MikroTik user profile based on plan
      const profileName = `plan_${plan.id}`;
      const speedLimit = this.parseSpeedLimit(plan.speedLimit);
      const sessionTimeout = mikrotikService.formatSessionTimeout(plan.duration);

      try {
        await mikrotikService.createUserProfile(
          profileName,
          speedLimit,
          sessionTimeout
        );
      } catch (error) {
        console.log('Profile might already exist, continuing...');
      }

      // Create hotspot user
      await mikrotikService.createHotspotUser(
        sessionToken,
        sessionToken,
        profileName
      );

      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Update session status
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          status: 'TERMINATED',
          endTime: new Date()
        }
      });

      // Remove from MikroTik
      await mikrotikService.removeHotspotUser(session.sessionToken);

      console.log(`✅ Session terminated: ${sessionId}`);
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  }

  async getActiveSession(sessionToken: string): Promise<any> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: true,
          plan: true
        }
      });

      if (!session || session.status !== 'ACTIVE') {
        return null;
      }

      // Check if session has expired
      if (session.endTime && new Date() > session.endTime) {
        await this.terminateSession(session.id);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  async getUserActiveSessions(userId: string): Promise<any[]> {
    try {
      return await prisma.session.findMany({
        where: {
          userId,
          status: 'ACTIVE',
          endTime: {
            gt: new Date()
          }
        },
        include: {
          plan: true
        },
        orderBy: {
          startTime: 'desc'
        }
      });
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  async updateSessionUsage(sessionToken: string, dataUsed: number): Promise<void> {
    try {
      await prisma.session.update({
        where: { sessionToken },
        data: { dataUsed }
      });
    } catch (error) {
      console.error('Error updating session usage:', error);
    }
  }

  private parseSpeedLimit(speedLimit: string): string {
    // Convert "10Mbps" to "10M/10M" format for MikroTik
    const speed = speedLimit.replace(/[^\d]/g, '');
    const unit = speedLimit.includes('Gbps') ? 'G' : 'M';
    return `${speed}${unit}/${speed}${unit}`;
  }
}

// Cleanup expired sessions
export const sessionCleanup = async (): Promise<void> => {
  try {
    const expiredSessions = await prisma.session.findMany({
      where: {
        status: 'ACTIVE',
        endTime: {
          lt: new Date()
        }
      }
    });

    for (const session of expiredSessions) {
      await new SessionService().terminateSession(session.id);
      
      // Send expiry notification
      const user = await prisma.user.findUnique({
        where: { id: session.userId }
      });

      if (user) {
        await smsService.sendSMS(
          user.phone,
          'Your internet session has expired. Purchase a new plan to continue browsing. - COLLOSPOT'
        );
      }
    }

    if (expiredSessions.length > 0) {
      console.log(`🧹 Cleaned up ${expiredSessions.length} expired sessions`);
    }
  } catch (error) {
    console.error('Error during session cleanup:', error);
  }
};

export default new SessionService();