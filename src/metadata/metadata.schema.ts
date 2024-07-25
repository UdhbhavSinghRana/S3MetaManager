import { Schema } from "dynamoose";

export const metaDataSchema = ({
    id: {
        type: String,
    },
    fileName: {
        type: String,
    },
    rowCount: {
        type: Number
    },
    idCount: {
        type: Number
    }
})