import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OSChannel } from '@common/enums/oneSignal.enum';

interface NotificationBody {
  userOneSignalId: string;
  title: string;
}

interface SendCallNotificationBody extends NotificationBody {}

interface SendMsgNotificationBody extends NotificationBody {
  userId: string;
  msg: string;
}

@Injectable()
export class OneSignalService {
  private readonly apiKey = process.env.ONESIGNAL_API_KEY;
  private readonly appId = process.env.ONESIGNAL_APP_ID;
  private apiUrl = 'https://onesignal.com/api/v1/notifications';
  private headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${this.apiKey}`,
  };

  constructor() {}

  async sendCallNotification(body: SendCallNotificationBody) {
    const notificationData = {
      include_aliases: { onesignal_id: [body.userOneSignalId] },
      headings: { en: body.title || 'Nombre usuario' },
      contents: { en: 'Videollamada entrante' },
      android_channel_id: OSChannel.IncomingCall,
      buttons: [
        { id: 'id1', text: 'Contestar', icon: 'ic_menu_share' },
        { id: 'id2', text: 'Ignorar', icon: 'ic_menu_share' },
      ],
    };

    await this.sendNotification(notificationData);
  }

  async sendMsgNotification(body: SendMsgNotificationBody, data: any) {
    const notificationData = {
      include_aliases: { onesignal_id: [body.userOneSignalId] },
      headings: { en: body.title || 'Nombre usuario' },
      contents: { en: body.msg },
      data: {
        type: 'new-message',
        ...data,
      },
    };

    await this.sendNotification(notificationData);
  }

  private async sendNotification(notificationData: any) {
    try {
      await axios.post(
        this.apiUrl,
        {
          ...notificationData,
          app_id: this.appId,
          name: 'qubit notification',
          target_channel: 'push',
        },
        {
          headers: this.headers,
        },
      );
    } catch (error) {
      console.error('Error sending notification:', JSON.stringify(error));
    }
  }

  async deleteOldUser(oneSignalId: string) {
    const apiKey = process.env.ONESIGNAL_API_KEY;
    const appId = process.env.ONESIGNAL_APP_ID;

    await axios.delete(
      `https://api.onesignal.com/apps/${appId}/users/by/onesignal_id/${oneSignalId}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic ' + apiKey,
        },
      },
    );
  }
}
