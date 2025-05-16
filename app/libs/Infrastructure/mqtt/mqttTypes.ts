export interface IMqttClient {
  connect: () => Promise<boolean>;
  publish: (
    topic: string,
    message: string,
    options: ClientPublishOptionsInterface
) => Promise<boolean>;
subscribe: (
    topic: string,
    options: ClientSubscribeOptionsInterface,
    OnMessageCallback: (
      topic: string,
      message: Buffer<ArrayBufferLike>
    ) => void,
  ) => Promise<boolean>;
  close: () => Promise<void>;
}

export declare type QoS = 0 | 1 | 2;
export interface ClientSubscribeOptionsInterface {
  qos: QoS;
  nl?: boolean;
  rap?: boolean;
  rh?: number;
}
export interface ClientPublishOptionsInterface {
    qos: QoS;
    properties?:IPublishprops
}

export interface IPublishprops{
    messageExpiryInterval?: number,
    topicAlias?: number,
    responseTopic?: string,
    correlationData?: Buffer,
    subscriptionIdentifier?: number | number[],
    contentType?: string
}