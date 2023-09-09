import Notification from '../database/models/notification.model';

export default class NotificationService {
  static async createNotification(data: Partial<Notification>) {
    const notification = await Notification.create(data);
    return notification;
  }

  static async getAllNotifications(
    filter: Partial<Notification>,
    options: {
      orderBy?: string;
      page?: string;
      limit?: string;
      populate?: string;
    } = {},
    ignorePagination = false,
  ) {
    const data = ignorePagination
      ? await Notification.find({ ...filter })
      : await Notification.paginate(filter, options);
    return data;
  }
}
