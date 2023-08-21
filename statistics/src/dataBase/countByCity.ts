import {model, Schema} from "mongoose";
import {ICityForCountModel} from "../interfaces/model";
import {ICityForCount} from "../interfaces/common";

const CountByCitySchema = new Schema({
    name_ua: {
        type: String,
    },
    name_en: {
        type: String,
    },
    url: {
        type: String
    }
}, {timestamps: true});

const CityForCount: ICityForCountModel = model<ICityForCount, ICityForCountModel>('cityForCount', CountByCitySchema);

export {
    CityForCount
}