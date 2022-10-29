// simple types
export type TreeItem = {
  children:TreeItem[],
  name:string,
}|string;

export type NameTree = TreeItem[]

export type LeafDetail = {
  value:string,
  count:number
}[]
