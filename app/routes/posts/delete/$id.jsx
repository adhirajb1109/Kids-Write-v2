import { redirect } from 'remix'
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const action = async ({ request, params }) => {
    const user = await getUser(request)
    const post = await db.post.findUnique({
        where: { id: params.id },
    })
    if (user === null) {
        throw new Response("Unauthorized", { status: 401 });
    }
    else {
        if (post.userId === user.id) {
            await db.post.delete({ where: { id: params.id } })
        }
    }
    return redirect('/posts')
}
export const loader = async () => {
    return redirect('/posts')
}