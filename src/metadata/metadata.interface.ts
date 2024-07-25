export interface MetaKey {
    id: string;
}

export interface Meta extends MetaKey {
    fileName: string,
    rowCount: Number
    idCount: Number
}