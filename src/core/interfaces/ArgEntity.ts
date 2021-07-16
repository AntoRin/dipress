export interface ArgEntity {
   argModel: { type: "context" | "param" | "query" | "body"; key?: string }[];
   index: number;
}
