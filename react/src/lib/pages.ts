import { Pages } from "./db";

export const getAllPages = async () => {
    const pages = await (await Pages()).find({}).toArray();
    return pages;
  };
  