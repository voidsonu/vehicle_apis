// Common model for the controller to use
import { ProvidersFactory } from "../libs/ProvidorsFactory";

export default class CommonModel {
  private TABLE_NAME: string;
  private ID_COLUMN: string;
  private SEARCH_COLUMN_NAME: string[];
  constructor(tableName: string, idColumn: string, searchColumn: string[]) {
    this.TABLE_NAME = tableName;
    this.ID_COLUMN = idColumn;
    this.SEARCH_COLUMN_NAME = searchColumn;
  }
  // create
  create = async (input: any) => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction();
    try {
      query("BEGIN");
      for (let i = 0; i < input.length; i++) {}
      const sql = `
    INSERT INTO "${this.TABLE_NAME}" ("${Object.keys(input).join('", "')}") 
    VALUES('${Object.values(input)
      .map((el) => el)
      .join("', '")}')
    RETURNING*
    `;
      console.log(sql);
      query("COMMIT");
      const { rows } = await query(sql);
      return rows;
      // handle insert data
    } catch (error) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };

  // list
  list = async (
    filter: any,
    range?: any,
    sort?: any,
    fields?: string[],
    isCount?: boolean
  ) => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(
      process.env.DB_NAME as string
    );
    try {
      // filters
      let whereArr: string[] = [`"deleted_at" IS NULL`];

      if (filter && Object.keys(filter).length) {
        Object.keys(filter).map((column) => {
          if (
            filter[column] === undefined ||
            filter[column] === null ||
            String(filter[column]).trim() === ""
          ) {
            return;
          }
          if (column === "search") {
            let whereSearch: string[] = this.SEARCH_COLUMN_NAME.map((el) => {
              return `"${el}" ILIKE '%${filter[column]}%'`;
            });
            whereArr.push(`(${whereSearch.join(" OR ")})`);
          } else {
            switch (typeof filter[column] as string) {
              case "number":
                whereArr.push(`"${column}" = ${filter[column]}`);
                break;
              case "object":
                if (Array.isArray(filter[column])) {
                  whereArr.push(`"${column}" IN(${filter[column].join(", ")})`);
                }
                break;
              default:
                whereArr.push(`"${column}" = '${filter[column]}'`);
            }
          }
        });
      }

      // pagination
      let limit: number = 100;
      let offset: number = 0;
      if (range) {
        range.page = range.page ? range.page : 1;
        limit = range.pageSize;
        offset = (range.page - 1) * range.pageSize;
      }

      // sorting
      let sortArr: string[] = [`"created_at" DESC`];
      if (sort && Object.keys(sort).length > 0) {
        sortArr = Object.keys(sort).map((key) => `"${key}" ${sort[key]}`);
      }

      let sqlFields;
      if (fields) {
        if (fields.length > 0) {
          if (!isCount) {
            sqlFields = `"${fields.join('", "')}"`;
          } else {
            sqlFields = `${fields[0]}`;
          }
        }
      } else {
        sqlFields = `*`;
      }

      let sql: string = `
            SELECT ${sqlFields}
            FROM "${this.TABLE_NAME}"
            WHERE ${whereArr.join(" AND ")}
        `;
      if (!isCount) {
        sql += `
                ORDER BY ${sortArr.join("', '")}
                LIMIT ${limit} OFFSET ${offset}
            `;
      }

      // executing sql query
      const { rows } = await query(sql);

      return rows;
    } catch (error: any) {
      throw error;
    } finally {
      release();
    }
  };

  // update
  //  update
  update = async (id: number, inputData: any) => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(
      process.env.DB_NAME as string
    );
    try {
      query("BEGIN");
      // sql
      let updateArr: string[] = [];
      Object.keys(inputData).forEach((column) => {
        let value =
          ["number", "boolean"].indexOf(typeof inputData[column]) >= 0
            ? inputData[column]
            : `'${inputData[column]}'`;
        updateArr.push(`"${column}" = ${value}`);
      });

      const sql: string = `
            UPDATE "${this.TABLE_NAME}"
            SET ${updateArr.join(", ")}
            WHERE "${this.ID_COLUMN}" = ${id}
        `;
      const result = await query(sql);

      // results
      query("COMMIT");
      return result;
    } catch (error: any) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };

  softDelete = async (ids: number[]) => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(
      process.env.DB_NAME as string
    );
    try {
      query("BEGIN");
      // const values: any = [...ids]
      const sql: string = `
            UPDATE "${this.TABLE_NAME}"
            SET "deleted_at" = CURRENT_TIMESTAMP
            WHERE "${this.ID_COLUMN}" IN(${ids.join(", ")})
        `;
      // executing query
      const result = await query(sql);

      query("COMMIT");
      // result
      return result;
    } catch (error: any) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };
}
