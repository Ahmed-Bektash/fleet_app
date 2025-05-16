import Knex, { Knex as KnexInterface } from "knex";
import knexConfig from "./knexfile";
import { Model } from "objection";
export class ObjectionWrapper {
  private static knexInstance: KnexInterface;

  constructor() {
    this.connect();
  }

  public connect = (): KnexInterface => {
    // Initialize knex.
    if (ObjectionWrapper.knexInstance == null) {
      ObjectionWrapper.knexInstance = Knex(knexConfig);
      Model.knex(ObjectionWrapper.knexInstance);
    }
    return ObjectionWrapper.knexInstance;
  };

  public close = (): Promise<boolean> => {
    let result = false;
    ObjectionWrapper.knexInstance
      .destroy()
      .then(() => {
        result = true;
      })
      .catch((error) => {
        result = false;
        console.error("Error closing the database connection:", error);});
    return Promise.resolve(result);
  };
}
