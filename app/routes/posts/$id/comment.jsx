import { redirect } from 'remix'
import { db } from "~/utils/db.server";
export const action = async ({ params , request}) => {
    const form = await request.formData();
    const comment = form.get('comment');
    const post = await db.post.findUnique({
        where: { id: params.id },
    });
    await db.comment.create({ data: { body: comment, postId: post.id} });
    return redirect(`/posts/${post.id}`);
}
