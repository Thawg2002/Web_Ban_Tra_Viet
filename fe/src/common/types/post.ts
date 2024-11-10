export interface Post {
    team: boolean;
    mission: string;
    introduction: string;
    _id?: string;
    title: string;
    slug: string;
    content: string;
    description: string;
    author: string;
    authorImage?: string;
    image?: string;
    category: string;
    createdAt?: string;
}