export interface Mapper<Model, Entity, CreateModel,RelationEntity> {
    toModel(entity: Entity): Model;
    toEntity(model: CreateModel, entity?: RelationEntity): Entity;
}