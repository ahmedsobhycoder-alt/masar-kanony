import { getFcm } from "./firebaseService";
import { Message } from "firebase-admin/messaging";

export interface PushNotificationPayload {
  token?: string;
  tokens?: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

class PushNotificationService {
  /**
   * Send notification to a single device token
   */
  async sendToDevice({ token, title, body, data = {} }: PushNotificationPayload) {
    if (!token) return null;

    const message: Message = {
      token,
      notification: {
        title,
        body,
      },
      data,
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    return await getFcm().send(message);
  }

  /**
   * Send notification to multiple device tokens using modern sendEach()
   */
  async sendMulticast({ tokens, title, body, data = {} }: PushNotificationPayload) {
    if (!tokens || tokens.length === 0) return null;

    // Build an array of standard Message objects
    const messages: Message[] = tokens.map((token) => ({
      token,
      notification: {
        title,
        body,
      },
      data,
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    }));

    // sendEach handles batching and replaces legacy sendEachForMulticast / MulticastMessage
    return await getFcm().sendEach(messages);
  }

  /**
   * Send to a subscribed Topic
   */
  async sendToTopic(topic: string, title: string, body: string, data: Record<string, string> = {}) {
    const message: Message = {
      topic,
      notification: {
        title,
        body,
      },
      data,
    };

    return await getFcm().send(message);
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;