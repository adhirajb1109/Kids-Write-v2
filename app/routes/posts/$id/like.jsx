import { redirect } from 'remix'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
export const action = async ({ params }) => {
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });
    await prisma.post.update({ data: { likes: post.likes + 1 }, where: { id: params.id } });
    return redirect(`/posts/${post.id}`);
}
