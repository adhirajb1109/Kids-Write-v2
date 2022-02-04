import { useLoaderData, Link, redirect } from "remix";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getUser } from "~/utils/session.server";
export const loader = async ({ params, request }) => {
    const user = await getUser(request)
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });
    const comments = await prisma.comment.findMany({
        where: {postId: params.id}
    })
    const data = { post, user,comments };
    return data
}
export const action = async ({ request, params }) => {
    const form = await request.formData()
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    })
    const user = await getUser(request)
    if (form.get('_method') === 'delete') {
        if (user && post.userId === user.id) {
            await prisma.post.delete({ where: { id: params.id } })
        }
        return redirect('/posts')
    }
}
function Post() {
    const { post, user,comments } = useLoaderData();
    return (
        <div>
            <div className="page-header">
                <h1>{post.title}</h1>
                <Link to="/posts" className="btn btn-reverse">Back</Link>
            </div>
            <div className="page-content">
                <p className="post-content">{post.body}</p>
            </div>
            <div className="page-footer">
                {user && user.id === post.userId && (
                    <>
                        <form method='POST'>
                            <input type='hidden' name='_method' value='delete' />
                            <button className='btn btn-delete'>Delete</button>
                        </form>
                        <Link to={`/posts/update/${post.id}`} className="btn">Update</Link>
                    </>
                )}
                <form method='POST' action={`/posts/${post.id}/like`}>
                    <button className='btn btn-reverse' type="submit">🖤 {post.likes}</button>
                </form>
            </div>
            <form method='POST' action={`/posts/${post.id}/comment`}>
                    <div className="form-control">
                        <label htmlFor="comment">Comment : </label>
                        <input type="text" name="comment" id="comment" required />
                    </div>
                    <button className='btn' type="submit">Add Comment</button>
            </form>
            <br />
            <h2>Comments</h2>
            {comments.map((comment) => <p className="post-content">{comment.body}</p>)}
        </div>
    );
}

export default Post;
