import { Link, redirect, useLoaderData } from "remix";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { getUser } from "~/utils/session.server";
export const loader = async ({ params, request }) => {
    const user = await getUser(request)
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    })
    if (!post) throw new Error('Post not found')
    const data = { post, user }
    return data
}
export const action = async ({ request, params }) => {
    const form = await request.formData();
    const title = form.get('title');
    const body = form.get('body');
    const fields = { title, body };
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    })
    const user = await getUser(request)
    if (user && post.userId === user.id) {
        await prisma.post.update({ data: fields, where: { id: params.id } });
    }
    return redirect(`/posts/${post.id}`);
}
function UpdatePost() {
    const { post } = useLoaderData();
    return (
        <>
            <div className="page-header">
                <h1>Update Post</h1>
            </div>
            <div className="page-content">
                <form method="post">
                    <div className="form-control">
                        <label htmlFor="title">Title :</label>
                        <input type="text" name="title" id="title" defaultValue={post.title} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="body">Body :</label>
                        <textarea name="body" id="body" rows="10" defaultValue={post.body} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-block">
                        Update <i className="fas fa-edit"></i>
                    </button>
                </form>
            </div>
        </>
    );
}

export default UpdatePost;
