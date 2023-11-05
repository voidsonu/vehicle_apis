import { Request, Response, NextFunction, response } from "express";
import CommonModel from "../models/CommonModel";

// import moment from "moment";
export default class VehicleController {
  private commonModel;
  private idColumn = "vehicle_id";

  constructor() {
    this.commonModel = new CommonModel("vehicles", this.idColumn, [
      "vehicle_type",
      "vehicle_model",
      "number_of_wheel",
    ]);

    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // getting data from body
      let inputData = req.body;

      //getting data from models list
      const data = await this.commonModel.list(
        inputData.filter,
        inputData.range,
        inputData.sort
      );
      if (!data) {
        return next(data);
      }
      // get total count from models list
      const [{ total }]: any = await this.commonModel.list(
        inputData.filter,
        {},
        {},
        [`COUNT("${this.idColumn}")::integer AS total`],
        true
      );
      if (!total) {
        return next(total);
      }

      // result
      const result = {
        success: true,
        message: `Result of your Search`,
        total,
        data,
      };

      // return results
      return res.send(result);
    } catch (error: any) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // declare id and data
      const inputData = req.body;

      // error handling
      if (!inputData || !Object.keys(inputData).length) {
        return next({
          status: 400,
          code: "invalid_request",
          message: "Please enter required fields",
        });
      }

      // fetching updated data
      const updatedData = await this.commonModel.update(
        inputData.user_id,
        inputData
      );
      if (!updatedData) {
        return next(updatedData);
      }

      // // finding data and show it in responce
      const result = await this.commonModel.list({
        user_id: inputData.user_id,
      });
      if (!result) {
        return next(result);
      }

      // result
      const response = {
        success: true,
        message: `Vehicles Updated Successfully`,
        data: result[0],
      };
      // return
      return res.send(response);
    } catch (error: any) {
      return next(error);
    }
  }
}
