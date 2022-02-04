import { redirect } from 'remix'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
export const action = async ({ params , request}) => {
    const form = await request.formData();
    const comment = form.get('comment');
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });
    await prisma.comment.create({ data: { body: comment, postId: post.id} });
    return redirect(`/posts/${post.id}`);
}
