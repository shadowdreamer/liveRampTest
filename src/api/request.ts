import type { NameTree, LeafDetail} from "../types";

export const getTree = async () => {
  const res = await fetch('/mock/treeData.json');
  return await res.json() as NameTree;
};

export const getValues = async (type:string) => {
  const res = await fetch(`/mock/${type}.json`);
  return await res.json() as LeafDetail;
};
