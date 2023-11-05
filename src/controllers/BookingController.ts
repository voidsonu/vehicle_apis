import { Request, Response, NextFunction, response } from "express";
import CommonModel from "../models/CommonModel";
import moment from "moment";

// import moment from "moment";
export default class BookingController {
  private commonModel;
  private commonModelUser;
  private commonModelVehicle;
  private idColumn = "booking_id";
  private usersIdColumn = "user_id";
  private vehicleIdColumn = "vehicle_id";

  constructor() {
    (this.commonModel = new CommonModel("bookings", this.idColumn, [])),
      (this.commonModelUser = new CommonModel("users", this.usersIdColumn, [
        "firstName",
        "lastName",
      ]));
    this.commonModelVehicle = new CommonModel(
      "vehicles",
      this.vehicleIdColumn,
      []
    );

    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
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

  // create
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // take input from request body
      let inputData = req.body;
      if (!inputData) {
        res.status(422).send({ message: `No input data` });
      }
      if (inputData) {
        if (moment(inputData.from_date) > moment(inputData.till_date)) {
          return next(inputData);
        }
      }
      const [userData, vehicleData] = await Promise.all([
        this.commonModelUser.list({ user_id: inputData.user_id }),
        this.commonModelVehicle.list({ vehicle_id: inputData.vehicle_id }),
      ]);
      if (!userData) {
        res.status(422).send({
          message: `User not found`,
        });
      }

      if (!vehicleData) {
        res.status(422).send({
          message: `Vehicle not found`,
        });
      }

      // create new entry
      const result = await this.commonModel.create(inputData);
      if (!result) {
        return next(result);
      }

      // return result
      const data = {
        success: true,
        message: `Booking Added Successfully`,
        data: result[0],
      };

      return res.send(data);
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
        inputData.booking_id,
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
        message: `Booking Updated Successfully`,
        data: result[0],
      };
      // return
      return res.send(response);
    } catch (error: any) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // getting data what to delete
      const { ids } = req.body;
      // @ts-ignore
      const idArr: number[] = ids.map((el) => parseInt(el));

      // controller
      const data = await this.commonModel.softDelete(idArr);

      // check
      if (!data) {
        return next(data);
      }

      //   result
      const result = {
        success: true,
        message: `Booking Of ID ${idArr} deleted`,
      };
      return res.send(result);
    } catch (error: any) {
      return next(error);
    }
  }
}
