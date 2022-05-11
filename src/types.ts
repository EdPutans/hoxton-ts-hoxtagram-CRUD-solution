export type Card = {
  id: number;
  title: string;
  likes: number;
  image: string;
  comments?: Comment[]
}

export type Comment = {
  imageId: number;
  content: string;
  id: number;
}
