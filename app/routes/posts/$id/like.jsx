import { redirect } from 'remix'
import { db } from "~/utils/db.server";
export const action = async ({ params }) => {
    const post = await db.post.findUnique({
        where: { id: params.id },
    });
    await db.post.update({ data: { likes: post.likes + 1 }, where: { id: params.id } });
    return redirect(`/posts/${post.id}`);
}
