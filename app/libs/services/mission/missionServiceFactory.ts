import { MQTTServiceFactory } from "../../Infrastructure/mqtt/mqttServiceFactory";
import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
import { E_QOS, E_TOPICS } from "../../shared/types/businessTypes";
import { HttpRequest } from "../../shared/types/generalTypes";
import { Controller } from "../../shared/utils/Controller";
import { VehicleDataHandler } from "../vehicle/vehicleDataHandler";
import { CreateMissionUseCase } from "./createMissionUseCase";
import { MissionDataHandler } from "./missionDataHandler";
import { ICreateMission, IReceiveMissionStatus } from "./missionTypes";
import { ReceiveMissionStatusUseCase } from "./receiveMissionStatsUseCase";

export class MissionServiceFactory {
  private readonly MissionDataHandler = MissionDataHandler.getInstance();
  private readonly messageClient = new MQTTServiceFactory().makeMqttService();
  private readonly VehicleDataHandler = VehicleDataHandler.getInstance();

  /**
   * @requires: to be called during the application startup
   * @description: this method will create a subscriber to the Mission register topic
   */
  public async makeReceiveMissionStatusSubscriber(messageClient:IMqttClient) {
 
      const subscribe = await messageClient.subscribe(
        E_TOPICS.MISSION_STATUS,
        { qos: E_QOS.AT_LEAST_ONCE },
        this.receiveMissionStatsSubscriberCallback
      );
      return subscribe;
  }

  public async makeCreateMissionController() {
    const usecase = new CreateMissionUseCase(
      this.VehicleDataHandler,
      this.MissionDataHandler,
      this.messageClient);

      const controller = new Controller(usecase,this.createMissionRequestAdapter);

      return controller;
  }


  private readonly createMissionRequestAdapter = (
    HttpRequest:HttpRequest,
  ): ICreateMission => {

    //TODO: validate the body
    const body = HttpRequest.body as ICreateMission;
     return body;
  };

  
  public async receiveMissionStatsSubscriberCallback(
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): Promise<void> {
    const receiveMissionStatusRequestAdapter = (
    topic: string,
    message: Buffer<ArrayBufferLike>
  ): IReceiveMissionStatus => {
    const messageString = message.toString();
    const messageJson = JSON.parse(messageString) as IReceiveMissionStatus;
    //TODO: validate the messageJson
     return messageJson;
  };
    try {
      const messageClient = new MQTTServiceFactory().makeMqttService();
      const usecase = await new ReceiveMissionStatusUseCase(
        VehicleDataHandler.getInstance(),
        MissionDataHandler.getInstance(),
        messageClient
      ).execute(receiveMissionStatusRequestAdapter(topic, message));

      if (!usecase.state) {
        // handle error here
      }
    } catch (error) {
      console.error("Error in registerMission:", error);
    }
  }


}
