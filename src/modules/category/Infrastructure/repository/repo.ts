import { Sequelize } from "sequelize";
import { CategorySchema, CategoryStatus, CategoryType } from "../../model";
import { pagingDTO } from "../../../../share/model/paging";
import {
  CategoryCondSchema,
  CategoryCondType,
  CategoryUpdateType,
} from "../../model/dto";
import { Op } from "sequelize";
import { ICategoryRepository } from "../../interface";

export class CategoryRepository implements ICategoryRepository {
  constructor(
    private readonly sequalize: Sequelize,
    private readonly modelName: string
  ) {}

  detail = async (id: string): Promise<CategoryType | null> => {
    const result = await this.sequalize.models[this.modelName].findByPk(id);
    if (!result) return null;

    // CategorySchema.parse(result.get({plain : true}))
    // return result.get({plain : true}) as unknown as CategoryType;

    return CategorySchema.parse(result.get({ plain: true }));
  };

  list = async (
    cond: CategoryCondType,
    paging: pagingDTO
  ): Promise<Array<CategoryType>> => {
    const { page, limit } = paging;

    const validatedCond = CategoryCondSchema.parse(cond);

    const _where: any = {
      status: { [Op.ne]: CategoryStatus.Deleted },
    };

    if (validatedCond.name) {
      _where.name = { [Op.like]: `%${validatedCond.name}%` };
    }

    if (validatedCond.parentId) {
      _where.parentId = validatedCond.parentId;
    }

    if (validatedCond.status) {
      _where.status = validatedCond.status;
    }

    const { rows, count } = await this.sequalize.models[
      this.modelName
    ].findAndCountAll({
      where: _where,
      order: [["id", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    paging.total = count;
    return rows.map((item) => CategorySchema.parse(item.get({ plain: true })));
  };

  insert = async (data: CategoryType): Promise<CategoryType> => {
    const result = await this.sequalize.models[this.modelName].create(data);
    return result as unknown as CategoryType;
  };

  update = async (id: string, data: CategoryUpdateType): Promise<any> => {
    await this.sequalize.models[this.modelName].update(
      data,
      {
        where: { id },
      }
    );

    const CategoryRecord = await this.sequalize.models[this.modelName].findByPk(id);
    return CategorySchema.parse(CategoryRecord);
  };

  delete = async (id: string, isHard: boolean): Promise<boolean> => {
    if (isHard) {
      await this.sequalize.models[this.modelName].destroy({ where: { id } });
      return true;
    }
    await this.sequalize.models[this.modelName].update(
      { status: CategoryStatus.Deleted },
      { where: { id } }
    );
    return true;
  };

  byName = async (name: string): Promise<CategoryType | null> => {
    const result = await this.sequalize.models[this.modelName].findOne({
      where: {
        name,
      },
    });
    return result as unknown as CategoryType | null;
  };
}
