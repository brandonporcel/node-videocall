// import { OSChannels } from '@common/enums/onesignal.enum';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

type SendCallNotificationBody = {
  userOneSignalId: string;
  title: string;
};

@Injectable()
export class OneSignalService {
  private readonly apiKey = process.env.ONESIGNAL_API_KEY;
  private readonly appId = process.env.ONESIGNAL_APP_ID;

  constructor() {}

  async sendCallNotification(body: SendCallNotificationBody) {
    try {
      const a = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: this.appId,
          name: 'qubit notification',
          include_aliases: { onesignal_id: [body.userOneSignalId] },
          target_channel: 'push',
          headings: { en: body.title || 'Nombre usuario' },
          contents: { en: 'Videollamada entrante' },
          android_channel_id: '7936279d-eb47-4989-b227-3f554eb42d2a',
          buttons: [
            { id: 'id1', text: 'Contestar', icon: 'ic_menu_share' },
            { id: 'id2', text: 'Ignorar', icon: 'ic_menu_share' },
          ],
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.apiKey}`,
          },
        },
      );
      console.log('a.data', a.data);
    } catch (error) {
      console.error('dentro ', JSON.stringify(error));
    }
  }

  async deleteOldUser(oneSignalId: string) {
    const apiKey = process.env.ONESIGNAL_API_KEY;
    const appId = process.env.ONESIGNAL_APP_ID;
    console.log('appId', appId);
    console.log('apiKey', apiKey);
    console.log('oneSignalId', oneSignalId);
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
