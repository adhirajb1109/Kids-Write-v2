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
        where: { postId: params.id }
    })
    const data = { post, user, comments };
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
    const { post, user, comments } = useLoaderData();
    return (
        <div>
            <div className="page-header">
                <h1>{post.title}</h1>
            </div>
            <div className="page-content">
                <p className="post-content">{post.body}</p>
            </div>
            <div className="page-footer">
                {user && user.id === post.userId && (
                    <>
                        <form method='POST'>
                            <input type='hidden' name='_method' value='delete' />
                            <button className='btn'><i className="far fa-trash-alt"></i></button>
                        </form>
                        <Link to={`/posts/update/${post.id}`} className="btn"><i className="fas fa-edit"></i></Link>
                    </>
                )}
                <form method='POST' action={`/posts/${post.id}/like`}>
                    <button className='btn' type="submit"><i class="fas fa-thumbs-up icon-right"></i>{post.likes}</button>
                </form>
            </div>
            <br />
            <div className="post-content">
                <form method='POST' action={`/posts/${post.id}/comment`}>
                <div className="form-control">
                    <h2><label htmlFor="comment">Add Comment : </label></h2>
                    <input type="text" name="comment" id="comment" required />
                </div>
                    <button className='btn' type="submit">Add <i class="fas fa-plus icon"></i></button>
                </form>
                <br />
                <h2>Comments</h2>
                {comments.map(comment => (<p className="post-content">{comment.body}</p>))}
            </div>
        </div>
    );
}

export default Post;
