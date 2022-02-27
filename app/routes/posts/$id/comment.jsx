import { redirect } from 'remix'
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const action = async ({ params, request }) => {
    const form = await request.formData();
    const comment = form.get('comment');
    const user = await getUser(request);
    const post = await db.post.findUnique({
        where: { id: params.id },
    });
    if (user === null) {
        throw new Response("Unauthorized", { status: 401 });
    }
    else {
        await db.comment.create({ data: { body: comment, postId: post.id, username: user.username } });
        return redirect(`/posts/${post.id}`);
    }
}
export const loader = async () => {
    return redirect('/posts')
}