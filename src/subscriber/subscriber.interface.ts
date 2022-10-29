export default interface SubscriberInterface {
  addSubscriber(subscriber): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAllSubscribers(params: {}): Promise<{ data: [] }>;
}
