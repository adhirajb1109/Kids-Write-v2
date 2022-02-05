import { redirect } from 'remix'
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const action = async ({ params, request }) => {
    const user = await getUser(request);
    const post = await db.post.findUnique({
        where: { id: params.id },
    });
    if (user === null) {
        throw new Response("Unauthorized", { status: 401 });
    }
    else {
        await db.post.update({ data: { likes: post.likes + 1 }, where: { id: params.id } });
        return redirect(`/posts/${post.id}`);
    }
}
export const loader = async () => {
    return redirect('/posts')
}